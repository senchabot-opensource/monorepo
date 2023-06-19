package handler

import (
	"context"
	"time"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

func PrivateMessage(client *client.Clients, service service.Service) {
	commands := command.NewCommands(client, service, time.Minute*2)
	ctx := context.Background()

	client.Twitch.OnPrivateMessage(func(message twitch.PrivateMessage) {
		cmdName, params := helpers.ParseMessage(message.Message)
		if cmdName == "" {
			return
		}

		commands.RunStaticCommand(ctx, cmdName, params, message)
		commands.RunDynamicCommand(ctx, cmdName, message)
	})
}
