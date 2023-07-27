package command

import (
	"context"
	"log"

	"github.com/gempir/go-twitch-irc/v3"
	common_cmd "github.com/senchabot-dev/monorepo/packages/common/commands"
)

func (c *commands) SozlukCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	sozlukResp, err := common_cmd.SozlukCommand(params)
	if err != nil {
		log.Println(err.Error())
		return
	}

	c.client.Twitch.Say(message.Channel, sozlukResp)
}
