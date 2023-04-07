package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

const ADD_COMMAND_INFO = "!acmd [command_name] [command_content]"

func AddCommandCommand(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	if !strings.Contains(message.Tags["badges"], "moderator") {
		if !strings.Contains(message.Tags["badges"], "broadcaster") {
			return
		}
	}
	if len(params) < 2 {
		client.Twitch.Say(message.Channel, ADD_COMMAND_INFO)
		return
	}
	var newCommandName = strings.ToLower(params[0])
	params = params[1:]
	var newCommandContent = strings.Join(params, " ")

	if newCommandName == "" && newCommandContent == "" {
		client.Twitch.Say(message.Channel, ADD_COMMAND_INFO)
		return
	}
	// Check command name and content length
	if len(newCommandName) > 50 {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", Command Name length must be no more than 50 chars")
		return
	}
	if len(newCommandContent) > 400 {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", Command Content length must be no more than 400 chars")
		return
	}
	commandExists, err := server.CreateBotCommand(context.Background(), newCommandName, newCommandContent, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	if commandExists {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", this command already exists")
		return
	}
	fmt.Println("COMMAND_ADD: command_name:", newCommandName, "command_content:", newCommandContent)

	client.Twitch.Say(message.Channel, "New Command Added: "+newCommandName)
}
