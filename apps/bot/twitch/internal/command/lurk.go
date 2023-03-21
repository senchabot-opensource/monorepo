package command

import "github.com/gempir/go-twitch-irc/v3"

func LurkCommand(client *twitch.Client, message twitch.PrivateMessage, commandName string, params []string) {
	client.Say(message.Channel, "Teşekkürler! "+message.User.DisplayName)
}
