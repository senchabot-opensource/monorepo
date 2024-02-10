package command

import (
	"context"
	"errors"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) DeleteCommandAliasCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	msgData := &models.MessageData{
		PlatformEntityID: message.RoomID,
		UserName:         message.User.DisplayName,
	}

	return command.DcmdaCommand(context, c.service.DeleteCommandAlias, c.IsSystemCommand, *msgData, commandName, params)
}
