package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func GetCommands() map[string]func(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	// TODO: command aliases
	var commands = map[string]func(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string){
		"ping":      PingCommand,
		"invite":    InviteCommand,
		"senchabot": SenchabotCommand,
		"sukru":     SukruCommand,

		"acmd": AddCommandCommand,
		"ucmd": UpdateCommandCommand,
		"dcmd": DeleteCommandCommand,
		//"info": InfoCommandCommand,
		//"cmds": CmdsCommandCommand,

		"acmda": AddCommandAliasCommand,
		"dcmda": DeleteCommandAliasCommand,

		"kampus":       KampusCommand,
		"frontendship": FrontendshipCommand,
	}

	return commands
}

func RunCommand(context context.Context, client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage) {
	commands := GetCommands()

	var splitMsg = strings.Split(message.Message, " ")
	var cmd = strings.Trim(splitMsg[0], " ")
	var params = splitMsg[1:]
	if strings.HasPrefix(cmd, "!") {
		cmd = strings.TrimPrefix(cmd, "!")
		if c, ok := commands[cmd]; ok {
			c(client, server, message, cmd, params)
			configData, err := server.GetTwitchBotConfig(context, message.RoomID, "bot_activity_enabled")
			if err != nil {
				fmt.Println(err.Error())
			}

			if configData != nil {
				if configData.Value == "1" {
					if err := server.CreateBotActionActivity(context, "twitch", cmd, message.RoomID, message.User.DisplayName); err != nil {
						fmt.Println(err.Error())
					}
				}
			}
			return
		}

		// HANDLE CUSTOM COMMANDS
		commandAlias, cmdAliasErr := server.GetCommandAlias(context, cmd, message.RoomID)
		if cmdAliasErr != nil {
			fmt.Println(cmdAliasErr.Error())
		}

		if commandAlias != nil {
			cmd = *commandAlias
		}

		cmdData, err := server.GetBotCommand(context, cmd, message.RoomID)
		if err != nil {
			fmt.Println(err.Error())
			return
		}

		if cmdData != nil {
			if message.RoomID == cmdData.TwitchChannelID {
				formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
				client.Twitch.Say(message.Channel, formattedCommandContent)
				configData, err := server.GetTwitchBotConfig(context, message.RoomID, "bot_activity_enabled")
				if err != nil {
					fmt.Println(err.Error())
				}

				if configData != nil {
					if configData.Value == "1" {
						if err := server.CreateBotActionActivity(context, "twitch", cmd, message.RoomID, message.User.DisplayName); err != nil {
							fmt.Println(err.Error())
						}
					}
				}
			}
		}
		// HANDLE CUSTOM COMMANDS
	}
}
