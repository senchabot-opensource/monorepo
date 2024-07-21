package command

import (
	"context"
	"strings"

	"github.com/senchabot-opensource/monorepo/model"
)

type getCommandListServiceType func(ctx context.Context, platformEntityId string) ([]*model.BotCommand, error)

func CmdsCommand(context context.Context, service getCommandListServiceType, isSystemCommand IsSystemCommandType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse
	var commandListArr []string
	var commandListString string

	commandList, err := service(context, message.PlatformEntityID)
	if err != nil {
		return nil, err
	}

	for _, v := range commandList {
		commandListArr = append(commandListArr, v.CommandName)
	}

	commandListString = strings.Join(commandListArr, ", ")

	if len(commandListString) > 300 {
		second := commandListString[:300] + "... I cannot show all the commands to avoid the message character limit. We will do something to show all your other commands."
		cmdResp.Message = second
		return &cmdResp, nil
	}

	cmdResp.Message = "Commands: " + commandListString
	return &cmdResp, nil
}
