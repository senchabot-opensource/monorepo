package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/event"
)

func (h *handler) Ready() {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		servers, err := h.service.GetServers(ctx)
		if err != nil {
			log.Println("[handler.Ready] GetServers error:", err.Error())
		}
		if err == nil {
			for _, server := range servers {
				if checkGuildExist(s.State.Guilds, server.ServerID) {
					continue
				}
				_, err = h.service.DeleteDiscordTwitchLiveAnnosByGuildId(ctx, server.ServerID)
				if err != nil {
					log.Println("[handler.Ready] DeleteDiscordTwitchLiveAnnosByGuildId error:", err.Error())
				}
				if err := h.service.DeleteServerFromDB(ctx, server.ServerID); err != nil {

					log.Println("[handler.Ready] DeleteServerFromDB error:", err.Error())
				}
			}
		}

		go event.CheckLiveStreamScheduledEvents(s)

		log.Println("Bot is ready. Logged in as:", s.State.User.Username)
	})
}
