package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
)

func (c *commands) PingCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	c.client.Twitch.Say(message.Channel, "pong! VoHiYo")
}
