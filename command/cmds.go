package command

import (
	"context"

	"github.com/senchabot-opensource/monorepo/model"
)

type getCommandListServiceType func(ctx context.Context, platformEntityId string) ([]*model.BotCommand, error)

func CmdsCommand(context context.Context, service getCommandListServiceType, isSystemCommand IsSystemCommandType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse
	cmdResp.Message = message.UserName + ", you can see all available commands here: https://senchabot.app/commands/" + message.ChannelName
	return &cmdResp, nil
}
