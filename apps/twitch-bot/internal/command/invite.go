package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
)

func (s *commands) InviteCommand(message twitch.PrivateMessage, commandName string, params []string) {
	if message.Channel != "senchabot" {
		return
	}

	if len(params) < 1 {
		s.client.Twitch.Say(message.Channel, "!invite [your_channel_name]")
		return
	}

	var channelName = message.User.Name
	if strings.ToLower(params[0]) != channelName {
		s.client.Twitch.Say(message.Channel, "You need to specify your channel name. !invite "+channelName)
		return
	}

	var twitchChannelId = message.User.ID
	alreadyJoined, err := s.service.DB.CreateTwitchChannel(context.Background(), twitchChannelId, channelName, nil)
	if err != nil {
		fmt.Println("(CreateTwitchChannel) Error:", err)
		return
	}

	if alreadyJoined {
		return
	}

	fmt.Println("TRYING TO JOIN TWITCH CHANNEL `" + channelName + "`")
	s.client.Twitch.Join(channelName)
	optionalCommands := models.GetOptionalCommands()
	for _, command := range optionalCommands {
		_, err := s.service.DB.CreateBotCommand(context.Background(), command.CommandName, command.CommandContent, twitchChannelId, "Senchabot")
		if err != nil {
			fmt.Println(err.Error())
		}
	}

	s.client.Twitch.Say(message.Channel, "I joined your Twitch channel, sweetie")
}
