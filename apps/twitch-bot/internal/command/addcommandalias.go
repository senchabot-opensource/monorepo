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

const ADD_COMMAND_ALIAS_INFO = "For example: !acmda [command_name] [command_alias(es) separated by space]"

func (c *commands) AddCommandAliasCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	command, aliasCommands, check := gosenchabot.GetAliasCommandCreateParams(params)
	if !check {
		cmdResp.Message = ADD_COMMAND_ALIAS_INFO
		return &cmdResp, nil
	}
	twitchChannelId := message.RoomID

	if infoText, check := gosenchabot.ValidateAliasCommandsLength(aliasCommands); !check {
		cmdResp.Message = message.User.DisplayName + ", " + infoText
		return &cmdResp, nil
	}

	for _, k := range aliasCommands {
		if c.IsSystemCommand(k) {
			cmdResp.Message = fmt.Sprintf("%v, the command \"%v\" is used as system command", message.User.DisplayName, k)
			return &cmdResp, nil
		}
	}

	infoText, err := c.service.CreateCommandAliases(context, command, aliasCommands, twitchChannelId, message.User.DisplayName)
	if err != nil {
		return nil, errors.New("AddCommandAlias Error: " + err.Error())
	}
	if infoText != nil {
		cmdResp.Message = message.User.DisplayName + ", " + *infoText
		return &cmdResp, nil
	}

	commandAliasesList := strings.Join(aliasCommands, ", ")
	fmt.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", command)

	cmdResp.Message = "New Command Aliases Added: " + commandAliasesList
	return &cmdResp, nil
}
