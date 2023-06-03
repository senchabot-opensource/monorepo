package command

import (
	"context"
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
)

const UPDATE_COMMAND_INFO = "For example: !ucmd [command_name] [new_command_content]"

func (s *commands) UpdateCommandCommand(message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), s.service, message) {
		return
	}
	command_name, newCommandContent, check := helpers.GetCommandCreateUpdateParams(params)
	if !check {
		s.client.Twitch.Say(message.Channel, UPDATE_COMMAND_INFO)
		return
	}
	// Check command content length
	if infoText, check := helpers.ValidateCommandContentLength(newCommandContent); !check {
		s.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+infoText)
		return
	}

	updatedCommandName, infoText, err := s.service.DB.UpdateBotCommand(context.Background(), command_name, newCommandContent, message.RoomID, message.User.DisplayName)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		s.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_UPDATE: command_name:", updatedCommandName, "new_command_content:", newCommandContent)

	s.client.Twitch.Say(message.Channel, "Command Updated: "+*updatedCommandName)
}
