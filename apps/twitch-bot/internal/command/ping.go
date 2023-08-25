package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) PingCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	cmdResp.Message = "pong! VoHiYo"
	return &cmdResp, nil
}
