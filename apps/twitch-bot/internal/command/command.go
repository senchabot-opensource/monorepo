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

func splitMessage(message string) (string, []string) {
	var splitMsg = strings.Split(message, " ")
	var cmdName = strings.Trim(splitMsg[0], " ")
	var params = splitMsg[1:]

	if !strings.HasPrefix(cmdName, "!") {
		return "", nil
	}

	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}

func RunCommand(context context.Context, client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage) {
	commands := GetCommands()

	cmdName, params := splitMessage(message.Message)
	if cmdName == "" {
		return
	}

	if cmd, ok := commands[cmdName]; ok {
		cmd(client, server, message, cmdName, params)
		server.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName)
		return
	}

	// HANDLE CUSTOM COMMANDS

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := server.GetCommandAlias(context, cmdName, message.RoomID)
	if cmdAliasErr != nil {
		fmt.Println(cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	cmdData, err := server.GetBotCommand(context, cmdName, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if cmdData == nil || message.RoomID != cmdData.TwitchChannelID {
		return
	}

	formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
	client.Twitch.Say(message.Channel, formattedCommandContent)
	server.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName)
	// HANDLE CUSTOM COMMANDS
}
