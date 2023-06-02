package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
)

const DELETE_COMMAND_ALIAS_INFO = "For example: !dcmda [command_alias]"

func (s *commands) DeleteCommandAliasCommand(message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), s.service, message) {
		return
	}
	if check := helpers.ValidateCommandDeleteParamsLength(params); !check {
		s.client.Twitch.Say(message.Channel, DELETE_COMMAND_ALIAS_INFO)
		return
	}
	var command_alias = strings.ToLower(params[0])
	infoText, err := s.service.DB.DeleteCommandAlias(context.Background(), command_alias, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		s.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_ALIAS_DELETE: command_alias:", command_alias)

	s.client.Twitch.Say(message.Channel, "Command Alias Deleted: "+command_alias)
}
