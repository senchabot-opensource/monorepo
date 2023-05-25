package command

import (
	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/services/database"
)

func PingCommand(client *client.Clients, db database.Database, message twitch.PrivateMessage, commandName string, params []string) {
	client.Twitch.Say(message.Channel, "pong! VoHiYo")
}
