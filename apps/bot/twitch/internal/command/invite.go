package command

import "github.com/gempir/go-twitch-irc/v3"

func InviteCommand(client *twitch.Client, message twitch.PrivateMessage, commandName string, params []string) {
	var channel = message.User.Name
	if params[0] == channel {
		client.Join(channel)
	}
}
