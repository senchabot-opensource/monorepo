package twitch

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"golang.org/x/oauth2/clientcredentials"
	"golang.org/x/oauth2/twitch"
)

var (
	twitchAPI         = "https://api.twitch.tv/helix"
	oauth2Config      *clientcredentials.Config
	twitchAccessToken string
)

func InitTwitchOAuth2Token() string {
	oauth2Config = &clientcredentials.Config{
		ClientID:     os.Getenv("TWITCH_CLIENT_ID"),
		ClientSecret: os.Getenv("TWITCH_CLIENT_SECRET"),
		TokenURL:     twitch.Endpoint.TokenURL,
	}

	token, err := oauth2Config.Token(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(token.Expiry)

	twitchAccessToken = token.AccessToken
	return twitchAccessToken
}

func GetTwitchUserInfo(query string, userIdOrName string, token string) (*models.TwitchUserInfo, error) {
	resp, err := DoTwitchHttpReq("GET", fmt.Sprintf("/users?%s=%s", query, userIdOrName), token)
	if err != nil {
		return nil, errors.New("(GetTwitchUserInfo) Error:" + err.Error())
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("Twitch API request failed with status code: " + string(rune(resp.StatusCode)))
	}

	var data struct {
		Data []models.TwitchUserInfo `json:"data"`
	}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		log.Printf("Error while parsing TwitchAPI response: %v", err)
		return nil, errors.New("Error while parsing TwitchAPI response: " + err.Error())
	}

	if len(data.Data) == 0 {
		return nil, errors.New("no data.")
	}

	return &data.Data[0], nil
}

func GiveShoutout(streamerUsername string, broadcasterId string, token string) (*string, error) {
	var responseText string
	fromBroadcasterId := broadcasterId
	toBroadcaster, err := GetTwitchUserInfo("login", streamerUsername, token)
	if err != nil {
		fmt.Println("(SoCommand) Error:", err.Error())
		return nil, err
	}
	moderatorId := os.Getenv("BOT_USER_ID")

	url := fmt.Sprintf("/chat/shoutouts?from_broadcaster_id=%s&to_broadcaster_id=%s&moderator_id=%s", fromBroadcasterId, toBroadcaster.ID, moderatorId)
	resp, err := DoTwitchHttpReq("POST", url, token)
	if err != nil {
		fmt.Printf("Twitch API request failed with status code: %s", string(rune(resp.StatusCode)))
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusTooManyRequests {
		responseText = "There was an error while giving shoutout"
	}
	if resp.StatusCode == http.StatusTooManyRequests {
		responseText = "Shoutout limit for this streamer has been exceeded or wait a bit to give another Shoutout."
	}
	if resp.StatusCode == http.StatusNoContent {
		responseText = "Follow @" + streamerUsername + " over at twitch.tv/" + streamerUsername + " <3"
	}

	return &responseText, nil
}

func CheckTwitchStreamStatus(username string, token string) (bool, string) {
	resp, err := DoTwitchHttpReq("GET", fmt.Sprintf("/streams?user_login=%s", username), token)
	if err != nil {
		log.Printf("(CheckTwitchStreamStatus) Error: %v", err)
		return false, ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Twitch API request failed with status code: %d", resp.StatusCode)
		return false, ""
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
		log.Printf("Error while parsing TwitchAPI response: %v", err)
		return false, ""
	}

	if len(data.Data) == 0 {
		return false, ""
	}

	return data.Data[0].Type == "live", data.Data[0].Title
}

func CheckMultipleTwitchStreamer(usernames []string) []models.TwitchStreamerData {
	params := usernames[0]
	if len(usernames) > 1 {
		params = usernames[0] + "&user_id="
		usernames = usernames[1:]
		params += strings.Join(usernames, "&user_id=")
	}

	resp, err := DoTwitchHttpReq("GET", fmt.Sprintf("/streams?user_id=%s", params), twitchAccessToken)
	if err != nil {
		log.Printf("(CheckMultipleTwitchStreamer) Error: %v", err)
		return nil
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		log.Printf("Twitch API request failed with status code: %d", resp.StatusCode)
		return nil
	}

	var data struct {
		Data []models.TwitchStreamerData `json:"data"`
	}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		log.Printf("Error while parsing TwitchAPI response: %v", err)
		return nil
	}

	return data.Data
}

func DoTwitchHttpReq(method string, url string, token string) (*http.Response, error) {
	req, err := http.NewRequest(method, twitchAPI+url, nil)
	if err != nil {
		return nil, errors.New("Error while creating Twitch API request:" + err.Error())
	}
	req.Header.Set("Client-ID", os.Getenv("TWITCH_CLIENT_ID"))
	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error while checking stream status: %v", err)
		return nil, err
	}

	return resp, nil
}
