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

const ADD_TIMER_COMMAND_INFO = "!timer [command_name] [interval (integer)]"

func (c *commands) AddTimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse
	channelId := message.RoomID

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], channelId) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	channelName := message.Channel

	if len(params) < 2 {
		cmdResp.Message = ADD_TIMER_COMMAND_INFO
		return &cmdResp, nil
	}

	command := params[0]
	intervalStr := params[1]

	commandData, err := c.service.GetUserBotCommand(context, command, channelId)
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

	if interval <= 0 {
		cmdResp.Message = "Timer interval can not be less than 25"
		return &cmdResp, nil
	}

	c.service.SetTimer(c.client, channelName, commandData, interval*60000)
	ok, err := c.service.CreateCommandTimer(context, channelId, commandData.CommandName, interval)
	if err != nil {
		log.Println(err.Error())
		if ok {
			cmdResp.Message = err.Error()
			return &cmdResp, nil
		}
		cmdResp.Message = fmt.Sprintf("Command Timer Enabled: %v. There was an error in db. This timer is not saved to the db.", commandData.CommandName)
		return &cmdResp, nil
	}

	if !ok {
		cmdResp.Message = "there was an error "
		return &cmdResp, nil
	}

	cmdResp.Message = fmt.Sprintf("Command Timer Enabled: %v.", commandData.CommandName)
	return &cmdResp, nil
}
