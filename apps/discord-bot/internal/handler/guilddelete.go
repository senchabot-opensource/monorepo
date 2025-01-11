package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
)

func (h *handler) GuildDelete() {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildDelete) {
		log.Println("[handler.GuildDelete] Delete records for the guild `" + g.Name + "` (ID: " + g.ID + ")")
		err := h.service.DeleteServerFromDB(ctx, g.ID)
		if err != nil {
			log.Println("[handler.GuildDelete] DeleteServerFromDB error:", err.Error())
		}
		h.streamerService.StopCheckLiveStreams(g.ID)
		h.streamerService.DeleteServerFromData(g.ID)
		_, err = h.service.DeleteDiscordTwitchLiveAnnosByGuildId(ctx, g.ID)
		if err != nil {
			log.Println("[handler.GuildDelete] DeleteDiscordTwitchLiveAnnosByGuildId error:", err.Error())
		}
	})
}
