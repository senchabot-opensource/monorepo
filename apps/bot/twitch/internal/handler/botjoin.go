package handler

import "github.com/gempir/go-twitch-irc/v3"

func BotJoin(client *twitch.Client) {
	channels := []string{"corefunctionsinitiated"}
	if len(channels) > 0 {
		for i := 0; i < len(channels); i++ {
			client.Join(channels[i])
		}
	}
}
