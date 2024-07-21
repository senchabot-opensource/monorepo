package command

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

type checkCommandExistCommandType func(ctx context.Context, commandName string, platformEntityId string) (*string, error)
type acmdaCommandCommandType func(ctx context.Context, commandName string, aliases []string, platformEntityId string, createdBy string) (*string, error)

func AcmdaCommand(context context.Context, checkCommandExists checkCommandExistCommandType, createCommandAlias acmdaCommandCommandType, isSystemCommand IsSystemCommandType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	command, aliasCommands, check := helper.GetAliasCommandCreateParams(params)
	if !check {
		cmdResp.Message = config.AddCommandAliasInfo
		return &cmdResp, nil
	}

	platformEntityId := message.PlatformEntityID

	if infoText, check := helper.ValidateAliasCommandsLength(aliasCommands); !check {
		cmdResp.Message = message.UserName + ", " + infoText
		return &cmdResp, nil
	}

	// Check command exists
	infoTextResp, _ := checkCommandExists(context, command, platformEntityId)
	if infoTextResp == nil && !isSystemCommand(command) {
		cmdResp.Message = "the command \"" + command + "\" does not exist"
		return &cmdResp, nil
	}

	for _, k := range aliasCommands {
		if isSystemCommand(k) {
			cmdResp.Message = fmt.Sprintf("%v, the command \"%v\" is used as system command", message.UserName, k)
			return &cmdResp, nil
		}
	}

	infoText, err := createCommandAlias(context, command, aliasCommands, platformEntityId, message.UserName)
	if err != nil {
		return nil, errors.New("AddCommandAlias Error: " + err.Error())
	}
	if infoText != nil {
		cmdResp.Message = message.UserName + ", " + *infoText
		return &cmdResp, nil
	}

	commandAliasesList := strings.Join(aliasCommands, ", ")
	log.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", command)

	cmdResp.Message = "New Command Aliases Added: " + commandAliasesList
	return &cmdResp, nil
}
