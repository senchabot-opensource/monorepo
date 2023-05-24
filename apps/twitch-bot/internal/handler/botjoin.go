package handler

import (
	"context"
	"fmt"
	"log"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func BotJoin(client *client.Clients, server *server.SenchabotAPIServer) []string {
	channels, err := server.GetTwitchChannels(context.Background())
	if err != nil {
		log.Fatalf("(GetTwitchChannels) Error:" + err.Error())
	}

	channels = append(channels, &models.TwitchChannel{
		ChannelName: "senchabot",
	})

	channelList := make([]string, 0, len(channels))

	fmt.Println("JOINING TO CHANNELS")
	if len(channels) > 0 {
		for _, channel := range channels {
			fmt.Println("TRYING TO JOIN TWITCH CHANNEL `" + channel.ChannelName + "`")
			client.Twitch.Join(channel.ChannelName)
			channelList = append(channelList, channel.ChannelName)
		}
	}

	return channelList
}
