package handler

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/helper"
)

func (h *handlers) PrivateMessage() {
	commands := command.New(h.client, h.service, h.twitchService)
	ctx := context.Background()

	h.client.Twitch.OnPrivateMessage(func(message twitch.PrivateMessage) {
		cmdName, params := helper.ParseSysCmdMessage(message.Message)

		if !commands.IsSystemCommand(cmdName) {
			cmdName, params = helper.ParseMessage(message.Message)
		}

		if cmdName == "" {
			return
		}

		commands.Run(ctx, cmdName, params, message)
	})
}
