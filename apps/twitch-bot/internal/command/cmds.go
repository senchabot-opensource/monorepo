package command

import (
	"context"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) CmdsCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse
	var commandListArr []string
	var commandListString string

	commandList, err := c.service.GetCommandList(context, message.RoomID)
	if err != nil {
		return nil, err
	}

	for _, v := range commandList {
		commandListArr = append(commandListArr, v.CommandName)
	}

	commandListString = strings.Join(commandListArr, ", ")

	if len(commandListString) > 300 {
		first := commandListString[:300]
		c.client.Twitch.Say(message.Channel, message.Channel+"'s Channel Commands: "+first)

		second := commandListString[300:]
		cmdResp.Message = second
		return &cmdResp, nil
	}

	cmdResp.Message = message.Channel + "'s Channel Commands: " + commandListString
	return &cmdResp, nil
}
