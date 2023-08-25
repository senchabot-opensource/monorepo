package command

import (
	"context"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) SozlukCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse
	sozlukResp, err := gosenchabot.SozlukCommand(params)
	if err != nil {
		return nil, err
	}

	cmdResp.Message = sozlukResp
	return &cmdResp, nil
}
