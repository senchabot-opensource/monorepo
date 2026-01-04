package twitchapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	discordwebhook "github.com/bensch777/discord-webhook-golang"
	"github.com/senchabot-opensource/monorepo/model"
)

func (s *service) doRequest(method string, path string, token string) (*http.Response, error) {
	// TODO: change this to the cooldown period
	req, err := http.NewRequest(method, s.baseURL+path, nil)
	if err != nil {
		return nil, fmt.Errorf("[twitchapi.doRequest] failed to create request: %w", err)
	}

	req.Header.Set("Client-ID", s.clientID)
	req.Header.Set("Authorization", "Bearer "+token)

	return s.httpClient.Do(req)
}

func (s *service) getUserInfo(query string, userIdOrName string) (*model.TwitchUserInfo, error) {
	if userIdOrName == "" {
		return nil, errors.New("[twitchapi.getUserInfo] userIdOrName is empty")
	}

	resp, err := s.doRequest("GET", fmt.Sprintf("/users?%s=%s", query, userIdOrName), s.accessToken)
	if err != nil {
		return nil, fmt.Errorf("[twitchapi.getUserInfo] failed to get user info: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("[twitchapi.getUserInfo] failed to read response body: %w", err)
		}
		return nil, fmt.Errorf("[twitchapi.getUserInfo] twitch API request failed with status code: %d Body: %s", resp.StatusCode, string(respBodyBytes))
	}

	var data struct {
		Data []model.TwitchUserInfo `json:"data"`
	}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return nil, fmt.Errorf("[twitchapi.getUserInfo] error while parsing TwitchAPI response: %w", err)
	}

	if len(data.Data) == 0 {
		return nil, errors.New("[twitchapi.getUserInfo] no data")
	}

	return &data.Data[0], nil
}

func (s *service) GetUserInfoByLoginName(loginName string) (*model.TwitchUserInfo, error) {
	return s.getUserInfo("login", loginName)
}

func (s *service) GetUserInfoById(userId string) (*model.TwitchUserInfo, error) {
	return s.getUserInfo("id", userId)
}

func (s *service) GiveShoutout(streamerUsername string, broadcasterId string, messageFormat string) (*string, error) {
	// TODO: move this method to the shoutout.go file
	var responseText string
	fromBroadcasterId := broadcasterId
	toBroadcaster, err := s.GetUserInfoByLoginName(streamerUsername)
	if err != nil {
		if err.Error() == "no data" {
			responseText = "The channel you are shouting out does not exist."
			return &responseText, nil
		}
		return nil, errors.New("[twitchapi.GiveShoutout] s.GetUserInfo failed to get user info: " + err.Error())
	}
	moderatorId := s.botUserID

	url := fmt.Sprintf("/chat/shoutouts?from_broadcaster_id=%s&to_broadcaster_id=%s&moderator_id=%s", fromBroadcasterId, toBroadcaster.ID, moderatorId)
	resp, err := s.doRequest("POST", url, strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:"))
	if err != nil {
		return nil, fmt.Errorf("[twitchapi.GiveShoutout] twitch API request failed with status code: %d", resp.StatusCode)
	}
	defer resp.Body.Close()

	var errorResp struct {
		Error   string `json:"error"`
		Message string `json:"message"`
	}
	if resp.StatusCode != http.StatusNoContent {
		respBodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("[twitchapi.GiveShoutout] failed to read response body: %w", err)
		}

		if err := json.Unmarshal(respBodyBytes, &errorResp); err != nil {
			log.Println("[twitchapi.GiveShoutout] json.Unmarshal errorResp:", err.Error())
		}
	}

	switch resp.StatusCode {
	case http.StatusNoContent:
		if messageFormat == "" {
			messageFormat = "Follow @{username} over at twitch.tv/{username} <3"
		}
		responseText = strings.ReplaceAll(messageFormat, "{username}", streamerUsername)
	case http.StatusBadRequest:
		if errorResp.Message == "The broadcaster is not streaming live or does not have one or more viewers." {
			responseText = "The channel giving a Shoutout must be live."
		} else if errorResp.Message == "The broadcaster may not give themselves a Shoutout." {
			responseText = "You cannot shoutout the current streamer."
		} else {
			responseText = "There was an error while giving shoutout"
		}
	case http.StatusTooManyRequests:
		if errorResp.Message == "The broadcaster may not give another Shoutout to the specified streamer until the cooldown period expires." {
			responseText = "You have to wait a bit before giving another Shoutout."
		} else {
			responseText = "Shoutout limit for this streamer has been exceeded or wait a bit to give another Shoutout."
		}

	default:
		responseText = "There was an error while giving shoutout"
	}

	return &responseText, nil
}

