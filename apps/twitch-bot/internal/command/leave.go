package command

import (
	"context"
	"errors"
	"log"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) LeaveCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	channelName := message.Channel
	channelId := message.User.ID

	if channelName != message.User.Name {
		return nil, errors.New("[command.LeaveCommand] command executed from someone else")
	}

	deleted, err := c.service.DeleteTwitchChannel(context, channelId, nil)
	if err != nil {
		return nil, errors.New("[command.LeaveCommand] (DeleteTwitchChannel) Error: " + err.Error())
	}

	if !deleted {
		return nil, errors.New("[command.LeaveCommand] something went wrong while deleting Twitch channel.")
	}

	log.Println("TRYING TO LEAVE TWITCH CHANNEL `" + channelName + "`")
	c.client.Twitch.Depart(channelName)
	return nil, nil
}
