package handler

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
)

func (h *handler) GuildDelete() {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildDelete) {
		err := h.service.DeleteServerFromDB(ctx, g.ID)
		if err != nil {
			fmt.Println(err)
		}
		streamer.StopCheckLiveStreams(g.ID)
		streamer.DeleteServerFromData(g.ID)
		_, err = h.service.DeleteDiscordTwitchLiveAnnosByGuildId(ctx, g.ID)
		if err != nil {
			fmt.Println("[GuildDelete] service.DeleteDiscordTwitchLiveAnnosByGuildId: ", err.Error())
		}
	})
}
