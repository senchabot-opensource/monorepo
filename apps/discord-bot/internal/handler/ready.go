package handler

import (
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/event"
)

func (h *handler) Ready(token string) {
	h.discordClient.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		go event.CheckLiveStreamScheduledEvents(s, token)

		log.Println("Bot is ready. Logged in as:", s.State.User.Username)
	})
}
