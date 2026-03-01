package command

import (
	"context"
	"log"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) ClipCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	/*if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand + ": ClipCommand")
	}*/

	clipURL, err := c.twitchService.CreateClip(message.RoomID)
	if err != nil {
		log.Println("[command.ClipCommand] CreateClip error:", err.Error())
		cmdResp.Message = "Failed to create clip: " + err.Error()
		return &cmdResp, nil
	}

	cmdResp.Message = "Clip created: " + *clipURL
	return &cmdResp, nil
}
