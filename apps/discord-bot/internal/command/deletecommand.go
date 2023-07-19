package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/helpers"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/service/streamer"
)

func (c *commands) DeleteCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	case "stream-default-notif-channel":
		_, err := db.DeleteDiscordBotConfig(ctx, i.GuildID, "stream_default_anno_channel")
		if err != nil {
			log.Printf("Error while deleting Discord bot config: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		ephemeralRespond(s, i, "Varsayılan Twitch canlı yayın duyuru kanalı ayarı kaldırıldı.")

	case "stream-announcement-content":
		_, err := db.SetDiscordBotConfig(ctx, i.GuildID, "stream_anno_content", "")
		if err != nil {
			log.Printf("Error while setting Discord bot config: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		ephemeralRespond(s, i, "Yayın duyuru mesajı içeriği varsayılan olarak ayarlandı: `{stream.user}, {stream.category} yayınına başladı! {stream.url}`")

	case "streamer":
		options = options[0].Options
		twitchUsername := options[0].StringValue()
		twitchUsername = helpers.ParseTwitchUsernameURLParam(twitchUsername)

		response0, uInfo := GetTwitchUserInfo(twitchUsername)
		if response0 != "" {
			ephemeralRespond(s, i, response0)
			return
		}

		ok, err := db.DeleteDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
		if err != nil {
			ephemeralRespond(s, i, errorMessage+"#XXXX")
			return
		}

		if !ok {
			ephemeralRespond(s, i, "`"+twitchUsername+"` kullanıcı adlı Twitch yayıncısı veritabanında bulunamadı.")
			return
		}

		streamers := streamer.GetStreamersData(i.GuildID)
		delete(streamers, uInfo.Login)
		ephemeralRespond(s, i, "`"+uInfo.Login+"` kullanıcı adlı Twitch streamer veritabanından silindi.")

	case "stream-event-channel":
		options = options[0].Options
		channelId := options[0].ChannelValue(s).ID
		channelName := options[0].ChannelValue(s).Name

		ok, err := db.DeleteAnnouncementChannel(ctx, channelId)
		if err != nil {
			ephemeralRespond(s, i, errorMessage+"#XXYX")
			log.Println("Error while deleting announcement channel:", err)
			return
		}
		if !ok {
			ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı yayın etkinlik yazı kanalları listesinde bulunamadı.")
			return
		}
		ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı yayın etkinlik yazı kanalları listesinden kaldırıldı.")
	}
}
