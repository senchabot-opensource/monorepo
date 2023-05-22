package command

import (
	"context"
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

const UPDATE_COMMAND_INFO = "For example: !ucmd [command_name] [new_command_content]"

func UpdateCommandCommand(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), server, message) {
		return
	}
	command_name, newCommandContent, check := helpers.GetCommandCreateUpdateParams(params)
	if !check {
		client.Twitch.Say(message.Channel, UPDATE_COMMAND_INFO)
		return
	}
	// Check command content length
	if infoText, check := helpers.ValidateCommandContentLength(newCommandContent); !check {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", "+infoText)
		return
	}

	updatedCommandName, infoText, err := server.UpdateBotCommand(context.Background(), command_name, newCommandContent, message.RoomID, message.User.DisplayName)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_UPDATE: command_name:", updatedCommandName, "new_command_content:", newCommandContent)

	client.Twitch.Say(message.Channel, "Command Updated: "+*updatedCommandName)
}
