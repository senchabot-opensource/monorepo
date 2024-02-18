package streamer

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	twsrvc "github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

type GuildStreamers struct {
	StreamUser       string
	DiscordChannelID string
	DiscordServerID  string
}

var streamers map[string]map[string]GuildStreamers = make(map[string]map[string]GuildStreamers)

func InitStreamersData(ctx context.Context, service service.Service, guildId string) {
	liveAnnos, err := service.GetDiscordTwitchLiveAnnos(ctx, guildId)
	if err != nil {
		log.Printf("CheckLiveStreams service.GetDiscordTwitchLiveAnnos Error: %v", err)
	}
	for _, dtla := range liveAnnos {
		serverStreamers, ok := streamers[dtla.AnnoServerID]
		if !ok {
			serverStreamers = make(map[string]GuildStreamers)
			streamers[dtla.AnnoServerID] = serverStreamers
		}
		serverStreamers[dtla.TwitchUserID] = GuildStreamers{
			StreamUser:       dtla.TwitchUsername,
			DiscordChannelID: dtla.AnnoChannelID,
			DiscordServerID:  dtla.AnnoServerID,
		}
	}
}

func SetStreamerData(serverId, twitchUserId, twitchUserName, discordChannelId string) {
	serverStreamers, ok := streamers[serverId]
	if !ok {
		serverStreamers = make(map[string]GuildStreamers)
		streamers[serverId] = serverStreamers
	}
	serverStreamers[twitchUserId] = GuildStreamers{
		StreamUser:       twitchUserName,
		DiscordChannelID: discordChannelId,
		DiscordServerID:  serverId,
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

func GetTwitchUserInfo(twitchUsername string, token string) (string, *models.TwitchUserInfo) {
	userInfo, err := twsrvc.GetTwitchUserInfo("login", twitchUsername, token)
	if err != nil {
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı Twitch'te bulunamadı.", twitchUsername), nil
	}

	return "", userInfo
}

func CheckIfTwitchStreamerExist(ctx context.Context, twitchUsername string, uInfo *models.TwitchUserInfo, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) (string, bool) {
	liveAnnoData, err := service.GetDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
	if err != nil {
		log.Printf("There was an error while checking the Discord Twitch live announcements: %v", err)
		return config.ErrorMessage + "#XYXX", false
	}
	if liveAnnoData != nil {
		channel, err := s.Channel(liveAnnoData.AnnoChannelID)
		if err != nil {
			log.Printf("Error while fetching the channel data from Discord API: %v", err)
			return config.ErrorMessage + "#YXXX", false
		}
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısının duyuları `%v` isimli yazı kanalı için ekli.", twitchUsername, channel.Name), true
	}
	return "", false
}

func SetTwitchStreamer(ctx context.Context, uInfo *models.TwitchUserInfo, channelId, channelName, guildId, creatorUsername string, service service.Service) string {
	added, err := service.AddDiscordTwitchLiveAnnos(ctx, uInfo.Login, uInfo.ID, channelId, guildId, creatorUsername)
	if err != nil {
		log.Printf("Error while adding Discord Twitch live announcement: %v", err)

		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı veritabanı hatasından dolayı eklenemedi.", uInfo.Login)
	}

	if !added && err == nil {
		SetStreamerData(guildId, uInfo.ID, uInfo.Login, channelId)
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı varitabanında bulunmakta. Ancak... Twitch yayıncısının yayın duyurularının yapılacağı kanalı `%v` yazı kanalı olarak güncellendi.", uInfo.Login, channelName)
	}

	if added {
		SetStreamerData(guildId, uInfo.ID, uInfo.Login, channelId)
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısının yayın duyuruları `%v` isimli yazı kanalı için aktif edildi.", uInfo.Login, channelName)
	}

	return "Twitch yayıncısı eklenirken bir sorun oluştu."
}

func GetStreamAnnoContent(ctx context.Context, service service.Service, guildId, streamerUserId string) string {
	annoContent := "{twitch.username}, {stream.category} yayınına başladı! {twitch.url}"

	streamerAnnoContent, err := service.GetTwitchStreamerAnnoContent(ctx, streamerUserId, guildId)
	if err != nil {
		log.Printf("There was an error while getting Twitch streamer announcement content in CheckLiveStreams: %v", err)
	}

	if streamerAnnoContent != nil {
		annoContent = *streamerAnnoContent
	}

	cfg, err := service.GetDiscordBotConfig(ctx, guildId, "stream_anno_default_content")
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

func CheckDatesAnnounceable(ctx context.Context, service service.Service, guildId, streamerUserId, startedAt string) bool {
	lastAnnoDate, err := service.GetTwitchStreamerLastAnnoDate(ctx, streamerUserId, guildId)
	if err != nil {
		log.Printf("Error getting Twitch streamer last anno date: %v", err)
		return false
	}

	if lastAnnoDate == nil {
		return true // No previous announcement, so announceable
	}

	var annoDate = *lastAnnoDate

	// Parse dates and apply location
	loc, loadLocationErr := time.LoadLocation("Europe/Amsterdam")
	if loadLocationErr != nil {
		log.Println("loadLocationErr", loadLocationErr)
		return false
	}
	startDate, err := time.ParseInLocation(time.RFC3339, startedAt, loc)
	if err != nil {
		log.Println("Error parsing startedAt time:", err)
		return false
	}
	annoDate = annoDate.In(loc)

	startDateHigherOrEqualToAnnoDate := int(time.Since(startDate.In(loc)).Abs().Minutes()) >= int(time.Since(annoDate).Abs().Minutes())
	annoDateLowerOrEqual5 := int(time.Since(annoDate).Abs().Minutes()) <= 5
	startDateBeforeNow := time.Now().In(loc).Before(startDate.In(loc))

	// Check conditions for non-announceable scenarios
	if startDateHigherOrEqualToAnnoDate || annoDateLowerOrEqual5 || startDateBeforeNow {
		return false
	}

	// Apply cooldown if configured
	cooldownDuration, err := getCooldownDuration(ctx, service, guildId)
	if err != nil {
		log.Printf("Error getting cooldown duration: %v", err)
		return false
	}
	if cooldownDuration > 0 && int(time.Since(annoDate).Abs().Minutes()) < cooldownDuration {
		return false
	}

	return true // All conditions met, announceable
}

func getCooldownDuration(ctx context.Context, service service.Service, guildId string) (int, error) {
	cfg, err := service.GetDiscordBotConfig(ctx, guildId, "stream_anno_cooldown")
	if err != nil {
		log.Printf("Error getting Discord bot config: %v", err)
		return 0, err
	}

	if cfg == nil {
		return 0, nil // No cooldown configured
	}

	cooldownDuration, err := strconv.Atoi(cfg.Value)
	if err != nil {
		log.Println("Error parsing cooldown duration:", err)
		return 0, err
	}

	return cooldownDuration, nil
}

var streamersMutex sync.Mutex

func getStreamersAndLiveData(ctx context.Context, service service.Service, guildId string) ([]models.TwitchStreamerData, map[string]GuildStreamers) {
	streamers := GetStreamersData(guildId)

	keys := make([]string, 0, len(streamers))
	for k := range streamers {
		keys = append(keys, k)
	}

	if len(keys) == 0 {
		return nil, nil
	}

	liveStreams := twsrvc.CheckMultipleTwitchStreamer(keys)

	return liveStreams, streamers
}

func handleAnnouncement(ctx context.Context, s *discordgo.Session, service service.Service, guildId string, streamers map[string]GuildStreamers, sd models.TwitchStreamerData) {
	streamersMutex.Lock()
	defer streamersMutex.Unlock()

	gs, ok := streamers[sd.UserID]
	announceable := CheckDatesAnnounceable(ctx, service, guildId, sd.UserID, sd.StartedAt)
	if !ok || !announceable {
		return
	}

	annoContent := GetStreamAnnoContent(ctx, service, guildId, sd.UserID)
	formattedString := FormatContent(annoContent, sd)
	s.ChannelMessageSend(gs.DiscordChannelID, formattedString)

	_, err := service.UpdateTwitchStreamerLastAnnoDate(ctx, sd.UserID, guildId, time.Now().UTC())
	if err != nil {
		log.Printf("There was an error while getting updating Twitch streamer last anno date in CheckLiveStreams: %v", err)
	}
}

var liveStreamChannels = make(map[string]chan struct{})

func StartCheckLiveStreams(s *discordgo.Session, ctx context.Context, service service.Service, guildId string) {
	if _, ok := liveStreamChannels[guildId]; ok {
		return
	}

	stop := make(chan struct{})
	liveStreamChannels[guildId] = stop

	go CheckLiveStreams(s, ctx, service, guildId, stop)
}

func StopCheckLiveStreams(guildId string) {
	if channel, ok := liveStreamChannels[guildId]; ok {
		close(channel)
		delete(liveStreamChannels, guildId)
	}
}

func CheckLiveStreams(s *discordgo.Session, ctx context.Context, service service.Service, guildId string, stop <-chan struct{}) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	InitStreamersData(ctx, service, guildId)

	for {
		select {
		case <-ticker.C:
			streamersMutex.Lock()
			liveStreams, streamers := getStreamersAndLiveData(ctx, service, guildId)
			streamersMutex.Unlock()

			if len(liveStreams) == 0 {
				continue
			}

			for _, sd := range liveStreams {
				liveAnnoData, err := service.GetDiscordTwitchLiveAnno(ctx, sd.UserID, guildId)
				if err != nil {
					log.Printf("There was an error while checking the Discord Twitch live announcements: %v", err)
					break
				}
				if sd.Type == "live" && liveAnnoData != nil {
					handleAnnouncement(ctx, s, service, guildId, streamers, sd)
				} else {
					continue
				}
			}
		case <-stop:
			return
		}
	}
}

func FormatContent(str string, sd models.TwitchStreamerData) string {
	if sd.GameName == "" {
		sd.GameName = "Just Chatting"
	}

	stringTemplates := map[string]string{
		"{twitch.username}": sd.UserName,
		"{twitch.url}":      "https://www.twitch.tv/" + sd.UserLogin,
		"{stream.title}":    sd.Title,
		"{stream.category}": sd.GameName,
		"{stream.game}":     sd.GameName,
	}

	for k, v := range stringTemplates {
		str = strings.ReplaceAll(str, k, v)
	}

	return str
}
