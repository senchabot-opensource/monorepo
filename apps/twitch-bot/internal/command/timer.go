package command

import (
	"context"
	"errors"
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

const TIMER_COMMAND_INFO = "!timer [command_name] [on/off]"

func (c *commands) CommandTimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse
	channelId := message.RoomID

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], channelId) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	if len(params) < 2 {
		cmdResp.Message = TIMER_COMMAND_INFO
		return &cmdResp, nil
	}

	command := params[0]
	toggle := params[1]

	commandData, err := c.service.GetUserBotCommand(context, command, message.RoomID)
	if err != nil {
		cmdResp.Message = message.User.DisplayName + ", the command \"" + command + "\" not found"
		fmt.Println("> (CommandTimerCommand) " + err.Error())
		return &cmdResp, nil
	}

	if toggle != "on" && toggle != "off" && toggle != "1" && toggle != "0" {
		cmdResp.Message = TIMER_COMMAND_INFO
		return &cmdResp, nil
	}

	timer := c.service.GetCommandTimer(context, message.RoomID, command)

	switch toggle {
	case "off":
	case "0":
		c.service.SetTimerDisabled(commandData.ID)
		c.service.UpdateCommandTimer(context, channelId, commandData.CommandName, 0, 0)
		cmdResp.Message = "Command Timer will be disabled after the next iteration: " + command
	case "on":
	case "1":
		c.service.SetTimer(c.client, message.Channel, commandData, timer.Interval*60000)
		c.service.UpdateCommandTimer(context, channelId, commandData.CommandName, 0, 1)
		cmdResp.Message = "Command Timer Enabled: " + command
	}

	return &cmdResp, nil
}
