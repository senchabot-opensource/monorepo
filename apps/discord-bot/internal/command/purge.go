package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
)

const FOURTEEN_DAYS = 24 * 14

func (c *commands) PurgeCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	case "events":
		events, err := s.GuildScheduledEvents(i.GuildID, false)
		if err != nil {
			log.Println("[command.PurgeCommand.events] GuildScheduledEvents error:", err.Error())
			// TODO: edit respond or create errorMessage sheet
			ephemeralRespond(s, i, config.ErrorMessage+"#1011")
		}

		for _, e := range events {
			s.GuildScheduledEventDelete(i.GuildID, e.ID)
		}
		// TR
		// ephemeralRespond(s, i, "Tüm planlanmış etkinlikler silindi.")
		// TODO: translate to English
		ephemeralRespond(s, i, "Tüm planlanmış etkinlikler silindi.")

	case "last-100-channel-messages":
		options = options[0].Options
		content := ""

		if options == nil || len(options) < 1 {
			ephemeralRespond(s, i, "One of the `message-content-contains` or `user-name-contains` options must be filled.")
			return
		}

// TODO: "Something went wrong" → // TODO: edit respond + add error code or create errorMessage sheet

		optionValue := options[0].StringValue()
		channelID := i.ChannelID
		var messageIDs []string

		messages, err := s.ChannelMessages(channelID, 100, "", "", "")
		if err != nil {
			log.Println("[command.PurgeCommand.last-100-channel-messages] ChannelMessages error:", err.Error())
			ephemeralRespond(s, i, "Something went wrong while fetching messages.")
			return
		}

		switch options[0].Name {
		case "message-content":
			for _, m := range messages {
				if helper.CheckTimeOlderThan(m.Timestamp, FOURTEEN_DAYS) && helper.ContainsLowerCase(m.Content, optionValue) {
					messageIDs = append(messageIDs, m.ID)
				}
			}
			content = "containing the characters `" + optionValue + "`"
		case "username":
			for _, m := range messages {
				if helper.CheckTimeOlderThan(m.Timestamp, FOURTEEN_DAYS) && helper.ContainsLowerCase(m.Author.Username, optionValue) {
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
			log.Println("[command.PurgeCommand.last-100-channel-messages] ChannelMessagesBulkDelete error:", err.Error())
			ephemeralRespond(s, i, "Something went wrong while deleting messages.")
			return
		}

		ephemeralRespond(s, i, "Messages "+content+" were deleted.")
	}
}

func PurgeCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "purge",
		Description: "Purge commands",
		DescriptionLocalizations: &map[discordgo.Locale]string{
			discordgo.Turkish: "Temizleme komutları",
		},
		DefaultMemberPermissions: &purgePermissions,
		Options: []*discordgo.ApplicationCommandOption{
			// purge events
			{
				Name:        "events",
				Description: "Cancel all scheduled events.",
				DescriptionLocalizations: map[discordgo.Locale]string{
					discordgo.Turkish: "Tüm zamanlanmış etkinlikleri iptal et.",
				},
				Type: discordgo.ApplicationCommandOptionSubCommand,
			},
			// purge last-100-channel-messages
			{
				Name:        "last-100-channel-messages",
				Description: "Purge messages not older than 14 days containing certain characters or sent by certain username.",
				DescriptionLocalizations: map[discordgo.Locale]string{
					discordgo.Turkish: "14 günden eski olmayan mesajları kullanıcı adı veya mesaj iceriğindeki karakterlere göre siler.",
				},
				Type: discordgo.ApplicationCommandOptionSubCommand,
				Options: []*discordgo.ApplicationCommandOption{
					{
						Name:        "message-content",
						Description: "certain characters that contain in messages",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "silinecek mesajların içerdiği karakterler",
						},
						Type: discordgo.ApplicationCommandOptionString,
					},
					{
						Name:        "username",
						Description: "certain characters that contain in user's name or nickname",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "kullanıcı adı veya takma adının içerdiği karakterler",
						},
						Type: discordgo.ApplicationCommandOptionString,
					},
				},
			},
		},
	}

}
