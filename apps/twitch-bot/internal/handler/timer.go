package handler

import (
	"context"
	"fmt"
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
		log.Println("There was an error while getting command timers errors: " + err.Error())
		return
	}

	for _, v := range cmdTimers {
		if v.Status == 0 {
			return
		}

		commandData, err := service.GetUserBotCommand(ctx, v.CommandName, v.BotPlatformID)
		if err != nil {
			fmt.Printf("There was an error while getting user bot command. Command Name: %v, Error: %v", v.CommandName, err.Error())
			return
		}

		service.SetTimer(client, channelName, commandData, v.Interval*60000)
		// we can use SetTimerDisabled here for disabled timers
	}
}
