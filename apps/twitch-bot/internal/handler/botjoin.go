package handler

import (
	"context"
	"fmt"
	"log"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func BotJoin(client *client.Clients, server *server.SenchabotAPIServer) {
	channels, err := server.GetTwitchChannels(context.Background())
	if err != nil {
		log.Fatalf("(GetTwitchChannels) Error:" + err.Error())
	}

	channels = append(channels, &models.TwitchChannel{
		ChannelName: "senchabot",
	})

	fmt.Println("JOINING TO CHANNELS")
	if len(channels) > 0 {
		for i := 0; i < len(channels); i++ {
			fmt.Println("TRYING TO JOIN TWITCH CHANNEL `" + channels[i].ChannelName + "`")
			client.Twitch.Join(channels[i].ChannelName)
		}
	}
}
