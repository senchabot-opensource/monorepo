package handler

import (
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

var subTypes = []string{"sub", "resub", "subgift", "submysterygift"}
var ChannelSubTypeCount = make(map[string]map[string]int)

func UserNoticeMessage(client *client.Clients, service service.Service) {
	client.Twitch.OnUserNoticeMessage(func(message twitch.UserNoticeMessage) {

		channel := message.Channel

		// Initialize count for the channel if it does not exist
		countSubTypes := ChannelSubTypeCount[channel]
		if countSubTypes == nil {
			countSubTypes = make(map[string]int)
			ChannelSubTypeCount[channel] = countSubTypes
		}

		// Increment subtype count for the channel
		for _, subType := range subTypes {
			if message.MsgID == subType {
				countSubTypes[subType]++
			}
		}

		fmt.Println("Subtype count for channel", channel, ":", countSubTypes)
	})
}
