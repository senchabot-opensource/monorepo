package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
)

func (s *commands) CmdsCommand(message twitch.PrivateMessage, commandName string, params []string) {
	var commandListArr []string
	var commandListString string

	commandList, err := s.service.DB.GetCommandList(context.Background(), message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	for _, v := range commandList {
		commandListArr = append(commandListArr, v.CommandName)
	}

	commandListString = strings.Join(commandListArr, ", ")

	s.client.Twitch.Say(message.Channel, "Commands List: "+commandListString)
}
