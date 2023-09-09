package command

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

const UPDATE_TIMER_COMMAND_INFO = "!utimer [command_name] [interval (integer)]"

func (c *commands) UpdateTimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse
	channelId := message.RoomID
	channelName := message.Channel

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], channelId) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	if len(params) < 2 {
		cmdResp.Message = UPDATE_TIMER_COMMAND_INFO
		return &cmdResp, nil
	}

	command := params[0]
	intervalStr := params[1]

	commandData, err := c.service.GetUserBotCommand(context, command, message.RoomID)
	if err != nil {
		cmdResp.Message = message.User.DisplayName + ", the command \"" + command + "\" not found"
		fmt.Println("> (TimerCommand) " + err.Error())
		return &cmdResp, nil
	}

	interval, err := gosenchabot.StrToInt(intervalStr)
	if err != nil {
		cmdResp.Message = message.User.DisplayName + ", " + err.Error()
		return &cmdResp, nil
	}

	err = c.service.UpdateCommandTimer(context, channelId, command, interval, 1)
	c.service.SetTimer(c.client, channelName, commandData, interval*60000)
	if err != nil {
		log.Println(err.Error())
		cmdResp.Message = fmt.Sprintf("Command Timer Updated: %v. There was an error in db. The changes is not saved to the db.", command)
		return &cmdResp, nil
	}

	cmdResp.Message = fmt.Sprintf("Command Timer Updated: %v.", command)
	return &cmdResp, nil
}
