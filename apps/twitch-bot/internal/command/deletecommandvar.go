package command

import (
	"context"
	"errors"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) DeleteCommandVariableCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	msgData := &model.MessageData{
		PlatformEntityID: message.RoomID,
		UserName:         message.User.DisplayName,
	}

	return command.DeleteCommandVariableCommand(context, c.service.DeleteCommandVariable, c.service.GetCommandVariable, *msgData, commandName, params)
}
