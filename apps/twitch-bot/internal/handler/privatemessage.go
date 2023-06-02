package handler

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

func PrivateMessage(client *client.Clients, service *service.Services) {
	commands := command.NewCommands(client, service)

	client.Twitch.OnPrivateMessage(func(message twitch.PrivateMessage) {
		commands.RunCommand(context.Background(), message)
	})
}
