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

func (c *commands) UpdateCommandCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	command_name, newCommandContent, check := helpers.GetCommandCreateUpdateParams(params)
	if !check {
		cmdResp.Message = config.UpdateCommandInfo
		return &cmdResp, nil
	}
	// Check command content length
	if infoText, check := helpers.ValidateCommandContentLength(newCommandContent); !check {
		cmdResp.Message = message.User.DisplayName + ", " + infoText
		return &cmdResp, nil
	}

	updatedCommandName, infoText, err := c.service.UpdateCommand(context, command_name, newCommandContent, message.RoomID, message.User.DisplayName)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.User.DisplayName + ", " + *infoText
		return &cmdResp, nil
	}

	fmt.Println("COMMAND_UPDATE: command_name:", updatedCommandName, "new_command_content:", newCommandContent)

	cmdResp.Message = "Command Updated: " + *updatedCommandName
	return &cmdResp, nil
}
