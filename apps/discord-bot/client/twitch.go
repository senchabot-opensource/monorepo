package client

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/oauth2/clientcredentials"
	"golang.org/x/oauth2/twitch"
)

var (
	twitchAPI         = "https://api.twitch.tv/helix"
	oauth2Config      *clientcredentials.Config
	twitchAccessToken string
)

func InitTwitchOAuth2Token() {
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
}

type TwitchUserInfo struct {
	ID    string `json:"id"`
	Login string `json:"login"`
}

func GetTwitchUserInfo(username string) (*TwitchUserInfo, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/users?login=%s", twitchAPI, username), nil)
	if err != nil {
		return nil, errors.New("Error while creating Twitch API request:" + err.Error())
	}

	req.Header.Set("Client-ID", os.Getenv("TWITCH_CLIENT_ID"))
	req.Header.Set("Authorization", "Bearer "+twitchAccessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, errors.New("Error while checking stream status: " + err.Error())
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

	return (*TwitchUserInfo)(&data.Data[0]), nil
}

func CheckTwitchStreamStatus(username string) (bool, string) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/streams?user_login=%s", twitchAPI, username), nil)
	if err != nil {
		log.Printf("Error while creating Twitch API request: %v", err)
		return false, ""
	}

	req.Header.Set("Client-ID", os.Getenv("TWITCH_CLIENT_ID"))
	req.Header.Set("Authorization", "Bearer "+twitchAccessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error while checking stream status: %v", err)
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

type StreamerData struct {
	Type       string `json:"type"`
	Title      string `json:"title"`
	UserLogin  string `json:"user_login"`
	UserName   string `json:"user_name"`
	StreamGame string `json:"game_name"`
	StartedAt  string `json:"started_at"`
}

func CheckMultipleTwitchStreamer(usernames []string) []StreamerData {
	params := usernames[0]
	if len(usernames) > 1 {
		params = usernames[0] + "&user_login="
		usernames = usernames[1:]
		params += strings.Join(usernames, "&user_login=")
	}

	req, err := http.NewRequest("GET", fmt.Sprintf("%s/streams?user_login=%s", twitchAPI, params), nil)
	if err != nil {
		log.Printf("Error while creating Twitch API request: %v", err)
		return nil
	}
	req.Header.Set("Client-ID", os.Getenv("TWITCH_CLIENT_ID"))
	req.Header.Set("Authorization", "Bearer "+twitchAccessToken)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error while checking stream status: %v", err)
		return nil
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		log.Printf("Twitch API request failed with status code: %d", resp.StatusCode)
		return nil
	}

	var data struct {
		Data []StreamerData `json:"data"`
	}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		log.Printf("Error while parsing TwitchAPI response: %v", err)
		return nil
	}

	return data.Data
}
