package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
)

func (c *commands) SenchabotCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	c.client.Twitch.Say(message.Channel, "An open-source, multi-platform bot designed for seamless integration with Twitch and Discord • senchabot.app • github.com/senchabot-dev/monorepo")
}
