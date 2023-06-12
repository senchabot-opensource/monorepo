package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
)

const ADD_COMMAND_ALIAS_INFO = "For example: !acmda [command_name] [command_alias(es) separated by space]"

func (c *commands) AddCommandAliasCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context, c.service, message) {
		return
	}
	command, aliasCommands, check := helpers.GetAliasCommandCreateParams(params)
	if !check {
		c.client.Twitch.Say(message.Channel, ADD_COMMAND_ALIAS_INFO)
		return
	}
	twitchChannelId := message.RoomID

	if infoText, check := helpers.ValidateAliasCommandsLength(aliasCommands); !check {
		c.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+infoText)
		return
	}

	command = helpers.TrimExclamationPrefix(command)

	infoText, err := c.service.CreateCommandAliases(context, command, aliasCommands, twitchChannelId, message.User.DisplayName)
	if err != nil {
		fmt.Println("AddCommandAlias Error: " + err.Error())
		return
	}
	if infoText != nil {
		c.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	commandAliasesList := strings.Join(aliasCommands, ", ")
	fmt.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", command)

	c.client.Twitch.Say(message.Channel, "New Command Aliases Added: "+commandAliasesList)
}
