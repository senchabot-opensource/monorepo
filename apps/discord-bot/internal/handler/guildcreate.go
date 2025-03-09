package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
)

func (h *handler) GuildCreate() {
	h.discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildCreate) {
		ctx := context.Background()

		log.Println("[handler.GuildCreate] Running AddServerToDB for guild  `" + g.Name + "` (ID: " + g.ID + ")")
		err := h.service.AddServerToDB(ctx, g.ID, g.Name, g.OwnerID)
		if err != nil {
			log.Println("[handler.GuildCreate] AddServerToDB error:", err.Error())
		}

		// Deploy custom commands for this guild
		command.DeployCustomCommandsForGuild(s, ctx, h.service, g.ID)

		log.Println("[handler.GuildCreate] Initiate Twitch live streaming checks for the guild `" + g.Name + "` (ID: " + g.ID + ")")
		h.streamerService.StartCheckLiveStreams(s, ctx, h.service, g.ID)
	})
}
