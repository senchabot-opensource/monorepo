package handler

import (
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func InitHandlers(client *client.Clients, server *server.SenchabotAPIServer) {
	PrivateMessage(client, server)
	BotJoin(client, server)
}
