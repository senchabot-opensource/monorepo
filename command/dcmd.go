package command

import (
	"context"
	"log"
	"strings"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type deleteCommandServiceType func(ctx context.Context, commandName string, platformEntityId string) (*string, *string, error)

func DcmdCommand(context context.Context, service deleteCommandServiceType, isSystemCommand IsSystemCommandType, message models.MessageData, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if check := gosenchabot.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = config.DeleteCommandInfo
		return &cmdResp, nil
	}
	var command_name = strings.ToLower(params[0])

	command_name = gosenchabot.TrimExclamationPrefix(command_name)

	deletedCommandName, infoText, err := service(context, command_name, message.PlatformEntityID)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.UserName + ", " + *infoText
		return &cmdResp, nil
	}

	log.Println("COMMAND_DELETE: command_name:", *deletedCommandName)

	cmdResp.Message = "Command Deleted: " + *deletedCommandName
	return &cmdResp, nil
}
