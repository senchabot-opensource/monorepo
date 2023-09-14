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

func (c *commands) SetStreamerCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

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
			ephemeralRespond(s, i, "Twitch yayıncısı eklerken daha önce `/set stream-default-anno-channel channel-name` komutuyla varsayılan duyuru kanalı eklemiş olmalı veya isteğe bağlı kanal adını belirtmelisiniz.")
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
		ephemeralRespond(s, i, fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı `%v` kanalına canlı yayın duyuruları daha önce için eklenmiş.", twitchUsername, channelName))
		return
	}

	resp := streamer.SetTwitchStreamer(ctx, uInfo, channelId, channelName, i.GuildID, commandUsername, service)
	ephemeralRespond(s, i, resp)
}
