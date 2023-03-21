package internal

import "github.com/gempir/go-twitch-irc/v3"

type client struct {
	Twitch *twitch.Client
}

func NewClient(twitchClient *twitch.Client) *client {
	return &client{
		Twitch: twitchClient,
	}
}
