package handler

import (
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

func InitHandlers(client *client.Clients, service service.Services) []string {
	PrivateMessage(client, service)
	joinedChannelList := BotJoin(client, service)

	return joinedChannelList
}
