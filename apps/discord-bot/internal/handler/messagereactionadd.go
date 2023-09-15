package handler

import (
	"fmt"
	"regexp"

	"github.com/bwmarrin/discordgo"
)

func (h *handler) MessageReactionAdd() {
	h.discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.MessageReactionAdd) {
		msg, err := s.ChannelMessage(i.ChannelID, i.MessageID)
		if err != nil {
			fmt.Println("There was an error while getting channel message in MessageReactionAdd: ", err.Error())
			return
		}

		goodMorningRegexp := regexp.MustCompile(`(?i)g(ü|u)nayd(ı|i)`)
		if goodMorningRegexp.MatchString(msg.Content) && i.Emoji.Name == "🌞" {
			err = s.MessageReactionAdd(msg.ChannelID, msg.ID, "🌞")
			if err != nil {
				fmt.Println("MessageReactionAdd Error:", err)
			}
		}
	})
}
