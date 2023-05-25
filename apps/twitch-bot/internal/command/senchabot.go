package command

import (
	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

func SenchabotCommand(client *client.Clients, service service.Services, message twitch.PrivateMessage, commandName string, params []string) {
	client.Twitch.Say(message.Channel, "https://github.com/senchabot-dev/monorepo")
}
