package handler

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
)

func (h *handler) GuildCreate() {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildCreate) {
		err := h.service.AddServerToDB(ctx, g.ID, g.Name, g.OwnerID)
		if err != nil {
			fmt.Println(err)
		}
		streamer.StartCheckLiveStreams(s, ctx, h.service, g.ID)
	})
}
