package handler

import (
	"context"
	"log"
	"os"

	"github.com/senchabot-opensource/monorepo/model"
)

func (h *handlers) BotJoin() []string {
	botId := os.Getenv("BOT_USER_ID")
	botUsername := os.Getenv("BOT_USER_NAME")

	ctx := context.Background()
	channels, err := h.service.GetTwitchChannels(ctx)
	if err != nil {
		log.Fatalf("[BotJoin Handler] Error: %v", err)
	}

	channels = append(channels, &model.TwitchChannel{
		ChannelName: botUsername,
	})

	channelIds := make([]string, 0, len(channels))
	if len(channels) < 2 {
		log.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + botUsername + "`")
		h.client.Twitch.Join(botUsername)
		Timer(ctx, h.client, h.service, botId, botUsername)
		return nil
	}

	log.Println("JOINING TO THE TWITCH CHANNELS")
	for _, channel := range channels {
		if channel.ChannelId == "" {
			log.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + botUsername + "`")
			h.client.Twitch.Join(botUsername)
			Timer(ctx, h.client, h.service, botId, botUsername)
			continue
		}

		twitchUser, err := h.twitchService.GetUserInfoById(channel.ChannelId)
		if err != nil {
			log.Printf("[handler.BotJoin] (GetUserInfo) ChannelId: %v, ChannelName: %v, Error: %v", channel.ChannelId, channel.ChannelName, err.Error())
			continue
		}

		log.Println("TRYING TO JOIN THE TWITCH CHANNEL `" + twitchUser.Login + "`")
		h.client.Twitch.Join(twitchUser.Login)
		channelIds = append(channelIds, channel.ChannelId)
		Timer(ctx, h.client, h.service, channel.ChannelId, channel.ChannelName)
	}

	return channelIds
}
