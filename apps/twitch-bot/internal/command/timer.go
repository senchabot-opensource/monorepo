package command

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strconv"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

const TIMER_COMMAND_INFO = "!timer [command_name] [interval (integer)]"

func (c *commands) TimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	channelName := message.Channel

	if len(params) < 2 {
		cmdResp.Message = TIMER_COMMAND_INFO
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

	interval, err := strconv.Atoi(intervalStr)
	if err != nil {
		cmdResp.Message = message.User.DisplayName + ", the interval value must be integer"
		fmt.Println("strconv.Atoi err", err)
		return &cmdResp, nil
	}
	fmt.Println("interval", interval)

	//	isTimerEnabled := c.service.GetTimerStatus(commandData.ID)
	//	fmt.Println("isTimerEnabled", isTimerEnabled)
	// !isTimerEnabled &&

	if interval < 2 {
		switch interval {
		case 0:
			c.service.SetTimerDisabled(commandData.ID)
			cmdResp.Message = "Timer Disabled"
		case 1:
			c.service.SetTimerEnabled(c.client, commandData.ID)
			cmdResp.Message = "Timer Enabled"
		}
		return &cmdResp, nil
	}

	// should be >= 25
	if interval > 2 {
		c.service.SetTimer(c.client, channelName, commandData, interval*60000)
		ok, err := c.service.CreateCommandTimer(context, message.RoomID, commandData.CommandName, interval)

		if err != nil {
			log.Println(err.Error())
			if ok {
				cmdResp.Message = err.Error()
				return &cmdResp, nil
			}
			cmdResp.Message = fmt.Sprintf("Command Timer Enabled: %v. There was an error in db. This timer is not saved to the db.", commandData.CommandName)
			return &cmdResp, nil
		}
		cmdResp.Message = fmt.Sprintf("Command Timer Enabled: %v.", commandData.CommandName)
		return &cmdResp, nil
	}

	return &cmdResp, nil
}
