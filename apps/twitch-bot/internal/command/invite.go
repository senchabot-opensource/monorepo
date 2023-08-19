package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func (c *commands) InviteCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	if message.Channel != "senchabot" {
		return
	}

	if len(params) < 1 {
		c.client.Twitch.Say(message.Channel, "!invite [your_channel_name]")
		return
	}

	var channelName = message.User.Name
	if strings.ToLower(params[0]) != channelName {
		c.client.Twitch.Say(message.Channel, "You need to specify your channel name. !invite "+channelName)
		return
	}

	var twitchChannelId = message.User.ID
	alreadyJoined, err := c.service.CreateTwitchChannel(context, twitchChannelId, channelName, nil)
	if err != nil {
		fmt.Println("(CreateTwitchChannel) Error:", err)
		return
	}

	if alreadyJoined {
		return
	}

	fmt.Println("TRYING TO JOIN TWITCH CHANNEL `" + channelName + "`")
	c.client.Twitch.Join(channelName)
	optionalCommands := gosenchabot.GetOptionalCommands()
	for _, command := range optionalCommands {
		_, err := c.service.CreateBotCommand(context, command.CommandName, command.CommandContent, twitchChannelId, "Senchabot")
		if err != nil {
			fmt.Println(err.Error())
		}
	}

	c.client.Twitch.Say(message.Channel, "I joined your Twitch channel, sweetie")
}
