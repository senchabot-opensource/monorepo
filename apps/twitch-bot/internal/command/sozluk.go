package command

import (
	"context"
	"log"

	"github.com/gempir/go-twitch-irc/v3"
	commoncmd "github.com/senchabot-opensource/monorepo/packages/gosenchabot/commands"
)

func (c *commands) SozlukCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	sozlukResp, err := commoncmd.SozlukCommand(params)
	if err != nil {
		log.Println(err.Error())
		return
	}

	c.client.Twitch.Say(message.Channel, sozlukResp)
}
