package command

import (
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
)

func (s *commands) HelpCommand(message twitch.PrivateMessage, commandName string, params []string) {
	commandListMap := s.GetCommands()
	var commmandList []string

	for k := range commandListMap {
		commmandList = append(commmandList, k)
	}

	commandListString := strings.Join(commmandList, ", ")

	s.client.Twitch.Say(message.Channel, "Senchabot's Commands: "+commandListString)
}
