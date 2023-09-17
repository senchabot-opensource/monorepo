package command

import (
	"context"
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func (c *commands) SetTwitchCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	case "streamer":
		options = options[0].Options
		twitchUsername := options[0].StringValue()

		commandUsername := i.Member.User.Username
		twitchUsername = gosenchabot.ParseTwitchUsernameURLParam(twitchUsername)

		response0, uInfo := streamer.GetTwitchUserInfo(twitchUsername, c.twitchAccessToken)
		if response0 != "" {
			ephemeralRespond(s, i, response0)
			return
		}

		response1, ok := streamer.CheckIfTwitchStreamerExist(ctx, twitchUsername, uInfo, s, i, service)
		if helpers.IsChannelNameNotGiven(len(options)) && ok {
			ephemeralRespond(s, i, response1)
			return
		}

		if helpers.IsChannelNameNotGiven(len(options)) {
			channelData, err := service.GetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_channel")
			if err != nil {
				log.Printf("Error while getting Discord bot config: %v", err)
				ephemeralRespond(s, i, config.ErrorMessage+"#0000")
				return
			}
			if channelData == nil {
				ephemeralRespond(s, i, "Twitch yayıncısı eklerken daha önce `/set-twitch announcement default-channel` komutuyla varsayılan duyuru kanalı eklemiş olmalı veya isteğe bağlı kanal adını belirtmelisiniz.")
				return
			}

			ch, err := s.Channel(channelData.Value)
			if err != nil {
				ephemeralRespond(s, i, config.ErrorMessage+"#XXXY")
				return
			}

			resp := streamer.SetTwitchStreamer(ctx, uInfo, channelData.Value, ch.Name, i.GuildID, commandUsername, service)
			ephemeralRespond(s, i, resp)
			return
		}

		channelId := options[1].ChannelValue(s).ID
		channelName := options[1].ChannelValue(s).Name

		streamerData, err := service.GetDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
		if err != nil {
			fmt.Println("streamerData, err:", err)
			return
		}

		if streamerData != nil && channelId == streamerData.AnnoChannelID {
			ephemeralRespond(s, i, fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı `%v` kanalına canlı yayın duyuruları için daha önce eklenmiş.", twitchUsername, channelName))
			return
		}

		resp := streamer.SetTwitchStreamer(ctx, uInfo, channelId, channelName, i.GuildID, commandUsername, service)
		ephemeralRespond(s, i, resp)

	case "event-channel":
		options = options[0].Options
		channelId := options[0].ChannelValue(s).ID
		channelName := options[0].ChannelValue(s).Name

		ok, err := service.AddAnnouncementChannel(ctx, channelId, i.GuildID, i.Member.User.Username)
		if err != nil {
			log.Println(err)
			ephemeralRespond(s, i, config.ErrorMessage+"#0002")
			return
		}
		if !ok {
			ephemeralRespond(s, i, fmt.Sprintf("`%v` isimli kanal Twitch yayın duyurusu etkinlikleri için daha önce eklenmiş.", channelName))
			return
		}

		ephemeralRespond(s, i, fmt.Sprintf("`%v` isimli kanal Twitch yayın duyurusu etkinlikleri için listeye eklendi.", channelName))

	case "announcement":
		options = options[0].Options
		switch options[0].Name {
		case "default-channel":
			options = options[0].Options
			channelId := options[0].ChannelValue(s).ID
			channelName := options[0].ChannelValue(s).Name

			_, err := service.SetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_channel", channelId)
			if err != nil {
				log.Printf("Error while setting Discord bot config: %v", err)
				ephemeralRespond(s, i, config.ErrorMessage+"#0001")
				return
			}

			ephemeralRespond(s, i, "`"+channelName+"` isimli kanal varsayılan duyuru kanalı olarak ayarlandı.")

		case "default-content":
			options = options[0].Options
			annoText := options[0].StringValue()

			_, err := service.SetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_content", annoText)
			if err != nil {
				log.Printf("Error while setting Discord bot config: %v", err)
				ephemeralRespond(s, i, config.ErrorMessage+"#0001")
				return
			}

			ephemeralRespond(s, i, "Yayın duyuru mesajı içeriği ayarlandı: `"+annoText+"`")

		case "custom-content":
			options = options[0].Options
			twitchUsername := options[0].StringValue()
			twitchUsername = gosenchabot.ParseTwitchUsernameURLParam(twitchUsername)
			annoContent := options[1].StringValue()

			response0, uInfo := streamer.GetTwitchUserInfo(twitchUsername, c.twitchAccessToken)
			if response0 != "" {
				ephemeralRespond(s, i, response0)
				return
			}

			ok, err := service.UpdateTwitchStreamerAnnoContent(ctx, uInfo.ID, i.GuildID, &annoContent)
			if err != nil {
				log.Printf("Error while setting Discord bot config: %v", err)
				ephemeralRespond(s, i, config.ErrorMessage+"#001TEKNOBARBISI")
				return
			}

			if !ok {
				ephemeralRespond(s, i, "`"+twitchUsername+"` kullanıcı adlı Twitch yayıncısı veritabanında bulunamadı.")
				return
			}

			if annoContent == "" {
				cfg, err := service.GetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_content")
				if err != nil {
					log.Printf("There was an error while getting Discord bot config in CheckLiveStreams: %v", err)
				}

				if cfg != nil {
					ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısı için özelleştirilmiş duyuru mesajı içeriği kaldırıldı. `/set-twitch announcement default-content komutuyla ayarladığız mesaj içeriği kullanılacak: `"+cfg.Value+"`")
					return
				}

				ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısı için özelleştirilmiş duyuru mesajı içeriği kaldırıldı. Varsayılan duyuru mesajı içeriği kullanılacak: `{stream.user}, {stream.category} yayınına başladı! {stream.url}`.")
				return
			}

			ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısı için duyuru mesajı içeriği ayarlandı: `"+annoContent+"`")

		}
	}
}
