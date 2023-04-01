package handler

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/client"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/command"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/server"
)

func PrivateMessage(client *client.Clients, server *server.SenchabotAPIServer) {
	client.Twitch.OnPrivateMessage(func(message twitch.PrivateMessage) {
		commands := command.GetCommands()

		var splitMsg = strings.Split(message.Message, " ")
		var cmd = strings.Trim(splitMsg[0], " ")
		var params = splitMsg[1:]
		if strings.HasPrefix(cmd, "!") {
			cmd = strings.TrimPrefix(cmd, "!")
			if c, ok := commands[cmd]; ok {
				c(client, server, message, cmd, params)
				return
			}

			// HANDLE CUSTOM COMMANDS
			cmdData, err := server.GetBotCommand(context.Background(), cmd, message.RoomID)
			if err != nil {
				fmt.Println(err.Error())
				return
			}

			if cmdData != nil {
				if message.RoomID == cmdData.TwitchChannelID {
					formattedCommandContent := helpers.FormatCommandContent(cmdData.CommandContent, message)
					client.Twitch.Say(message.Channel, formattedCommandContent)
				}
			}
			// HANDLE CUSTOM COMMANDS
		}
	})
}
