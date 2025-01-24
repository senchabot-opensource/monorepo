package command

import (
	"context"
	"fmt"
	"log"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

type createCommandServiceType func(ctx context.Context, commandName string, commandContent string, platformEntityId string, createdBy string) (*string, error)

func AcmdCommand(context context.Context, service createCommandServiceType, getcvcservice getCustomVariableContentServiceType, isSystemCommand IsSystemCommandType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	command_name, command_content, check := helper.GetCommandCreateUpdateParams(params)
	if !check {
		// "Birleşmiş Milletler 21 Mayıs'ı Uluslararası Çay Günü olarak belirlemiştir." (Bu yorum satırı Twitch chatinde Harami tarafından redeem yoluyla yazdırılmıştır. Arz ederim.)
		cmdResp.Message = config.AddCommandInfo
		return &cmdResp, nil
	}

	if isSystemCommand(command_name) {
		cmdResp.Message = fmt.Sprintf("%v, the command \"%v\" is used as system command", message.UserName, command_name)
		return &cmdResp, nil
	}

	// Check command name and content length
	if infoText, check := helper.ValidateCommandCreateParams(command_name, command_content); !check {
		cmdResp.Message = message.UserName + ", " + infoText
		return &cmdResp, nil
	}

	if !checkCommandContentLengthWithCustomVariable(command_content, context, message, getcvcservice) {
		cmdResp.Message = config.CommandContentLimit
		return &cmdResp, nil
	}

	infoText, err := service(context, command_name, command_content, message.PlatformEntityID, message.UserName)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.UserName + ", " + *infoText
		return &cmdResp, nil
	}

	log.Println("COMMAND_ADD: command_name:", command_name, ", command_content:", command_content)
	cmdResp.Message = "New Command Added: " + command_name
	return &cmdResp, nil
}
