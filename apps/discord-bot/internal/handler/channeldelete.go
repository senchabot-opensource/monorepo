package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
)

func (h *handler) ChannelDelete() {
	h.discordClient.AddHandler(func(s *discordgo.Session, c *discordgo.ChannelDelete) {

		ok, err := h.service.DeleteDiscordTwitchLiveAnnosByChannelId(context.Background(), c.ID)
		if err != nil {
			log.Println("[handler.ChannelDelete] DeleteDiscordTwitchLiveAnnosByChannelId error:", err.Error())
		}
		if ok {
			log.Println("Livestream announcements deleted for the channel `" + c.Name + "` in guild id `" + c.GuildID + "`")
		}
	})
}
