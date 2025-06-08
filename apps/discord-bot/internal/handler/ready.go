package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/event"
)

func (h *handler) Ready() {
	ctx := context.Background()
	eventService := event.NewEventService(h.twitchService, h.service)

	h.discordClient.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		guilds := s.State.Guilds
		log.Println("[handler.Ready] ADD MISSING GUILDS TO DATABASE")
		for _, g := range guilds {
			err := h.service.AddServerToDB(ctx, g.ID, g.Name, g.OwnerID)
			if err != nil {
				log.Println("[handler.Ready] AddServerToDB error:", err.Error(), "Guild:", g.ID, g.Name)
			}
		}
		servers, err := h.service.GetServers(ctx)
		if err != nil {
			log.Println("[handler.Ready] GetServers error:", err.Error())
		}
		if err == nil {
			for _, server := range servers {
				if checkGuildExist(guilds, server.ServerID) {
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

		go eventService.CheckLiveStreamScheduledEvents(s)

		log.Println("[handler.Ready] Bot is ready. Logged in as:", s.State.User.Username)
	})
}
