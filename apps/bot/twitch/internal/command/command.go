package command

import (
	"github.com/gempir/go-twitch-irc/v3"
)

func GetCommands() map[string]func(client *twitch.Client, message twitch.PrivateMessage, commandName string, params []string) {
	// TODO: command aliases
	var commands = map[string]func(client *twitch.Client, message twitch.PrivateMessage, commandName string, params []string){
		"ping":         PingCommand,
		"kampus":       KampusCommand,
		"frontendship": FrontendshipCommand,
		"fs":           FullstackCommand,
		"lurk":         LurkCommand,
		"invite":       InviteCommand,
	}

	return commands
}
