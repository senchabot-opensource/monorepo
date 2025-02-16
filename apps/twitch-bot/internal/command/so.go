package command

import (
	"context"
	"errors"
	"log"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) SoCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand + ": SoCommand")
	}

	if check := helper.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = config.SoCommandInfo
		return &cmdResp, nil
	}

	streamerUsername := strings.ToLower(params[0])
	streamerUsername = strings.TrimPrefix(streamerUsername, "@")

	var messageFormat string

	customMessageFormat, err := c.service.GetTwitchBotConfig(context, message.RoomID, "so_command_message_format")
	if err != nil {
		log.Println("[command.SoCommand] c.service.GetTwitchBotConfig error:", err.Error())
		messageFormat = ""
	}

	if customMessageFormat != nil {
		messageFormat = customMessageFormat.Value
	}

	respMsg, err := c.twitchService.GiveShoutout(streamerUsername, message.RoomID, messageFormat)
	if err != nil {
		log.Println("[command.SoCommand] GiveShoutout error:", err.Error())
		return nil, err
	}

	cmdResp.Message = *respMsg
	return &cmdResp, nil
}
