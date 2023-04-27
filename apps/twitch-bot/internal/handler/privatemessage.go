package handler

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
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
				configData, err := server.GetTwitchBotConfig(context.Background(), message.RoomID, "bot_activity_enabled")
				if err != nil {
					fmt.Println(err.Error())
				}

				if configData != nil {
					if configData.ConfigValue == "1" {
						if err := server.CreateBotActionActivity(context.Background(), "twitch", cmd, message.RoomID, message.User.DisplayName); err != nil {
							fmt.Println(err.Error())
						}
					}
				}
				return
			}

			// HANDLE CUSTOM COMMANDS
			commandAlias, cmdAliasErr := server.GetCommandAlias(context.Background(), cmd, message.RoomID)
			if cmdAliasErr != nil {
				fmt.Println(cmdAliasErr.Error())
			}

			if commandAlias != nil {
				cmd = *commandAlias
			}

			cmdData, err := server.GetBotCommand(context.Background(), cmd, message.RoomID)
			if err != nil {
				fmt.Println(err.Error())
				return
			}

			if cmdData != nil {
				if message.RoomID == cmdData.TwitchChannelID {
					formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
					client.Twitch.Say(message.Channel, formattedCommandContent)
					configData, err := server.GetTwitchBotConfig(context.Background(), message.RoomID, "bot_activity_enabled")
					if err != nil {
						fmt.Println(err.Error())
					}

					if configData != nil {
						if configData.ConfigValue == "1" {
							if err := server.CreateBotActionActivity(context.Background(), "twitch", cmd, message.RoomID, message.User.DisplayName); err != nil {
								fmt.Println(err.Error())
							}
						}
					}
				}
			}
			// HANDLE CUSTOM COMMANDS
		}
	})
}
