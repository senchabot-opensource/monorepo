package handler

import (
	"log"

	"github.com/gempir/go-twitch-irc/v3"
)

var subTypes = []string{"sub", "resub", "subgift", "submysterygift"}
var ChannelSubTypeCount = make(map[string]map[string]int)

func (h *handlers) UserNoticeMessage() {
	h.client.Twitch.OnUserNoticeMessage(func(message twitch.UserNoticeMessage) {

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

		log.Println("Subtype count for channel", channel, ":", countSubTypes)
	})
}
