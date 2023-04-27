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

const ADD_COMMAND_ALIAS_INFO = "!acmda [command_name] [command_alias(es) separated by space]"

func AddCommandAliasCommand(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(message) {
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

	commandAliasesList := strings.Join(params, ", ")

	twitchChannelId := message.RoomID

	// Check command exists
	commandExist, err := server.CheckCommandExists(context.Background(), command, twitchChannelId)
	if err != nil {
		fmt.Println(err.Error())
	}
	if !commandExist {
		client.Twitch.Say(message.Channel, "the command \""+command+"\" does not exist")
	}

	if len(params) > 4 {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", Command Aliases length must be no more than 4")
		return
	}

	aliasExists, err := server.CreateCommandAliases(context.Background(), command, params, twitchChannelId, message.User.DisplayName)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	if aliasExists != nil {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", the command alias \""+*aliasExists+"\" already exists")
		return
	}
	fmt.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", command)

	client.Twitch.Say(message.Channel, "New Command Aliases Added: "+commandAliasesList)
}
