package command

import (
	"context"
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/helpers"
)

func (c *commands) SetCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	case "stream-anno-default-channel":
		options = options[0].Options
		channelId := options[0].ChannelValue(s).ID
		channelName := options[0].ChannelValue(s).Name

		_, err := db.SetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_channel", channelId)
		if err != nil {
			log.Printf("Error while setting Discord bot config: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		ephemeralRespond(s, i, "`"+channelName+"` isimli kanal varsayılan duyuru kanalı olarak ayarlandı.")

	case "stream-anno-default-content":
		options = options[0].Options
		annoText := options[0].StringValue()

		_, err := db.SetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_content", annoText)
		if err != nil {
			log.Printf("Error while setting Discord bot config: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		ephemeralRespond(s, i, "Yayın duyuru mesajı içeriği ayarlandı: `"+annoText+"`")

	case "stream-event-channel":
		options = options[0].Options
		channelId := options[0].ChannelValue(s).ID
		channelName := options[0].ChannelValue(s).Name

		ok, err := db.AddAnnouncementChannel(ctx, channelId, i.GuildID, i.Member.User.Username)
		if err != nil {
			log.Println(err)
			ephemeralRespond(s, i, errorMessage+"#0002")
			return
		}
		if !ok {
			ephemeralRespond(s, i, fmt.Sprintf("`%v` isimli kanal Twitch yayın duyurusu etkinlikleri için daha önce eklenmiş.", channelName))
			return
		}

		ephemeralRespond(s, i, fmt.Sprintf("`%v` isimli kanal Twitch yayın duyurusu etkinlikleri için listeye eklendi.", channelName))
	case "stream-anno-custom-content":
		options = options[0].Options
		twitchUsername := options[0].StringValue()
		twitchUsername = helpers.ParseTwitchUsernameURLParam(twitchUsername)
		annoContent := options[1].StringValue()

		ok, err := db.UpdateTwitchStreamerAnnoContent(ctx, twitchUsername, i.GuildID, &annoContent)
		if err != nil {
			log.Printf("Error while setting Discord bot config: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		if !ok {
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		if annoContent == "" {
			cfg, err := db.GetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_content")
			if err != nil {
				log.Printf("There was an error while getting Discord bot config in CheckLiveStreams: %v", err)
			}

			if cfg != nil {
				ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısı için özelleştirilmiş duyuru mesajı içeriği kaldırıldı. `/set stream-announcement-content komutuyla ayarladığız mesaj içeriği kullanılacak: `"+cfg.Value+"`")
				return
			}

			ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısı için özelleştirilmiş duyuru mesajı içeriği kaldırıldı. Varsayılan duyuru mesajı içeriği kullanılacak: `{stream.user}, {stream.category} yayınına başladı! {stream.url}`.")
			return
		}

		ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısı için duyuru mesajı içeriği ayarlandı: `"+annoContent+"`")

	case "streamer":
		options = options[0].Options
		twitchUsername := options[0].StringValue()
		commandUsername := i.Member.User.Username
		twitchUsername = helpers.ParseTwitchUsernameURLParam(twitchUsername)

		response0, uInfo := GetTwitchUserInfo(twitchUsername)
		if response0 != "" {
			ephemeralRespond(s, i, response0)
			return
		}

		response1, ok := CheckIfTwitchStreamerExist(ctx, twitchUsername, uInfo, s, i, db)
		if IsChannelNameNotGiven(len(options)) && ok {
			ephemeralRespond(s, i, response1)
			return
		}

		if IsChannelNameNotGiven(len(options)) {
			channelData, err := db.GetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_channel")
			if err != nil {
				log.Printf("Error while getting Discord bot config: %v", err)
				ephemeralRespond(s, i, errorMessage+"#0000")
				return
			}
			if channelData == nil {
				ephemeralRespond(s, i, "Twitch yayıncısı eklerken daha önce `/set stream-default-anno-channel channel-name` komutuyla varsayılan duyuru kanalı eklemiş olmalı veya isteğe bağlı kanal adını belirtmelisiniz.")
				return
			}

			ch, err := s.Channel(channelData.Value)
			if err != nil {
				ephemeralRespond(s, i, errorMessage+"#XXXY")
				return
			}

			resp := SetTwitchStreamer(ctx, uInfo, channelData.Value, ch.Name, i.GuildID, commandUsername, db)
			ephemeralRespond(s, i, resp)
			return
		}

		channelId := options[1].ChannelValue(s).ID
		channelName := options[1].ChannelValue(s).Name

		streamerData, err := db.GetDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
		if err != nil {
			fmt.Println("streamerData, err:", err)
			return
		}

		if streamerData != nil && channelId == streamerData.AnnoChannelID {
			ephemeralRespond(s, i, fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı `%v` kanalına canlı yayın duyuruları daha önce için eklenmiş.", twitchUsername, channelName))
			return
		}

		resp := SetTwitchStreamer(ctx, uInfo, channelId, channelName, i.GuildID, commandUsername, db)
		ephemeralRespond(s, i, resp)
	}
}
