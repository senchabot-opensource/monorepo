package handler

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

func BotJoin(client *client.Clients, service service.Service) []string {
	channels, err := service.GetTwitchChannels(context.Background())
	if err != nil {
		log.Fatalf("[BotJoin Handler] Error:" + err.Error())
	}

	channels = append(channels, &models.TwitchChannel{
		ChannelName: config.BotUsername,
	})

	channelIds := make([]string, 0, len(channels))
	if len(channels) < 2 {
		fmt.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + config.BotUsername + "`")
		client.Twitch.Join(config.BotUsername)
		return nil
	}

	token := strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:")
	fmt.Println("JOINING TO THE TWITCH CHANNELS")
	for _, channel := range channels {
		if channel.ChannelId == "" {
			fmt.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + config.BotUsername + "`")
			client.Twitch.Join(config.BotUsername)
			continue
		}

		twitchUser, err := twitch.GetTwitchUserInfo("id", channel.ChannelId, token)
		if err != nil {
			log.Printf("[BotJoin Handler] ChannelId: %v, ChannelName: %v, Error: %v", channel.ChannelId, channel.ChannelName, err)
			continue
		}

		fmt.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + twitchUser.Login + "`")
		client.Twitch.Join(twitchUser.Login)
		channelIds = append(channelIds, channel.ChannelId)
	}

	return channelIds
}
