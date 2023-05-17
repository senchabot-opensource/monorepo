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

const DELETE_COMMAND_ALIAS_INFO = "For example: !dcmda [command_alias]"

func DeleteCommandAliasCommand(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), server, message) {
		return
	}
	if len(params) < 1 {
		client.Twitch.Say(message.Channel, DELETE_COMMAND_ALIAS_INFO)
		return
	}
	var command_alias = strings.ToLower(params[0])
	if command_alias != "" {
		err := server.DeleteCommandAlias(context.Background(), command_alias, message.RoomID)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		fmt.Println("COMMAND_ALIAS_DELETE: command_alias:", command_alias)

		client.Twitch.Say(message.Channel, "Command Alias Deleted: "+command_alias)
	}
}
