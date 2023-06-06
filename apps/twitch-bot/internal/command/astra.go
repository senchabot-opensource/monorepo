package command

import "github.com/gempir/go-twitch-irc/v3"

func (s *commands) AstraCommand(message twitch.PrivateMessage, commandName string, params []string) {
	s.client.Twitch.Say(message.Channel, "[We did it!] Astra UI Kit: https://docs.astraui.com")
}
