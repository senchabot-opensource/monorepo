package command

import (
	"context"
	"fmt"
	"strconv"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
)

func (c *commands) TimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) {
	if !helpers.CanExecuteCommand(context, c.service, message) {
		return
	}

	channelName := message.Channel

	if len(params) < 2 {
		c.client.Twitch.Say(channelName, "!timer [interval (integer)] [command_name]")
		return
	}

	status := params[0]
	command := params[1]

	commandData, err := c.service.GetBotCommand(context, command, message.RoomID)
	if err != nil {
		c.client.Twitch.Say(channelName, message.User.DisplayName+", the command \""+command+"\" not found")
		fmt.Println("> (TimerCommand) " + err.Error())
		return
	}

	interval, err := strconv.Atoi(status)
	if err != nil {
		c.client.Twitch.Say(channelName, message.User.DisplayName+", the interval value must be integer")
		fmt.Println("strconv.Atoi err", err)
		return
	}
	fmt.Println("interval", interval)

	//	isTimerEnabled := c.service.GetTimerStatus(commandData.ID)
	//	fmt.Println("isTimerEnabled", isTimerEnabled)
	// !isTimerEnabled &&

	if interval < 2 {
		switch interval {
		case 0:
			c.service.SetTimerDisabled(commandData.ID)
			c.client.Twitch.Say(channelName, "Timer Disabled")
		case 1:
			c.service.SetTimerEnabled(c.client, commandData.ID)
			c.client.Twitch.Say(channelName, "Timer Enabled")
		}
		return
	}

	if interval > 2 {
		c.service.SetTimer(c.client, channelName, commandData, interval*60000)
		c.client.Twitch.Say(channelName, "Set Timer")
	}
}
