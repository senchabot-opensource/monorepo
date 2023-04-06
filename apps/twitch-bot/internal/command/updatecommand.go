package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/client"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/server"
)

const UPDATE_COMMAND_INFO = "!ucmd [command_name] [new_command_content]"

func UpdateCommandCommand(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	if !strings.Contains(message.Tags["badges"], "moderator") {
		if !strings.Contains(message.Tags["badges"], "broadcaster") {
			return
		}
	}
	if len(params) < 2 {
		client.Twitch.Say(message.Channel, UPDATE_COMMAND_INFO)
		return
	}
	var command_name = strings.ToLower(params[0])
	params = params[1:]
	var newCommandContent = strings.Join(params, " ")

	if command_name == "" && newCommandContent == "" {
		client.Twitch.Say(message.Channel, UPDATE_COMMAND_INFO)
		return
	}
	// Check command content length
	if len(newCommandContent) > 400 {
		client.Twitch.Say(message.Channel, message.User.DisplayName+", Command Content length must be no more than 400 chars")
		return
	}
	err := server.UpdateBotCommand(context.Background(), command_name, newCommandContent, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println("COMMAND_UPDATE: command_name:", command_name, "new_command_content:", newCommandContent)

	client.Twitch.Say(message.Channel, "Command Updated: "+command_name)
}
