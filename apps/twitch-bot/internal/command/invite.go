package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func InviteCommand(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	if message.Channel != "senchabot" {
		return
	}

	if len(params) < 1 {
		client.Twitch.Say(message.Channel, "!invite [your_channel_name]")
		return
	}

	var channelName = message.User.Name
	if strings.ToLower(params[0]) != channelName {
		client.Twitch.Say(message.Channel, "You need to specify your channel name. !invite "+channelName)
		return
	}

	var twitchChannelId = message.User.ID
	alreadyJoined, err := server.CreateTwitchChannel(context.Background(), twitchChannelId, channelName)
	if err != nil {
		fmt.Println("(CreateTwitchChannel) Error:", err)
		return
	}

	if alreadyJoined {
		return
	}

	fmt.Println("TRYING TO JOIN TWITCH CHANNEL `" + channelName + "`")
	client.Twitch.Join(channelName)
	optionalCommands := models.GetOptionalCommands()
	for _, command := range optionalCommands {
		_, err := server.CreateBotCommand(context.Background(), command.CommandName, command.CommandContent, twitchChannelId, "Senchabot")
		if err != nil {
			fmt.Println(err.Error())
		}
	}

	client.Twitch.Say(message.Channel, "I joined your Twitch channel, sweetie")
}
