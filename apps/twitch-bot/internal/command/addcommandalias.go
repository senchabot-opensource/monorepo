package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

const ADD_COMMAND_ALIAS_INFO = "For example: !acmda [command_name] [command_alias(es) separated by space]"

func AddCommandAliasCommand(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), server, message) {
		return
	}
	command, aliasCommands, check := helpers.GetAliasCommandCreateParams(params)
	if !check {
		client.Twitch.Say(message.Channel, ADD_COMMAND_ALIAS_INFO)
		return
	}
	twitchChannelId := message.RoomID

	if infoText, check := helpers.ValidateAliasCommandsLength(aliasCommands); !check {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", "+infoText)
		return
	}

	infoText, err := server.CreateCommandAliases(context.Background(), command, aliasCommands, twitchChannelId, message.User.DisplayName)
	if err != nil {
		fmt.Println("AddCommandAlias Error: " + err.Error())
		return
	}
	if infoText != nil {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	commandAliasesList := strings.Join(aliasCommands, ", ")
	fmt.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", command)

	client.Twitch.Say(message.Channel, "New Command Aliases Added: "+commandAliasesList)
}
