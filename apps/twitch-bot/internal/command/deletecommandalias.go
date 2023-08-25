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

const DELETE_COMMAND_ALIAS_INFO = "For example: !dcmda [command_alias]"

func (c *commands) DeleteCommandAliasCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	if check := helpers.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = DELETE_COMMAND_ALIAS_INFO
		return &cmdResp, nil
	}
	var command_alias = strings.ToLower(params[0])

	command_alias = gosenchabot.TrimExclamationPrefix(command_alias)

	infoText, err := c.service.DeleteCommandAlias(context, command_alias, message.RoomID)
	if err != nil {
		return nil, err
	}

	if infoText != nil {
		cmdResp.Message = message.User.DisplayName + ", " + *infoText
		return &cmdResp, nil
	}

	fmt.Println("COMMAND_ALIAS_DELETE: command_alias:", command_alias)

	cmdResp.Message = "Command Alias Deleted: " + command_alias
	return &cmdResp, nil
}
