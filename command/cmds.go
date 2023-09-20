package command

import (
	"context"
	"strings"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type getCommandListServiceType func(ctx context.Context, platformEntityId string) ([]*models.BotCommand, error)

func CmdsCommand(context context.Context, service getCommandListServiceType, isSystemCommand IsSystemCommandType, message models.MessageData, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse
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
