package command

import (
	"context"
	"fmt"
	"strconv"

	"github.com/gempir/go-twitch-irc/v3"
)

func (c *commands) TimerCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	enabled := params[0]
	timerMessage := params[1]
	channel := message.Channel
	isTimerEnabled := c.service.GetTimerStatus(channel)

	if !isTimerEnabled {
		c.service.SetTimer(c.client, channel, timerMessage, 10000)
		c.client.Twitch.Say(channel, "Set Timer")
		return
	}

	switch enabled {
	case "0":
		c.service.SetTimerDisabled(channel)
		c.client.Twitch.Say(channel, "Timer Disabled")
	case "1":
		c.service.SetTimerEnabled(c.client, channel)
		c.client.Twitch.Say(channel, "Timer Enabled")
	}

	enabledInt, err := strconv.Atoi(enabled)
	if err != nil {
		fmt.Println("strconv.Atoi err", err)
		return
	}
	if enabledInt > 3 {
		c.service.SetTimer(c.client, channel, timerMessage, enabledInt*1000)
		c.client.Twitch.Say(channel, "Reset Timer")
	}

}
