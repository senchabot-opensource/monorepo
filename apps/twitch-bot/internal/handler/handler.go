package handler

import (
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/services/database"
)

func InitHandlers(client *client.Clients, db database.Database) []string {
	PrivateMessage(client, db)
	joinedChannelList := BotJoin(client, db)

	return joinedChannelList
}
