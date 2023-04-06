package handler

import (
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/client"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/server"
)

func InitHandlers(client *client.Clients, server *server.SenchabotAPIServer) {
	PrivateMessage(client, server)
	BotJoin(client, server)
}
