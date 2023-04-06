package command

import (
	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func GetCommands() map[string]func(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string) {
	// TODO: command aliases
	var commands = map[string]func(client *client.Clients, server *server.SenchabotAPIServer, message twitch.PrivateMessage, commandName string, params []string){
		"ping":      PingCommand,
		"invite":    InviteCommand,
		"senchabot": SenchabotCommand,

		"acmd": AddCommandCommand,
		"ucmd": UpdateCommandCommand,
		"dcmd": DeleteCommandCommand,
		//"info": InfoCommandCommand,
		//"cmds": CmdsCommandCommand,

		"kampus":       KampusCommand,
		"frontendship": FrontendshipCommand,
	}

	return commands
}
