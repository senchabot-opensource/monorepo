package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) CmdsCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	msgData := &models.MessageData{
		PlatformEntityID: message.RoomID,
		UserName:         message.User.DisplayName,
	}
	return command.CmdsCommand(context, c.service.GetCommandList, c.IsSystemCommand, *msgData, commandName, params)
}
