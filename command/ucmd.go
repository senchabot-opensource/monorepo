package command

import (
	"context"
	"log"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

type updateCommandServiceType func(ctx context.Context, commandName string, commandContent string, platformEntityId string, updatedBy string) (*string, *string, error)

func UcmdCommand(context context.Context, service updateCommandServiceType, isSystemCommand IsSystemCommandType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	command_name, newCommandContent, check := helper.GetCommandCreateUpdateParams(params)
	if !check {
		cmdResp.Message = config.UpdateCommandInfo
		return &cmdResp, nil
	}
	// Check command content length
	if infoText, check := helper.ValidateCommandContentLength(newCommandContent); !check {
		cmdResp.Message = message.UserName + ", " + infoText
		return &cmdResp, nil
	}

	updatedCommandName, infoText, err := service(context, command_name, newCommandContent, message.PlatformEntityID, message.UserName)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.UserName + ", " + *infoText
		return &cmdResp, nil
	}

	log.Println("COMMAND_UPDATE: command_name:", *updatedCommandName, "new_command_content:", newCommandContent)

	cmdResp.Message = "Command Updated: " + *updatedCommandName
	return &cmdResp, nil
}
