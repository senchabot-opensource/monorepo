package command

import (
	"context"
	"errors"
	"log"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	twsrvc "github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

var (
	SO_COMMAND_INFO = "For example: !so [username]"
)

func (c *commands) SoCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error) {
	var cmdResp models.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + " cannot execute the command")
	}

	if check := helpers.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = SO_COMMAND_INFO
		return &cmdResp, nil
	}
	var streamerUsername = strings.ToLower(params[0])

	token := strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:")

	respMsg, err := twsrvc.GiveShoutout(streamerUsername, message.RoomID, token)
	if err != nil {
		log.Printf("[SoCommand] Error: %v", err)
		return nil, err
	}

	cmdResp.Message = *respMsg

	return &cmdResp, nil
}
