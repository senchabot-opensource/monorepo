package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/event"
)

func (h *handler) MessageCreate(command command.Command) {
	ctx := context.Background()
	eventService := event.NewEventService(h.twitchService)

	h.discordClient.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
		if m.Author.Bot {
			announcementChs, err := h.service.GetAnnouncementChannels(ctx)
			if err != nil {
				log.Println("[handler.MessageCreate] GetAnnouncementChannels error:", err.Error())
				return
			}

			for _, ch := range announcementChs {
				if ch.ChannelID == m.ChannelID {
					eventService.CreateLiveStreamScheduledEvent(s, m.Content, m.Embeds, m.GuildID)
				}
			}
		}

		if m.Author.ID == s.State.User.ID {
			return
		}

		userPrivacyPreferences, err := h.service.GetDiscordUserPrivacyPreferences(ctx, m.Author.ID)
		if err != nil {
			log.Println("[handler.MessageCreate] service.GetDiscordUserPrivacyPreferences error:", err.Error())
			return
		}
		if userPrivacyPreferences != nil && userPrivacyPreferences.DoNotTrackMessages {
			return
		}

		cmdName, params := helpers.ParseMessage(m.Content)
		if cmdName == "" {
			return
		}

		command.Run(ctx, cmdName, params, m)
	})
}
