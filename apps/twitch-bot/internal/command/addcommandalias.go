package command

import (
	"context"
	"errors"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) AddCommandAliasCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	msgData := &models.MessageData{
		PlatformEntityID: message.RoomID,
		UserName:         message.User.DisplayName,
	}

	return command.AcmdaCommand(context, c.service.CheckCommandExists, c.service.CreateCommandAlias, c.IsSystemCommand, *msgData, commandName, params)
}
