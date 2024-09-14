package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
)

func (c *commands) DelTwitchCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	// del-twitch streamer
	case "streamer":
		options = options[0].Options
		twitchUsername := options[0].StringValue()
		twitchUsername = helper.ParseTwitchUsernameURLParam(twitchUsername)

		response0, uInfo := streamer.GetTwitchUserInfo(twitchUsername)
		if response0 != "" {
			ephemeralRespond(s, i, response0)
			return
		}

		ok, err := service.DeleteDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
		if err != nil {
			ephemeralRespond(s, i, config.ErrorMessage+"#XXXX")
			return
		}

		if !ok {
			// * TR
			// ephemeralRespond(s, i, "`"+twitchUsername+"` kullanıcı adlı Twitch yayıncısı veritabanında bulunamadı.")
			ephemeralRespond(s, i, "Twitch streamer with username `"+twitchUsername+"` is not found in our database.")
			return
		}

		streamers := streamer.GetStreamersData(i.GuildID)
		delete(streamers, uInfo.Login)
		ok = streamer.DeleteStreamerFromData(i.GuildID, uInfo.Login)
		if !ok {
			ephemeralRespond(s, i, "There was a problem when deleting Twitch streamer `"+uInfo.Login+"`")
			return
		}
		// TR
		// ephemeralRespond(s, i, "`"+uInfo.Login+"` kullanıcı adlı Twitch streamer veritabanından silindi.")
		ephemeralRespond(s, i, "Twitch streamer with username `"+uInfo.Login+"` deleted from the database.")

		// del-twitch event-channel
	case "event-channel":
		options = options[0].Options
		channelId := options[0].ChannelValue(s).ID
		channelName := options[0].ChannelValue(s).Name

		ok, err := service.DeleteAnnouncementChannel(ctx, channelId)
		if err != nil {
			ephemeralRespond(s, i, config.ErrorMessage+"#XXYX")
			log.Println("[command.DelTwitchCommand.event-channel] DeleteAnnouncementChannel error:", err.Error())
			return
		}
		if !ok {
			// TR
			// ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı yayın etkinlik yazı kanalları listesinde bulunamadı.")
			ephemeralRespond(s, i, "The text channel named `"+channelName+"` was not found in the list of event text channels.")
			return
		}
		// TR
		// ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı yayın etkinlik yazı kanalları listesinden kaldırıldı.")
		ephemeralRespond(s, i, "The text channel named `"+channelName+"` removed from the list of event text channels.")

		// del-twitch announcement
	case "announcement":
		options = options[0].Options
		switch options[0].Name {
		// del-twitch announcement default-channel
		case "default-channel":
			liveAnnosLength, err := service.GetCountDiscordTwitchLiveAnnosWithoutChannel(ctx, i.GuildID)
			if err != nil {
				log.Println("[command.DelTwitchCommand.announcement.default-channel] GetCountDiscordTwitchLiveAnnosWithoutChannel error:", err.Error())
				ephemeralRespond(s, i, config.ErrorMessage+"del-twitch:announcement:default-channel#0001")
				return
			}

			if liveAnnosLength > 0 {
				ephemeralRespond(s, i, "You cannot delete the default Twitch live stream announcement channel setting because there are streamers in the database who do not have a custom stream announcement channel set.")
				// TR
				// Veritabanında özel yayın duyuru kanalı ayarlanmamış yayıncılar bulunduğu için varsayılan Twitch canlı yayın duyuru kanalı ayarını silemezsiniz.
				return
			}

			ok, err := service.DeleteDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_channel")
			if err != nil {
				log.Println("[command.DelTwitchCommand.announcement.default-channel] DeleteDiscordBotConfig error:", err.Error())
				ephemeralRespond(s, i, config.ErrorMessage+"del-twitch:announcement:default-channel#0011")
				return
			}

			if !ok {
				ephemeralRespond(s, i, config.ErrorMessage+"#0002")
				return
			}
			// TR
			// ephemeralRespond(s, i, "Varsayılan Twitch canlı yayın duyuru kanalı ayarı kaldırıldı.")
			ephemeralRespond(s, i, "The default Twitch live stream announcement channel setting removed.")

			// del-twitch announcement default-content
		case "default-content":
			_, err := service.DeleteDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_content")
			if err != nil {
				log.Println("[command.DelTwitchCommand.announcement.default-content] DeleteDiscordBotConfig error:", err.Error())
				// TODO: edit response message
				ephemeralRespond(s, i, config.ErrorMessage+"#0001")
				return
			}

			// TR
			// ephemeralRespond(s, i, "Tarafınızdan ayarlanan varsayılan yayın duyuru mesajı içeriği kaldırıldı. Ve varsayılan yayın duyuru mesajı Senchabot varsayılanlarına sıfırlandı: `{twitch.username}, {stream.category} yayınına başladı! {twitch.url}`")
			ephemeralRespond(s, i, "Removed the default stream announcement message content set by you. And message content has been reset to Senchabot defaults: `{twitch.username} has started streaming {stream.category}! {twitch.url}`")

			// del-twitch announcement custom-content
		case "custom-content":
			options = options[0].Options
			twitchUsername := options[0].StringValue()
			twitchUsername = helper.ParseTwitchUsernameURLParam(twitchUsername)

			response0, uInfo := streamer.GetTwitchUserInfo(twitchUsername)
			if response0 != "" {
				ephemeralRespond(s, i, response0)
				return
			}

			ok, err := service.UpdateTwitchStreamerAnnoContent(ctx, uInfo.ID, i.GuildID, nil)
			if err != nil {
				log.Println("[command.DelTwitchCommand.announcement.custom-content] UpdateTwitchStreamerAnnoContent error:", err.Error())
				ephemeralRespond(s, i, config.ErrorMessage+"del-twitch:custom-content#0001")
				return
			}

			if !ok {
				// TODO: edit response message
				ephemeralRespond(s, i, config.ErrorMessage+"del-twitch:custom-content#0002")
				return
			}

			//TR
			// ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısının özel yayın duyuru mesajı silindi.")
			ephemeralRespond(s, i, "Twitch streamer `"+twitchUsername+"` 's custom stream announcement message content has been deleted.")

			// del-twitch announcement category-filter
		case "category-filter":
			options = options[0].Options
			channelId := options[0].ChannelValue(s).ID
			channelName := options[0].ChannelValue(s).Name

			ok, err := service.DeleteDiscordChannelTwitchCategoryFilter(ctx, i.GuildID, channelId)
			if err != nil {
				ephemeralRespond(s, i, config.ErrorMessage+"#XXYX")
				log.Println("[command.DelTwitchCommand.announcement.category-filter] DeleteDiscordChannelTwitchCategoryFilter error:", err.Error())
				return
			}
			if !ok {
				// TR
				// ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı için  Twitch yayın duyuru kategori filtrelemesi bulunamadı.")
				ephemeralRespond(s, i, "For the text channel named `"+channelName+"`, Twitch stream announcement category filtering was not found.")
				return
			}
			// TR
			// ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı için Twitch yayın duyuru kategori filtrelemesi kaldırıldı.")
			ephemeralRespond(s, i, "For the text channel named `"+channelName+"`, Twitch stream announcement category filtering removed.")
		}
	}
}

func DelTwitchCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "del-twitch",
		Description: "Delete configuration setting.",
		DescriptionLocalizations: &map[discordgo.Locale]string{
			discordgo.Turkish: "Yapılandırma ayarlarını kaldır.",
		},
		DefaultMemberPermissions: &setdeletePermissions,
		Options: []*discordgo.ApplicationCommandOption{
			// del-twitch streamer
			{
				Name:        "streamer",
				Description: "Delete streamer from live stream announcements.",
				DescriptionLocalizations: map[discordgo.Locale]string{
					// TODO: edit
					discordgo.Turkish: "Yayın duyuru mesajı atılan yayıncıyı sil.",
				},
				Type: discordgo.ApplicationCommandOptionSubCommand,
				Options: []*discordgo.ApplicationCommandOption{
					{
						Type:        discordgo.ApplicationCommandOptionString,
						Name:        "twitch-username-or-url",
						Description: "Type Twitch profile url or username.",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "Twitch kullanıcı profil linkini veya kullanıcı adını yazınız.",
						},
						Required: true,
					},
				},
			},
			// del-twitch announcement
			{
				Name:        "announcement",
				Description: "Annoucement group",
				Options: []*discordgo.ApplicationCommandOption{
					// del-twitch announcement default-channel
					{
						Name:        "default-channel",
						Description: "Delete the default channel configuration for live stream announcements.",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "Yayın duyuru mesajlarının atılacağı varsayılan kanal ayarını kaldır.",
						},
						Type: discordgo.ApplicationCommandOptionSubCommand,
					},
					// del-twitch announcement default-content
					{
						Name:        "default-content",
						Description: "Delete the default announcement message content configuration.",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "Varsayılan yayın duyuru mesajını sil.",
						},
						Type: discordgo.ApplicationCommandOptionSubCommand,
					},
					// del-twitch announcement custom-content
					{
						Name:        "custom-content",
						Description: "Delete the streamer custom live stream announcement message content.",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "Yayıncıya özel yayın duyuru mesajını sil.",
						},
						Type: discordgo.ApplicationCommandOptionSubCommand,
						Options: []*discordgo.ApplicationCommandOption{
							{
								Type:        discordgo.ApplicationCommandOptionString,
								Name:        "twitch-username-or-url",
								Description: "Type Twitch profile url or username.",
								DescriptionLocalizations: map[discordgo.Locale]string{
									discordgo.Turkish: "Twitch kullanıcı profil linkini veya kullanıcı adını yazınız.",
								},
								Required: true,
							},
						},
					},
					// del-twitch announcement category-filter
					{
						Name:        "category-filter",
						Description: "Delete the Discord channel-specific Twitch stream category filtering for announcements.",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "Twitch duyuruları için Discord kanalına özel Twitch yayın kategorisi filtrelemesini sil.",
						},
						Type: discordgo.ApplicationCommandOptionSubCommand,
						Options: []*discordgo.ApplicationCommandOption{
							{
								Type:        discordgo.ApplicationCommandOptionChannel,
								Name:        "channel",
								Description: "Text channel",
								DescriptionLocalizations: map[discordgo.Locale]string{
									discordgo.Turkish: "Yazı kanalı",
								},
								ChannelTypes: []discordgo.ChannelType{
									discordgo.ChannelTypeGuildNews,
									discordgo.ChannelTypeGuildText,
								},
								Required: true,
							},
						},
					},
				},
				Type: discordgo.ApplicationCommandOptionSubCommandGroup,
			},
			// del-twitch event-channel
			{
				Name:        "event-channel",
				Description: "Delete the live stream announcements channel setting to create Discord events for live streams.",
				DescriptionLocalizations: map[discordgo.Locale]string{
					discordgo.Turkish: "Canlı yayın Discord etkinliklerinin oluşturulduğu duyuru kanalını sil.",
				},
				Type: discordgo.ApplicationCommandOptionSubCommand,
				Options: []*discordgo.ApplicationCommandOption{
					{
						Type:        discordgo.ApplicationCommandOptionChannel,
						Name:        "channel",
						Description: "Type the text channel where Twitch live stream announcements will be unfollowed",
						DescriptionLocalizations: map[discordgo.Locale]string{
							discordgo.Turkish: "Twitch yayın duyurularının takipten çıkarılacağı yazı kanalını yazınız.",
						},
						ChannelTypes: []discordgo.ChannelType{
							discordgo.ChannelTypeGuildNews,
							discordgo.ChannelTypeGuildText,
						},
						Required: true,
					},
				},
			},
		},
	}
}
