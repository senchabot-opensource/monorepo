package client

import (
	"github.com/gempir/go-twitch-irc/v3"
)

type Clients struct {
	Twitch *twitch.Client
}

func NewClients(twitchClient *twitch.Client) *Clients {
	return &Clients{
		Twitch: twitchClient,
	}
}
