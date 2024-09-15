package command

import (
	"context"
	"errors"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) TimerCommand(context context.Context, message twitch.PrivateMessage, _ string, _ []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse
	channelId := message.RoomID

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], channelId) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	cmdResp.Message = "Add timer: !atimer [command_name] [interval (integer, minute)] • Delete timer: !dtimer [command_name] • Click for more information: https://docs.senchabot.app/twitch-bot/command-timer-system"
	return &cmdResp, nil
}
