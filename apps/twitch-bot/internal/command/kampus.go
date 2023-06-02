package command

import (
	"github.com/gempir/go-twitch-irc/v3"
)

func (s *commands) KampusCommand(message twitch.PrivateMessage, commandName string, params []string) {
	s.client.Twitch.Say(message.Channel, "https://discord.kamp.us")
}
