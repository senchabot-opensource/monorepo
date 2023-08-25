package twitch

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

var (
	twitchAPI = "https://api.twitch.tv/helix"
)

func GetTwitchUserInfo(username string, token string) (*models.TwitchUserInfo, error) {
	resp, err := DoTwitchHttpReq("GET", fmt.Sprintf("/users?login=%s", username), token)
	if err != nil {
		return nil, errors.New("(GetTwitchUserInfo) Error:" + err.Error())
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("Twitch API request failed with status code: " + string(rune(resp.StatusCode)))
	}

	var data struct {
		Data []struct {
			ID    string `json:"id"`
			Login string `json:"login"`
		} `json:"data"`
	}

	//var data []twitchUserInfo
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return nil, errors.New("Error while parsing TwitchAPI response:" + err.Error())
	}

	if len(data.Data) == 0 {
		return nil, errors.New("len(data.Data) == 0")
	}

	return (*models.TwitchUserInfo)(&data.Data[0]), nil
}

func GiveShoutout(streamerUsername string, broadcasterId string, token string) (*string, error) {
	var responseText string
	fromBroadcasterId := broadcasterId
	toBroadcaster, err := GetTwitchUserInfo(streamerUsername, token)
	if err != nil {
		fmt.Println("(SoCommand) Error:", err.Error())
		return nil, err
	}
	moderatorId := "784786915" //os.Getenv("BOT_USER_ID")

	url := fmt.Sprintf("/chat/shoutouts?from_broadcaster_id=%s&to_broadcaster_id=%s&moderator_id=%s", fromBroadcasterId, toBroadcaster.ID, moderatorId)
	resp, err := DoTwitchHttpReq("POST", url, token)
	if err != nil {
		fmt.Printf("Twitch API request failed with status code: %s", string(rune(resp.StatusCode)))
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusTooManyRequests {
		responseText = "There was an error while giving shoutout"
	}
	if resp.StatusCode == http.StatusTooManyRequests {
		responseText = "Shoutout limit for this streamer has been exceeded or wait a bit to give another Shoutout."
	}
	if resp.StatusCode == http.StatusOK {
		responseText = "Follow @" + streamerUsername + " over at twitch.tv/" + streamerUsername + " <3"
	}

	return &responseText, nil
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
