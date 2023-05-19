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
	if len(params) < 2 {
		client.Twitch.Say(message.Channel, ADD_COMMAND_ALIAS_INFO)
		return
	}
	var command = strings.ToLower(params[0])
	params = params[1:]

	if command == "" && len(params) == 0 {
		client.Twitch.Say(message.Channel, ADD_COMMAND_ALIAS_INFO)
		return
	}

	aliasCommands := helpers.MakeUniqueArray(params)

	commandAliasesList := strings.Join(aliasCommands, ", ")

	twitchChannelId := message.RoomID

	if len(aliasCommands) > 4 {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", Command Aliases length must be no more than 4")
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
	fmt.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", command)

	client.Twitch.Say(message.Channel, "New Command Aliases Added: "+commandAliasesList)
}
