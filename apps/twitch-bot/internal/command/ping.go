package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) PingCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	cmdResp.Message = "pong! VoHiYo"
	return &cmdResp, nil
}
