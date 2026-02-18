package twitchapi

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"

	"github.com/senchabot-opensource/monorepo/model"
)

// TwitchService defines the interface for interacting with the Twitch Helix API.
type TwitchService interface {
	GetUserInfoByLoginName(loginName string) (*model.TwitchUserInfo, error)
	GetUserInfoById(userId string) (*model.TwitchUserInfo, error)
	CheckStreamStatus(username string) (bool, string, error)
	CheckMultipleStreamers(userIds []string) ([]model.TwitchStreamerData, error)
	GiveShoutout(username, fromBroadcasterId, messageFormat string) (*string, error)
}

const (
	defaultHelixBaseURL = "https://api.twitch.tv/helix"
	defaultTokenURL     = "https://id.twitch.tv/oauth2/token"
)

type twitchService struct {
	clientID     string
	clientSecret string
	botUserID    string
	accessToken  string
	httpClient   *http.Client
	helixBaseURL string
	tokenURL     string
	mu           sync.Mutex
}

// NewTwitchService creates a new TwitchService with an initial OAuth app access token.
func NewTwitchService(clientID, clientSecret, botUserID string) (TwitchService, error) {
	s := &twitchService{
		clientID:     clientID,
		clientSecret: clientSecret,
		botUserID:    botUserID,
		httpClient:   &http.Client{},
		helixBaseURL: defaultHelixBaseURL,
		tokenURL:     defaultTokenURL,
	}

	if err := s.authenticate(); err != nil {
		return nil, fmt.Errorf("failed to authenticate with Twitch: %w", err)
	}

	return s, nil
}

// authenticate obtains an app access token via the Client Credentials flow.
func (s *twitchService) authenticate() error {
	data := url.Values{}
	data.Set("client_id", s.clientID)
	data.Set("client_secret", s.clientSecret)
	data.Set("grant_type", "client_credentials")

	resp, err := s.httpClient.Post(s.tokenURL, "application/x-www-form-urlencoded", strings.NewReader(data.Encode()))
	if err != nil {
		return fmt.Errorf("token request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("token request returned status %d: %s", resp.StatusCode, string(body))
	}

	var tokenResp struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
		TokenType   string `json:"token_type"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return fmt.Errorf("failed to decode token response: %w", err)
	}

	s.mu.Lock()
	s.accessToken = tokenResp.AccessToken
	s.mu.Unlock()

	return nil
}

// doHelixRequest performs an authenticated GET request to the Twitch Helix API.
// It automatically refreshes the token on 401 responses and retries once.
func (s *twitchService) doHelixRequest(endpoint string) ([]byte, error) {
	s.mu.Lock()
	token := s.accessToken
	s.mu.Unlock()

	body, statusCode, err := s.executeRequest(endpoint, token)
	if err != nil {
		return nil, err
	}

	// If unauthorized, refresh token and retry once
	if statusCode == http.StatusUnauthorized {
		log.Println("[twitchapi] Access token expired, refreshing...")
		if err := s.authenticate(); err != nil {
			return nil, fmt.Errorf("failed to refresh token: %w", err)
		}

		s.mu.Lock()
		token = s.accessToken
		s.mu.Unlock()

		body, statusCode, err = s.executeRequest(endpoint, token)
		if err != nil {
			return nil, err
		}
	}

	if statusCode != http.StatusOK {
		return nil, fmt.Errorf("Helix API returned status %d: %s", statusCode, string(body))
	}

	return body, nil
}

func (s *twitchService) executeRequest(endpoint, token string) ([]byte, int, error) {
	req, err := http.NewRequest("GET", s.helixBaseURL+endpoint, nil)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Client-Id", s.clientID)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, 0, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, resp.StatusCode, fmt.Errorf("failed to read response body: %w", err)
	}

	return body, resp.StatusCode, nil
}

// GetUserInfoByLoginName returns user info for a Twitch user by their login name.
func (s *twitchService) GetUserInfoByLoginName(loginName string) (*model.TwitchUserInfo, error) {
	body, err := s.doHelixRequest("/users?login=" + url.QueryEscape(loginName))
	if err != nil {
		return nil, fmt.Errorf("GetUserInfoByLoginName error: %w", err)
	}

	var result struct {
		Data []model.TwitchUserInfo `json:"data"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to decode user info response: %w", err)
	}

	if len(result.Data) == 0 {
		return nil, fmt.Errorf("user not found: %s", loginName)
	}

	return &result.Data[0], nil
}

// GetUserInfoById returns user info for a Twitch user by their user ID.
func (s *twitchService) GetUserInfoById(userId string) (*model.TwitchUserInfo, error) {
	body, err := s.doHelixRequest("/users?id=" + url.QueryEscape(userId))
	if err != nil {
		return nil, fmt.Errorf("GetUserInfoById error: %w", err)
	}

	var result struct {
		Data []model.TwitchUserInfo `json:"data"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to decode user info response: %w", err)
	}

	if len(result.Data) == 0 {
		return nil, fmt.Errorf("user not found for id: %s", userId)
	}

	return &result.Data[0], nil
}

// CheckStreamStatus checks if a Twitch user is currently live and returns the stream title.
func (s *twitchService) CheckStreamStatus(username string) (bool, string, error) {
	body, err := s.doHelixRequest("/streams?user_login=" + url.QueryEscape(username))
	if err != nil {
		return false, "", fmt.Errorf("CheckStreamStatus error: %w", err)
	}

	var result struct {
		Data []model.TwitchStreamerData `json:"data"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return false, "", fmt.Errorf("failed to decode stream status response: %w", err)
	}

	if len(result.Data) == 0 {
		return false, "", nil
	}

	stream := result.Data[0]
	return stream.Type == "live", stream.Title, nil
}

