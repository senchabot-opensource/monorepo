package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) SozlukCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	return command.SozlukCommand(params)
}
