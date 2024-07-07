package command

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

const ADD_TIMER_COMMAND_INFO = "!atimer [command_name] [interval (integer, minute)]"

func (c *commands) AddTimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse
	channelId := message.RoomID

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], channelId) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
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
		log.Println("[command.AddTimerCommand] GetUserBotCommand error:" + err.Error())
		return &cmdResp, nil
	}

	interval, err := helper.StrToInt(intervalStr)
	if err != nil {
		cmdResp.Message = message.User.DisplayName + ", " + err.Error()
		return &cmdResp, nil
	}

	if interval < config.MIN_CMD_TIMER_INTERVAL {
		cmdResp.Message = fmt.Sprintf("Timer interval can not be less than %v", config.MIN_CMD_TIMER_INTERVAL)
		return &cmdResp, nil
	}

	cmdTimers, err := c.service.GetCommandTimers(context, channelId)
	if err != nil {
		log.Println("There was an error while getting command timers errors: " + err.Error())
		cmdResp.Message = config.ErrorMessage + "CT2"
		return &cmdResp, nil
	}

	if len(cmdTimers) == 3 {
		cmdResp.Message = "You have created 3 command timers. You can list the command timers you added with the !timers command. You can create up to 3 command timers."
		return &cmdResp, nil
	}

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
	c.service.SetTimer(c.client, channelName, commandData, interval*60000)

	if !ok {
		cmdResp.Message = config.ErrorMessage + "CT1"
		return &cmdResp, nil
	}

	cmdResp.Message = fmt.Sprintf("Command Timer Enabled: %v.", commandData.CommandName)
	return &cmdResp, nil
}
