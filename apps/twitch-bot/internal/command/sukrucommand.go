package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
)

func (c *commands) SukruCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	c.client.Twitch.Say(message.Channel, "https://github.com/dotnet/runtime/pull/73499/files#diff-31c708307a9d9c09e7e488a873803e62bfcc91a8d3fa6d9398d3c8bb13cff1afR338")
}
