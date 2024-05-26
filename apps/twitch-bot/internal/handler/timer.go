package handler

import (
	"context"
	"log"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
)

func Timer(ctx context.Context, client *client.Clients, service service.Service, channelId string, channelName string) {
	if channelId == "" {
		return
	}

	cmdTimers, err := service.GetCommandTimers(ctx, channelId)
	if err != nil {
		log.Println("[handler.Timer] GetCommandTimers error:", err.Error())
		return
	}

	for _, v := range cmdTimers {
		if v.Status == 0 {
			return
		}

		commandData, err := service.GetUserBotCommand(ctx, v.CommandName, v.BotPlatformID)
		if err != nil {
			log.Printf("[handler.Timer] GetUserBotCommand command_name: %v, error: %v", v.CommandName, err.Error())
			return
		}

		service.SetTimer(client, channelName, commandData, v.Interval*60000)
		// we can use SetTimerDisabled here for disabled timers
	}
}
