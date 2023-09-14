package command

import (
	"context"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func (c *commands) DelStreamerCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	twitchUsername := options[0].StringValue()
	twitchUsername = gosenchabot.ParseTwitchUsernameURLParam(twitchUsername)

	response0, uInfo := streamer.GetTwitchUserInfo(twitchUsername, c.twitchAccessToken)
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
		ephemeralRespond(s, i, "`"+twitchUsername+"` kullanıcı adlı Twitch yayıncısı veritabanında bulunamadı.")
		return
	}

	streamers := streamer.GetStreamersData(i.GuildID)
	delete(streamers, uInfo.Login)
	ephemeralRespond(s, i, "`"+uInfo.Login+"` kullanıcı adlı Twitch streamer veritabanından silindi.")
}
