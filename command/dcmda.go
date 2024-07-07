package command

import (
	"context"
	"log"
	"strings"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

type dcmdaCommandCommandType func(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)

func DcmdaCommand(context context.Context, deleteCommandAlias dcmdaCommandCommandType, isSystemCommand IsSystemCommandType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if check := helper.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = config.DeleteCommandAliasInfo
		return &cmdResp, nil
	}
	var command_alias = strings.ToLower(params[0])

	command_alias = helper.TrimExclamationPrefix(command_alias)

	infoText, err := deleteCommandAlias(context, command_alias, message.PlatformEntityID)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.UserName + ", " + *infoText
		return &cmdResp, nil
	}

	log.Println("COMMAND_ALIAS_DELETE: command_alias:", command_alias)

	cmdResp.Message = "Command Alias Deleted: " + command_alias
	return &cmdResp, nil
}
