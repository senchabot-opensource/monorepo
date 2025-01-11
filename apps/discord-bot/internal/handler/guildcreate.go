package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
)

func (h *handler) GuildCreate() {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildCreate) {
		log.Println("[handler.GuildCreate] Adding the guild `" + g.Name + "` (ID: " + g.ID + ") to the database")
		err := h.service.AddServerToDB(ctx, g.ID, g.Name, g.OwnerID)
		if err != nil {
			log.Println("[handler.GuildCreate] AddServerToDB error:", err.Error())
		}
		log.Println("[handler.GuildCreate] Initiate Twitch live streaming checks for the guild `" + g.Name + "` (ID: " + g.ID + ")")
		h.streamerService.StartCheckLiveStreams(s, ctx, h.service, g.ID)
	})
}
