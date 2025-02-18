package twitchapi

import (
	"context"
	"fmt"
	"net/http"

	"github.com/senchabot-opensource/monorepo/model"
	"golang.org/x/oauth2/clientcredentials"
	"golang.org/x/oauth2/twitch"
)

type TwitchService interface {
	GetUserInfoByLoginName(loginName string) (*model.TwitchUserInfo, error)
	GetUserInfoById(userId string) (*model.TwitchUserInfo, error)
	GiveShoutout(streamerUsername string, broadcasterId string, messageFormat string) (*string, error)
	CheckStreamStatusByUsername(username string) (bool, string, error)
	CheckStreamStatusById(streamerId string) (bool, string, error)
	CheckMultipleStreamers(usernames []string) ([]model.TwitchStreamerData, error)
	StartRaid(streamerUserId string, broadcasterId string) (*string, error)
	CancelRaid(broadcasterId string) (*string, error)
}

type service struct {
	clientID    string
	accessToken string
	httpClient  *http.Client
	baseURL     string
	botUserID   string
}

func NewTwitchService(clientID, clientSecret, botUserID string) (TwitchService, error) {
	oauth2Config := &clientcredentials.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		TokenURL:     twitch.Endpoint.TokenURL,
	}

	token, err := oauth2Config.Token(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to get twitch token: %w", err)
	}

	return &service{
		clientID:    clientID,
		accessToken: token.AccessToken,
		httpClient:  &http.Client{},
		baseURL:     "https://api.twitch.tv/helix",
		botUserID:   botUserID,
	}, nil
}