func (s *service) CheckStreamStatus(username string) (bool, string, error) {
	if username == "" {
		return false, "", errors.New("[twitchapi.CheckStreamStatus] username is empty")
	}

	resp, err := s.doRequest("GET", fmt.Sprintf("/streams?user_login=%s", username), s.accessToken)
	if err != nil {
		return false, "", fmt.Errorf("[twitchapi.CheckStreamStatus] failed to check stream status: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusBadRequest {
		return false, "", nil
	}
	
	if resp.StatusCode != http.StatusOK {
		return false, "", fmt.Errorf("[twitchapi.CheckStreamStatus] twitch API request failed with status code: %d", resp.StatusCode)
	}

	var data struct {
		Data []struct {
			Type      string `json:"type"`
			Title     string `json:"title"`
			StartedAt string `json:"started_at"`
		} `json:"data"`
	}

	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return false, "", fmt.Errorf("[twitchapi.CheckStreamStatus] error while parsing TwitchAPI response: %w", err)
	}

	if len(data.Data) == 0 {
		return false, "", nil
	}

	return data.Data[0].Type == "live", data.Data[0].Title, nil
}

func (s *service) CheckMultipleStreamers(usernames []string) ([]model.TwitchStreamerData, error) {
	hook := discordwebhook.Hook{
		Username:   "Senchabot Webhook",
		Avatar_url: "https://avatars.githubusercontent.com/u/94869947?v=4",
	}

	params := usernames[0]
	if len(usernames) > 1 {
		params = usernames[0] + "&user_id="
		usernames = usernames[1:]
		params += strings.Join(usernames, "&user_id=")
	}

	resp, err := s.doRequest("GET", fmt.Sprintf("/streams?user_id=%s", params), s.accessToken)
	if err != nil {
		hook.Content = time.Now().String() + " [twitchapi.CheckMultipleStreamers] s.doRequest error: " + err.Error()

		payload, err := json.Marshal(hook)
		if err != nil {
			log.Println("[twitchapi.CheckMultipleStreamers] Error while webhook json Marshal:", err.Error())
		}
		err = discordwebhook.ExecuteWebhook(os.Getenv("DISCORD_WEBHOOK_URL"), payload)
		if err != nil {
			log.Println("[twitchapi.CheckMultipleStreamers] ExecuteWebhook failed:", err.Error())
		}
		return nil, fmt.Errorf("[twitchapi.CheckMultipleStreamers] failed to check multiple streamers: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		if resp.StatusCode == http.StatusUnauthorized {
			hook.Content = time.Now().String() + " [twitchapi.CheckMultipleStreamers] Twitch API token is not authorized"

			payload, err := json.Marshal(hook)
			if err != nil {
				log.Println("[twitchapi.CheckMultipleStreamers] Error while webhook json Marshal:", err.Error())
			}
			err = discordwebhook.ExecuteWebhook(os.Getenv("DISCORD_WEBHOOK_URL"), payload)
			if err != nil {
				log.Println("[twitchapi.CheckMultipleStreamers] ExecuteWebhook failed:", err.Error())
			}
		}
		return nil, fmt.Errorf("[twitchapi.CheckMultipleStreamers] twitch API request failed with status code: %d", resp.StatusCode)
	}

	var data struct {
		Data []model.TwitchStreamerData `json:"data"`
	}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return nil, fmt.Errorf("[twitchapi.CheckMultipleStreamers] error while parsing TwitchAPI response: %w", err)
	}

	return data.Data, nil
}
