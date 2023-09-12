package command

import (
	"context"
	"errors"
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) AddCommandCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	command_name, command_content, check := helpers.GetCommandCreateUpdateParams(params)
	if !check {
		// "Birleşmiş Milletler 21 Mayıs'ı Uluslararası Çay Günü olarak belirlemiştir." (Bu yorum satırı Twitch chatinde Harami tarafından redeem yoluyla yazdırılmıştır. Arz ederim.)
		cmdResp.Message = config.AddCommandInfo
		return &cmdResp, nil
	}
	// Check command name and content length
	if infoText, check := helpers.ValidateCommandCreateParams(command_name, command_content); !check {
		cmdResp.Message = message.User.DisplayName + ", " + infoText
		return &cmdResp, nil
	}

	if c.IsSystemCommand(command_name) {
		cmdResp.Message = fmt.Sprintf("%v, the command \"%v\" is used as system command", message.User.DisplayName, command_name)
		return &cmdResp, nil
	}

	infoText, err := c.service.CreateCommand(context, command_name, command_content, message.RoomID, message.User.DisplayName)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.User.DisplayName + ", " + *infoText
		return &cmdResp, nil
	}

	fmt.Println("COMMAND_ADD: command_name:", command_name, ", command_content:", command_content)
	cmdResp.Message = "New Command Added: " + command_name
	return &cmdResp, nil
}
