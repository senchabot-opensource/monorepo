package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

const DELETE_COMMAND_ALIAS_INFO = "For example: !dcmda [command_alias]"

func (c *commands) DeleteCommandAliasCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return
	}
	if check := helpers.IsCommandParamsLengthEqualToOne(params); !check {
		c.client.Twitch.Say(message.Channel, DELETE_COMMAND_ALIAS_INFO)
		return
	}
	var command_alias = strings.ToLower(params[0])

	command_alias = gosenchabot.TrimExclamationPrefix(command_alias)

	infoText, err := c.service.DeleteCommandAlias(context, command_alias, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		c.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_ALIAS_DELETE: command_alias:", command_alias)

	c.client.Twitch.Say(message.Channel, "Command Alias Deleted: "+command_alias)
}
