package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/helpers"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
)

func (c *commands) DeleteCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	case "stream-anno-default-channel":
		_, err := db.DeleteDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_channel")
		if err != nil {
			log.Printf("Error while deleting Discord bot config: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		ephemeralRespond(s, i, "Varsayılan Twitch canlı yayın duyuru kanalı ayarı kaldırıldı.")

	case "stream-anno-default-content":
		_, err := db.SetDiscordBotConfig(ctx, i.GuildID, "stream_anno_default_content", "")
		if err != nil {
			log.Printf("Error while setting Discord bot config: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		ephemeralRespond(s, i, "Yayın duyuru mesajı içeriği varsayılan olarak ayarlandı: `{stream.user}, {stream.category} yayınına başladı! {stream.url}`")
	case "stream-anno-custom-content":
		options = options[0].Options
		twitchUsername := options[0].StringValue()
		twitchUsername = helpers.ParseTwitchUsernameURLParam(twitchUsername)

		ok, err := db.UpdateTwitchStreamerAnnoContent(ctx, twitchUsername, i.GuildID, nil)
		if err != nil {
			log.Printf("Error while deleting streamer announcement custom content: %v", err)
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		if !ok {
			ephemeralRespond(s, i, errorMessage+"#0001")
			return
		}

		ephemeralRespond(s, i, twitchUsername+" kullanıcı adlı Twitch yayıncısına özgü yayın duyuru mesajı silindi.")

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
