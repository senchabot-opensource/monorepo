package command

import (
	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

func SukruCommand(client *client.Clients, service service.Services, message twitch.PrivateMessage, commandName string, params []string) {
	client.Twitch.Say(message.Channel, "https://github.com/dotnet/runtime/pull/73499/files#diff-31c708307a9d9c09e7e488a873803e62bfcc91a8d3fa6d9398d3c8bb13cff1afR338")
}
