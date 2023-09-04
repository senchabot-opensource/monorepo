package command

import (
	"context"
	"fmt"
	"log"
	"strconv"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
)

func (c *commands) TimerCommand(context context.Context, message twitch.PrivateMessage, _ string, params []string) {
	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return
	}

	channelName := message.Channel

	if len(params) < 2 {
		c.client.Twitch.Say(channelName, "!timer [command_name] [interval (integer)]")
		return
	}

	command := params[0]
	intervalStr := params[1]

	commandData, err := c.service.GetUserBotCommand(context, command, message.RoomID)
	if err != nil {
		c.client.Twitch.Say(channelName, message.User.DisplayName+", the command \""+command+"\" not found")
		fmt.Println("> (TimerCommand) " + err.Error())
		return
	}

	interval, err := strconv.Atoi(intervalStr)
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

	// should be >= 25
	if interval > 2 {
		c.service.SetTimer(c.client, channelName, commandData, interval*60000)
		err := c.service.CreateCommandTimer(context, "twitch", message.RoomID, commandData.CommandName, interval)
		if err != nil {
			log.Println(err.Error())
			c.client.Twitch.Say(channelName, fmt.Sprintf("Command Timer Enabled: %v. There was an error in db. This timer is not saved to the db.", commandData.CommandName))
			return
		}
		c.client.Twitch.Say(channelName, fmt.Sprintf("Command Timer Enabled: %v.", commandData.CommandName))
	}
}
