package handler

import (
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/command"
)

func PrivateMessage(client *twitch.Client) {
	client.OnPrivateMessage(func(message twitch.PrivateMessage) {
		commands := command.GetCommands()

		var splitMsg = strings.Split(message.Message, " ")
		var cmd = strings.Trim(splitMsg[0], " ")
		var params = splitMsg[1:]
		if strings.HasPrefix(cmd, "!") {
			cmd = strings.TrimPrefix(cmd, "!")
			if c, ok := commands[cmd]; ok {
				c(client, message, cmd, params)
			}
		}
	})
}
