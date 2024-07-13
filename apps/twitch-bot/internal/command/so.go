package command

import (
	"context"
	"errors"
	"log"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
	twsrvc "github.com/senchabot-opensource/monorepo/service/twitch"
)

func (c *commands) SoCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	if check := helper.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = config.SoCommandInfo
		return &cmdResp, nil
	}
	var streamerUsername = strings.ToLower(params[0])
	streamerUsername = strings.TrimPrefix(streamerUsername, "@")

	token := strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:")

	respMsg, err := twsrvc.GiveShoutout(streamerUsername, message.RoomID, token)
	if err != nil {
		log.Println("[command.SoCommand] GiveShoutout error:", err.Error())
		return nil, err
	}

	cmdResp.Message = *respMsg

	return &cmdResp, nil
}
