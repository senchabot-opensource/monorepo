package command

import (
	"context"
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
)

const ADD_COMMAND_INFO = "For example: !acmd [command_name] [command_content]"

func (s *commands) AddCommandCommand(message twitch.PrivateMessage, commandName string, params []string) {
	if !helpers.CanExecuteCommand(context.Background(), s.service, message) {
		return
	}
	command_name, command_content, check := helpers.GetCommandCreateUpdateParams(params)
	if !check {
		// "Birleşmiş Milletler 21 Mayıs'ı Uluslararası Çay Günü olarak belirlemiştir." (Bu yorum satırı Twitch chatinde Harami tarafından redeem yoluyla yazdırılmıştır. Arz ederim.)
		s.client.Twitch.Say(message.Channel, ADD_COMMAND_INFO)
		return
	}
	// Check command name and content length
	if infoText, check := helpers.ValidateCommandCreateParams(command_name, command_content); !check {
		s.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+infoText)
		return
	}

	infoText, err := s.service.DB.CreateBotCommand(context.Background(), command_name, command_content, message.RoomID, message.User.DisplayName)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		s.client.Twitch.Say(message.Channel, message.User.DisplayName+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_ADD: command_name:", command_name, ", command_content:", command_content)

	s.client.Twitch.Say(message.Channel, "New Command Added: "+command_name)
}
