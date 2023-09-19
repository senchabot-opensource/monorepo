package command

import (
	"context"
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

const FOURTEEN_DAYS = 24 * 14

func (c *commands) PurgeCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	case "events":
		events, err := s.GuildScheduledEvents(i.GuildID, false)
		if err != nil {
			log.Println(err)
			ephemeralRespond(s, i, config.ErrorMessage+"#1011")
		}

		for _, e := range events {
			s.GuildScheduledEventDelete(i.GuildID, e.ID)
		}

		ephemeralRespond(s, i, "Tüm planlanmış etkinlikler silindi.")

	case "last-100-channel-messages":
		options = options[0].Options
		content := ""

		if options == nil || len(options) < 1 {
			ephemeralRespond(s, i, "One of the `message-content-contains` or `user-name-contains` options must be filled.")
			return
		}

		optionValue := options[0].StringValue()
		channelID := i.ChannelID
		var messageIDs []string

		messages, err := s.ChannelMessages(channelID, 100, "", "", "")

		if err != nil {
			fmt.Println("Error while fetching messages", err.Error())
			ephemeralRespond(s, i, "Something went wrong while fetching messages.")
			return
		}

		switch options[0].Name {
		case "message-content":
			for _, m := range messages {
				if gosenchabot.CheckTimeOlderThan(m.Timestamp, FOURTEEN_DAYS) && gosenchabot.ContainsLowerCase(m.Content, optionValue) {
					messageIDs = append(messageIDs, m.ID)
				}
			}
			content = "containing the characters `" + optionValue + "`"
		case "username":
			for _, m := range messages {
				if gosenchabot.CheckTimeOlderThan(m.Timestamp, FOURTEEN_DAYS) && gosenchabot.ContainsLowerCase(m.Author.Username, optionValue) {
					messageIDs = append(messageIDs, m.ID)
				}
			}
			content = "sent by the username containing the characters `" + optionValue + "`"
		default:
			ephemeralRespond(s, i, "Something went wrong.")
			return
		}

		err = s.ChannelMessagesBulkDelete(channelID, messageIDs)

		if err != nil {
			fmt.Println("Error ChannelMessagesBulkDelete", err.Error())
			ephemeralRespond(s, i, "Something went wrong while deleting messages.")
			return
		}

		ephemeralRespond(s, i, "Messages "+content+" were deleted.")
	}
}
