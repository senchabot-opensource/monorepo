package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) CmdsCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	msgData := &model.MessageData{
		PlatformEntityID: message.RoomID,
		UserName:         message.User.DisplayName,
	}
	return command.CmdsCommand(context, c.service.GetCommandList, c.IsSystemCommand, *msgData, commandName, params)
}
