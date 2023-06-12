package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
)

func (c *commands) CmdsCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	var commandListArr []string
	var commandListString string

	commandList, err := c.service.GetCommandList(context, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	for _, v := range commandList {
		commandListArr = append(commandListArr, v.CommandName)
	}

	commandListString = strings.Join(commandListArr, ", ")

	c.client.Twitch.Say(message.Channel, message.Channel+"'s Channel Commands: "+commandListString)
}
