package handler

import (
	"log"
	"regexp"

	"github.com/bwmarrin/discordgo"
)

func (h *handler) MessageReactionAdd() {
	h.discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.MessageReactionAdd) {
		msg, err := s.ChannelMessage(i.ChannelID, i.MessageID)
		if err != nil {
			log.Println("[handler.MessageReactionAdd] ChannelMessage error:", err.Error())
			return
		}

		goodMorningRegexp := regexp.MustCompile(`(?i)(g(ü|u)nayd(ı|i)|good\s*morn[i]+ng+)`)
		if goodMorningRegexp.MatchString(msg.Content) && i.Emoji.Name == "🌞" {
			err = s.MessageReactionAdd(msg.ChannelID, msg.ID, "🌞")
			if err != nil {
				log.Println("[handler.MessageReactionAdd] Good Morning Message Reaction error:", err)
			}
		}
	})
}
