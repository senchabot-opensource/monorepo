package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

const DELETE_COMMAND_INFO = "For example: !dcmd [command_name]"

func DeleteCommandCommand(client *client.Clients, service service.Services, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), service, message) {
		return
	}
	if check := helpers.ValidateCommandDeleteParamsLength(params); !check {
		client.Twitch.Say(message.Channel, DELETE_COMMAND_INFO)
		return
	}
	var command_name = strings.ToLower(params[0])
	deletedCommandName, infoText, err := service.DB.DeleteBotCommand(context.Background(), command_name, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_DELETE: command_name:", *deletedCommandName)

	client.Twitch.Say(message.Channel, "Command Deleted: "+*deletedCommandName)
}
