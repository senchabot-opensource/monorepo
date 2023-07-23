package streamer

import (
	"context"
	"log"

	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/db"
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
