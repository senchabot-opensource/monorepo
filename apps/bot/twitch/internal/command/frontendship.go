package command

import "github.com/gempir/go-twitch-irc/v3"

func FrontendshipCommand(client *twitch.Client, message twitch.PrivateMessage, commandName string, params []string) {
	client.Say(message.Channel, "https://discord.gg/frontendship")
}
