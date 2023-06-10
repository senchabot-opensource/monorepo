package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
)

func (s *commands) KampusCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	s.client.Twitch.Say(message.Channel, "https://discord.gg/kampus")
}
