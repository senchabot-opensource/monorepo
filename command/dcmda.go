package command

import (
	"context"
	"log"
	"strings"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type dcmdaCommandCommandType func(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)

func DcmdaCommand(context context.Context, deleteCommandAlias dcmdaCommandCommandType, isSystemCommand IsSystemCommandType, message models.MessageData, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if check := gosenchabot.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = config.DeleteCommandAliasInfo
		return &cmdResp, nil
	}
	var command_alias = strings.ToLower(params[0])

	command_alias = gosenchabot.TrimExclamationPrefix(command_alias)

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