func (s *twitchService) CheckStreamStatusByUserId(userId string) (bool, string, error) {
	body, err := s.doHelixRequest("/streams?user_id=" + url.QueryEscape(userId))
	if err != nil {
		return false, "", fmt.Errorf("CheckStreamStatusByUserId error: %w", err)
	}

	var result struct {
		Data []model.TwitchStreamerData `json:"data"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return false, "", fmt.Errorf("failed to decode stream status response: %w", err)
	}

	if len(result.Data) == 0 {
		return false, "", nil
	}

	stream := result.Data[0]
	return stream.Type == "live", stream.Title, nil
}

// CheckMultipleStreamers checks the live status of multiple streamers by their user IDs.
func (s *twitchService) CheckMultipleStreamers(userIds []string) ([]model.TwitchStreamerData, error) {
	if len(userIds) == 0 {
		return nil, nil
	}

	// Twitch API allows up to 100 user_ids per request
	var allStreams []model.TwitchStreamerData

	for i := 0; i < len(userIds); i += 100 {
		end := i + 100
		if end > len(userIds) {
			end = len(userIds)
		}
		chunk := userIds[i:end]

		params := make([]string, len(chunk))
		for j, id := range chunk {
			params[j] = "user_id=" + url.QueryEscape(id)
		}
		endpoint := "/streams?" + strings.Join(params, "&")

		body, err := s.doHelixRequest(endpoint)
		if err != nil {
			return nil, fmt.Errorf("CheckMultipleStreamers error: %w", err)
		}

		var result struct {
			Data []model.TwitchStreamerData `json:"data"`
		}
		if err := json.Unmarshal(body, &result); err != nil {
			return nil, fmt.Errorf("failed to decode streams response: %w", err)
		}

		allStreams = append(allStreams, result.Data...)
	}

	return allStreams, nil
}

// GiveShoutout sends a shoutout for the given streamer. If a custom message format is provided,
// it formats and returns the message. Otherwise, it returns a default shoutout message.
func (s *twitchService) GiveShoutout(username, fromBroadcasterId, messageFormat string) (*string, error) {
	// First, get user info to ensure the streamer exists and to get their display name and other details for the shoutout message.
	userInfo, err := s.GetUserInfoByLoginName(username)
	if err != nil {
		return nil, fmt.Errorf("GiveShoutout: failed to get user info: %w", err)
	}

	// check also if the user is the same as the broadcaster (self-shoutout)
	if userInfo.ID == fromBroadcasterId {
		msg := "You cannot give a shoutout to yourself!"
		return &msg, nil
	}

	// check the broadcaster is live before giving shoutout
	if isLive, _, err := s.CheckStreamStatusByUserId(fromBroadcasterId); err != nil {
		log.Printf("GiveShoutout: failed to check broadcaster stream status: %v", err)
	} else if !isLive {
		msg := "You cannot give shoutouts while you are offline! Go live to start giving shoutouts!"
		return &msg, nil
	}

	// check if the user is live before giving shoutout
	isLive, _, err := s.CheckStreamStatus(username)
	if err != nil {
		return nil, fmt.Errorf("GiveShoutout: failed to check stream status: %w", err)
	}
	if !isLive {
		msg := fmt.Sprintf("%s is currently offline. Shoutouts are only for live streamers!", userInfo.DisplayName)
		return &msg, nil
	}

	// use twitch shoutout endpoint to give the shoutout in chat (this will also trigger Twitch's built-in shoutout message in chat, so the custom message is optional and can be used to provide additional info or a different format).
	req, err := http.NewRequest("POST", s.helixBaseURL+"/chat/shoutouts", nil)
	if err != nil {
		return nil, fmt.Errorf("GiveShoutout: failed to create shoutout request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.accessToken)
	req.Header.Set("Client-Id", s.clientID)
	q := req.URL.Query()
	q.Add("broadcaster_id", fromBroadcasterId)
	q.Add("moderator_id", fromBroadcasterId) // assuming the broadcaster is also the moderator for simplicity
	q.Add("receiver_id", userInfo.ID)
	req.URL.RawQuery = q.Encode()

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GiveShoutout: shoutout request failed: %w", err)
	}
	defer resp.Body.Close()

	// handle 429 Too Many Requests if the broadcaster is trying to give shoutouts too frequently
	if resp.StatusCode == http.StatusTooManyRequests {
		msg := "You are giving shoutouts too frequently! Please wait a moment before giving another shoutout."
		return &msg, nil
	}
	if resp.StatusCode != http.StatusNoContent {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("shoutout request returned status %d: %s", resp.StatusCode, string(body))
	}

	// If the channel has a custom message format for shoutouts, use it. Otherwise, use a default message.

	twitchURL := "https://www.twitch.tv/" + userInfo.Login

	var msg string
	if messageFormat != "" {
		msg = strings.ReplaceAll(messageFormat, "{username}", userInfo.DisplayName)
		msg = strings.ReplaceAll(msg, "{url}", twitchURL)
		msg = strings.ReplaceAll(msg, "{game}", userInfo.Description)
	} else {
		msg = fmt.Sprintf("Check out %s at %s!", userInfo.DisplayName, twitchURL)
	}

	return &msg, nil
}
