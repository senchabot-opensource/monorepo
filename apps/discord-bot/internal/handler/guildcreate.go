package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
)

func (h *handler) GuildCreate() {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildCreate) {
		log.Println("[handler.GuildCreate] Running AddServerToDB for guild  `" + g.Name + "` (ID: " + g.ID + ")")
		err := h.service.AddServerToDB(ctx, g.ID, g.Name, g.OwnerID)
		if err != nil {
			log.Println("[handler.GuildCreate] AddServerToDB error:", err.Error())
		}
		log.Println("[handler.GuildCreate] Initiate Twitch live streaming checks for the guild `" + g.Name + "` (ID: " + g.ID + ")")
		streamer.StartCheckLiveStreams(s, ctx, h.service, g.ID)
	})
}
