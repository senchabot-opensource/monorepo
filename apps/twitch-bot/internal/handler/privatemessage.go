package handler

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func PrivateMessage(client *client.Clients, server *server.SenchabotAPIServer) {
	client.Twitch.OnPrivateMessage(func(message twitch.PrivateMessage) {
		command.RunCommand(context.Background(), client, server, message)
	})
}
