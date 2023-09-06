package handler

import (
	"context"
	"fmt"
	"log"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
)

func Timer(ctx context.Context, client *client.Clients, service service.Service, channelId string, channeName string) {
	if channelId == "" {
		return //	channelId = "845116372"
	}
	cmdTimers, err := service.GetCommandTimers(ctx, channelId)
	if err != nil {
		log.Println("There was an error while getting command errors: " + err.Error())
		return
	}

	for _, v := range cmdTimers {
		commandData, err := service.GetUserBotCommand(ctx, v.CommandName, v.BotPlatformID)
		if err != nil {
			fmt.Printf("There was an error while getting user bot command. Command Name: %v, Error: %v", v.CommandName, err.Error())
			return
		}

		service.SetTimer(client, channeName, commandData, v.Interval*60000)
	}
}
