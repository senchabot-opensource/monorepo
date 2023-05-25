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

const DELETE_COMMAND_ALIAS_INFO = "For example: !dcmda [command_alias]"

func DeleteCommandAliasCommand(client *client.Clients, service service.Services, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), service, message) {
		return
	}
	if check := helpers.ValidateCommandDeleteParamsLength(params); !check {
		client.Twitch.Say(message.Channel, DELETE_COMMAND_ALIAS_INFO)
		return
	}
	var command_alias = strings.ToLower(params[0])
	infoText, err := service.DB.DeleteCommandAlias(context.Background(), command_alias, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_ALIAS_DELETE: command_alias:", command_alias)

	client.Twitch.Say(message.Channel, "Command Alias Deleted: "+command_alias)
}
