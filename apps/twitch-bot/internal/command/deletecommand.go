package command

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

const DELETE_COMMAND_INFO = "For example: !dcmd [command_name]"

func (c *commands) DeleteCommandCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	if check := helpers.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = DELETE_COMMAND_INFO
		return &cmdResp, nil
	}
	var command_name = strings.ToLower(params[0])

	command_name = gosenchabot.TrimExclamationPrefix(command_name)

	deletedCommandName, infoText, err := c.service.DeleteBotCommand(context, command_name, message.RoomID)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.User.DisplayName + ", " + *infoText
		return &cmdResp, nil
	}

	fmt.Println("COMMAND_DELETE: command_name:", *deletedCommandName)

	cmdResp.Message = "Command Deleted: " + *deletedCommandName
	return &cmdResp, nil
}
