package command

import (
	"context"
	"errors"
	"log"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) TimersCommand(context context.Context, message twitch.PrivateMessage, _ string, _ []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse
	channelId := message.RoomID

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], channelId) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	cmdTimers, err := c.service.GetCommandTimers(context, channelId)
	if err != nil {
		log.Println("There was an error while getting command timers. Error: " + err.Error())
		cmdResp.Message = config.ErrorMessage + "CT4"
		return &cmdResp, nil
	}

	var cmdTimerArr []string
	var cmdTimerString string

	for _, v := range cmdTimers {
		cmdTimerArr = append(cmdTimerArr, v.CommandName)
	}

	cmdTimerString = strings.Join(cmdTimerArr, ", ")

	cmdResp.Message = "Command Timers: " + cmdTimerString
	return &cmdResp, nil
}
