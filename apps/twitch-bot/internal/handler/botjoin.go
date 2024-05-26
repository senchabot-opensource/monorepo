package handler

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

func BotJoin(client *client.Clients, service service.Service) []string {
	botId := os.Getenv("BOT_USER_ID")
	botUsername := os.Getenv("BOT_USER_NAME")

	ctx := context.Background()
	channels, err := service.GetTwitchChannels(ctx)
	if err != nil {
		log.Fatalf("[BotJoin Handler] Error:" + err.Error())
	}

	channels = append(channels, &models.TwitchChannel{
		ChannelName: botUsername,
	})

	channelIds := make([]string, 0, len(channels))
	if len(channels) < 2 {
		log.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + botUsername + "`")
		client.Twitch.Join(botUsername)
		Timer(ctx, client, service, botId, botUsername)
		return nil
	}

	token := strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:")
	log.Println("JOINING TO THE TWITCH CHANNELS")
	for _, channel := range channels {
		if channel.ChannelId == "" {
			log.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + botUsername + "`")
			client.Twitch.Join(botUsername)
			Timer(ctx, client, service, botId, botUsername)
			continue
		}

		twitchUser, err := twitch.GetTwitchUserInfo("id", channel.ChannelId, token)
		if err != nil {
			log.Printf("[handler.BotJoin] (GetTwitchUserInfo) ChannelId: %v, ChannelName: %v, Error: %v", channel.ChannelId, channel.ChannelName, err.Error())
			continue
		}

		log.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + twitchUser.Login + "`")
		client.Twitch.Join(twitchUser.Login)
		channelIds = append(channelIds, channel.ChannelId)
		Timer(ctx, client, service, channel.ChannelId, channel.ChannelName)
	}

	return channelIds
}
