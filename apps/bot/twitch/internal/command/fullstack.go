package command

import "github.com/gempir/go-twitch-irc/v3"

func FullstackCommand(client *twitch.Client, message twitch.PrivateMessage, commandName string, params []string) {
	client.Say(message.Channel, "@"+message.User.DisplayName+" Önerebileceğim kaynaklar: https://www.theodinproject.com/paths/full-stack-javascript ve https://fullstackopen.com/en/")
}
