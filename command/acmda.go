package command

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type checkCommandExistCommandType func(ctx context.Context, commandName string, platformEntityId string) (*string, error)
type acmdaCommandCommandType func(ctx context.Context, commandName string, aliases []string, platformEntityId string, createdBy string) (*string, error)

func AcmdaCommand(context context.Context, checkCommandExists checkCommandExistCommandType, createCommandAlias acmdaCommandCommandType, isSystemCommand IsSystemCommandType, message models.MessageData, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	command, aliasCommands, check := gosenchabot.GetAliasCommandCreateParams(params)
	if !check {
		cmdResp.Message = config.AddCommandAliasInfo
		return &cmdResp, nil
	}

	platformEntityId := message.PlatformEntityID

	if infoText, check := gosenchabot.ValidateAliasCommandsLength(aliasCommands); !check {
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
	fmt.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", command)

	cmdResp.Message = "New Command Aliases Added: " + commandAliasesList
	return &cmdResp, nil
}
