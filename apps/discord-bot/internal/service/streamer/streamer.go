package streamer

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/helpers"
)

type GuildStreamers struct {
	StreamUser string
	ChannelID  string
	ServerID   string
}

var streamers map[string]map[string]GuildStreamers = make(map[string]map[string]GuildStreamers)

func InitStreamersData(ctx context.Context, db *db.MySQL, guildId string) {
	liveAnnos, err := db.GetDiscordTwitchLiveAnnos(ctx, guildId)
	if err != nil {
		log.Printf("CheckLiveStreams db.GetDiscordTwitchLiveAnnos Error: %v", err)
	}
	for _, dtla := range liveAnnos {
		serverStreamers, ok := streamers[dtla.AnnoServerID]
		if !ok {
			serverStreamers = make(map[string]GuildStreamers)
			streamers[dtla.AnnoServerID] = serverStreamers
		}
		serverStreamers[dtla.TwitchUsername] = GuildStreamers{
			StreamUser: dtla.TwitchUsername,
			ChannelID:  dtla.AnnoChannelID,
			ServerID:   dtla.AnnoServerID,
		}
	}
}

func SetStreamerData(serverId, username, channelId string) {
	serverStreamers, ok := streamers[serverId]
	if !ok {
		serverStreamers = make(map[string]GuildStreamers)
		streamers[serverId] = serverStreamers
	}
	serverStreamers[username] = GuildStreamers{
		StreamUser: username,
		ChannelID:  channelId,
		ServerID:   serverId,
	}
}

func GetStreamersData(serverId string) map[string]GuildStreamers {
	serverStreamers, ok := streamers[serverId]
	if !ok {
		return nil
	}
	return serverStreamers
}

func DeleteStreamerFromData(serverId, username string) bool {
	serverStreamers, ok := streamers[serverId]
	if !ok {
		return false
	}
	delete(serverStreamers, username)
	return true
}

func DeleteServerFromData(serverId string) bool {
	_, ok := streamers[serverId]
	if !ok {
		return false
	}

	delete(streamers, serverId)
	return true
}

func GetStreamAnnoContent(ctx context.Context, db *db.MySQL, guildId, streamerUsername string) string {
	annoContent := "{twitch.username}, {stream.category} yayınına başladı! {twitch.url}"

	streamerAnnoContent, err := db.GetTwitchStreamerAnnoContent(ctx, streamerUsername, guildId)
	if err != nil {
		log.Printf("There was an error while getting Twitch streamer announcement content in CheckLiveStreams: %v", err)
	}

	if streamerAnnoContent != nil {
		annoContent = *streamerAnnoContent
	}

	cfg, err := db.GetDiscordBotConfig(ctx, guildId, "stream_anno_default_content")
	if err != nil {
		log.Printf("There was an error while getting Discord bot config in CheckLiveStreams: %v", err)
	}

	if cfg != nil && streamerAnnoContent == nil {
		if cfg.Value != "" {
			annoContent = cfg.Value
		}
	}

	return annoContent
}

func CheckDatesAnnounceable(ctx context.Context, db *db.MySQL, guildId, streamerUsername, startedAt string) bool {
	date, err := db.GetTwitchStreamerLastAnnoDate(ctx, streamerUsername, guildId)
	if err != nil {
		log.Printf("There was an error while checking Twitch streamer last anno date: %v", err)
		return false
	}
	if date != nil {
		tt, err := time.Parse(time.RFC3339, startedAt)
		if err != nil {
			fmt.Println("TIME PARSE ERROR", err)
			return false
		}
		if int(time.Until(tt).Abs().Minutes()) >= int(time.Until(*date).Abs().Minutes()) || int(time.Until(*date).Abs().Minutes()) <= 5 || time.Now().Before(tt) {
			return false
		}
	}

	return true
}

var streamersMutex sync.Mutex

func getStreamersAndLiveData(ctx context.Context, db *db.MySQL, guildId string) ([]client.StreamerData, map[string]GuildStreamers) {
	streamers := GetStreamersData(guildId)

	keys := make([]string, 0, len(streamers))
	for k := range streamers {
		keys = append(keys, k)
	}

	if len(keys) == 0 {
		return nil, nil
	}

	liveStreams := client.CheckMultipleTwitchStreamer(keys)

	return liveStreams, streamers
}

func handleAnnouncement(ctx context.Context, s *discordgo.Session, db *db.MySQL, guildId string, streamers map[string]GuildStreamers, sd client.StreamerData) {
	streamersMutex.Lock()
	defer streamersMutex.Unlock()

	gs, ok := streamers[sd.UserLogin]
	announceable := CheckDatesAnnounceable(ctx, db, guildId, sd.UserLogin, sd.StartedAt)
	if !ok || !announceable {
		return
	}

	annoContent := GetStreamAnnoContent(ctx, db, guildId, sd.UserLogin)
	formattedString := helpers.FormatContent(annoContent, sd)
	s.ChannelMessageSend(gs.ChannelID, formattedString)

	_, err := db.UpdateTwitchStreamerLastAnnoDate(ctx, sd.UserLogin, guildId, time.Now().UTC())
	if err != nil {
		log.Printf("There was an error while getting updating Twitch streamer last anno date in CheckLiveStreams: %v", err)
	}
}

var liveStreamChannels = make(map[string]chan struct{})

func StartCheckLiveStreams(s *discordgo.Session, ctx context.Context, db *db.MySQL, guildId string) {
	if _, ok := liveStreamChannels[guildId]; ok {
		return
	}

	stop := make(chan struct{})
	liveStreamChannels[guildId] = stop

	go CheckLiveStreams(s, ctx, db, guildId, stop)
}

func StopCheckLiveStreams(guildId string) {
	if channel, ok := liveStreamChannels[guildId]; ok {
		close(channel)
		delete(liveStreamChannels, guildId)
	}
}

func CheckLiveStreams(s *discordgo.Session, ctx context.Context, db *db.MySQL, guildId string, stop <-chan struct{}) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	InitStreamersData(ctx, db, guildId)

	for {
		select {
		case <-ticker.C:
			streamersMutex.Lock()
			liveStreams, streamers := getStreamersAndLiveData(ctx, db, guildId)
			streamersMutex.Unlock()

			for _, sd := range liveStreams {
				if sd.Type == "live" {
					handleAnnouncement(ctx, s, db, guildId, streamers, sd)
				}
			}
		case <-stop:
			return
		}
	}
}
