package command

import (
	"context"
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
)

const UPDATE_COMMAND_INFO = "For example: !ucmd [command_name] [new_command_content]"

func (c *commands) UpdateCommandCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context, c.service, message) {
		return
	}
	command_name, newCommandContent, check := helpers.GetCommandCreateUpdateParams(params)
	if !check {
		c.client.Twitch.Say(message.Channel, UPDATE_COMMAND_INFO)
		return
	}
	// Check command content length
	if infoText, check := helpers.ValidateCommandContentLength(newCommandContent); !check {
		c.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+infoText)
		return
	}

	command_name = helpers.TrimExclamationPrefix(command_name)

	updatedCommandName, infoText, err := c.service.UpdateBotCommand(context, command_name, newCommandContent, message.RoomID, message.User.DisplayName)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		c.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_UPDATE: command_name:", updatedCommandName, "new_command_content:", newCommandContent)

	c.client.Twitch.Say(message.Channel, "Command Updated: "+*updatedCommandName)
}
