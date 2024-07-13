package command

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/model"
)

const DELETE_TIMER_COMMAND_INFO = "!dtimer [command_name]"

func (c *commands) DeleteTimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse
	channelId := message.RoomID

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], channelId) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	if len(params) < 1 {
		cmdResp.Message = DELETE_TIMER_COMMAND_INFO
		return &cmdResp, nil
	}

	command := params[0]

	commandData, err := c.service.GetUserBotCommand(context, command, message.RoomID)
	if err != nil {
		cmdResp.Message = message.User.DisplayName + ", the command \"" + command + "\" not found"
		log.Println("[command.DeleteTimerCommand] GetUserBotCommand error:" + err.Error())
		return &cmdResp, nil
	}

	err = c.service.DeleteCommandTimer(context, channelId, command)

	if err != nil {
		log.Println(err.Error())
		cmdResp.Message = fmt.Sprintf("Command Timer Disabled: %v. There was an error in db. This timer is not deleted from the db.", command)
		return &cmdResp, nil
	}
	c.service.SetTimerDisabled(commandData.ID)
	c.service.DeleteTimer(commandData.ID)

	cmdResp.Message = fmt.Sprintf("Command Timer Deleted: %v.", command)
	return &cmdResp, nil
}
