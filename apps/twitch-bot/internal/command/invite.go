package command

import (
	"context"
	"errors"
	"log"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) InviteCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if message.Channel != os.Getenv("BOT_USER_NAME") {
		return nil, errors.New("command did not executed in senchabot")
	}

	if len(params) < 1 {
		cmdResp.Message = config.InviteCommandInfo
		return &cmdResp, nil
	}

	var channelName = message.User.Name
	if strings.ToLower(params[0]) != channelName {
		cmdResp.Message = "You need to specify your channel name. !invite " + channelName
		return &cmdResp, nil
	}

	var twitchChannelId = message.User.ID
	alreadyJoined, err := c.service.CreateTwitchChannel(context, twitchChannelId, channelName, nil)
	if err != nil {
		return nil, errors.New("(CreateTwitchChannel) Error: " + err.Error())
	}

	if alreadyJoined {
		return nil, errors.New("i have already joined this channel")
	}

	log.Println("TRYING TO JOIN TWITCH CHANNEL `" + channelName + "`")
	c.client.Twitch.Join(channelName)
	optionalCommands := helper.GetOptionalCommands()
	for _, command := range optionalCommands {
		_, err := c.service.CreateCommand(context, command.CommandName, command.CommandContent, twitchChannelId, "Senchabot")
		if err != nil {
			log.Println("[command.InviteCommand] CreateCommand error:", err.Error())
		}
	}

	cmdResp.Message = "I joined your Twitch channel, sweetie"
	return &cmdResp, nil
}
