package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
)

func (h *handler) GuildDelete() {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildDelete) {
		err := h.service.DeleteServerFromDB(ctx, g.ID)
		if err != nil {
			log.Println("[GuildDelete] DeleteServerFromDB error:", err.Error())
		}
		streamer.StopCheckLiveStreams(g.ID)
		streamer.DeleteServerFromData(g.ID)
		_, err = h.service.DeleteDiscordTwitchLiveAnnosByGuildId(ctx, g.ID)
		if err != nil {
			log.Println("[GuildDelete] DeleteDiscordTwitchLiveAnnosByGuildId error:", err.Error())
		}
	})
}
