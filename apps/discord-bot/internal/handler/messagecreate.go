package handler

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/event"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func (h *handler) MessageCreate(command command.Command) {
	ctx := context.Background()
	h.discordClient.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
		if m.Author.Bot {
			announcementChs, err := h.service.GetAnnouncementChannels(ctx) // redis or memory db?
			if err != nil {
				log.Println(err)
				return
			}

			for _, ch := range announcementChs {
				if ch.ChannelID == m.ChannelID {
					event.CreateLiveStreamScheduledEvent(s, m.Content, m.Embeds, m.GuildID)
				}
			}
		}

		if m.Author.ID == s.State.User.ID {
			return
		}

		cmdName, params := helpers.ParseMessage(m.Content)
		if cmdName == "" {
			return
		}

		command.Run(ctx, cmdName, params, m)

		if cmdName == "sozluk" {
			sozlukResp, err := gosenchabot.SozlukCommand(params)
			if err != nil {
				log.Println(err)
				return
			}
			s.ChannelMessageSend(m.ChannelID, sozlukResp)
		}
	})
}
