package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
)

func (h *handler) ChannelDelete() {
	h.discordClient.AddHandler(func(s *discordgo.Session, c *discordgo.ChannelDelete) {
		if c.Type != discordgo.ChannelTypeGuildNews && c.Type != discordgo.ChannelTypeGuildText {
			return
		}

		ok, err := h.service.DeleteDiscordTwitchLiveAnnosByChannelId(context.Background(), c.ID)
		if err != nil {
			log.Println("[handler.ChannelDelete] DeleteDiscordTwitchLiveAnnosByChannelId error:", err.Error())
		}
		if ok {
			log.Println("Livestream announcements deleted for the channel `" + c.Name + "` in guild id `" + c.GuildID + "`")
		}

		ok, err = h.service.DeleteDiscordChannelTwitchCategoryFilter(context.Background(), c.GuildID, c.ID)
		if err != nil {
			log.Println("[handler.ChannelDelete] DeleteDiscordChannelTwitchCategoryFilter error:", err.Error())
		}
		if ok {
			log.Println("Twitch category filters deleted for the channel `" + c.Name + "` in guild id `" + c.GuildID + "`")
		}

		ok, err = h.service.DeleteAnnouncementChannel(context.Background(), c.ID)
		if err != nil {
			log.Println("[handler.ChannelDelete] DeleteAnnouncementChannel error:", err.Error())
		}
		if ok {
			log.Println("Announcement channel data deleted for the channel `" + c.Name + "` in guild id `" + c.GuildID + "`")
		}
	})
}
