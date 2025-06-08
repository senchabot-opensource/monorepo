package command

import (
	"context"
	"errors"
	"log"
	"os"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

func inviteCommandResponse(s string) string {
	return "Hey VoHiYo! " + s + " Granting me moderator privileges in your channel would allow me to chat and unlock additional features to enhance your stream. You can find more details at docs.senchabot.app. Thanks! 😄"
}

func (c *commands) InviteCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if message.Channel != os.Getenv("BOT_USER_NAME") {
		return nil, errors.New("command did not executed in senchabot")
	}

	var channelName = message.User.Name
	var twitchChannelId = message.User.ID

	alreadyJoined, err := c.service.CreateTwitchChannel(context, twitchChannelId, channelName, nil)
	if err != nil {
		return nil, errors.New("(CreateTwitchChannel) Error: " + err.Error())
	}

	if alreadyJoined {
		cmdResp.Message = inviteCommandResponse("I'm already in your channel and ready to go.")
		return &cmdResp, nil
	}

	log.Println("TRYING TO JOIN TWITCH CHANNEL `" + channelName + "`")
	c.client.Twitch.Join(channelName)
	optionalCommands := helper.GetOptionalCommands()
	for _, command := range optionalCommands {
		_, err := c.service.CreateCommand(context, command.CommandName, command.CommandContent, twitchChannelId, "Senchabot")
		if err != nil {
			log.Println("[command.InviteCommand] GetOptionalCommands CreateCommand error:", err.Error())
		}
	}

	cmdResp.Message = inviteCommandResponse("I've joined your Twitch channel.")
	return &cmdResp, nil
}
