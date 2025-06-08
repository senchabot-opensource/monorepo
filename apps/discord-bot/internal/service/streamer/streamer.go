package streamer

import (
	"context"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

type GuildStreamers struct {
	StreamUser       string
	DiscordChannelID string
	DiscordServerID  string
}

var streamers map[string]map[string]GuildStreamers = make(map[string]map[string]GuildStreamers)

type StreamerService struct {
	twitchService twitchapi.TwitchService
}

func NewStreamerService(twitchService twitchapi.TwitchService) *StreamerService {
	return &StreamerService{
		twitchService: twitchService,
	}
}

func (s *StreamerService) initStreamersData(ctx context.Context, service service.Service, guildId string) {
	channelData, err := service.GetDiscordBotConfig(ctx, guildId, "stream_anno_default_channel")
	if err != nil {
		log.Println("[StreamerService.initStreamersData] Service.GetDiscordBotConfig Guild ID: "+guildId+", Config Key: stream_anno_default_channel, Error:", err.Error())
	}
	liveAnnos, err := service.GetDiscordTwitchLiveAnnos(ctx, guildId)
	if err != nil {
		log.Println("[StreamerService.initStreamersData] Service.GetDiscordTwitchLiveAnnos Guild ID: "+guildId+", Error:", err.Error())
	}
	for _, dtla := range liveAnnos {
		if dtla.AnnoChannelID == "" && channelData != nil && channelData.Value != "" {
			dtla.AnnoChannelID = channelData.Value
		}
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

func (s *StreamerService) SetStreamerData(serverId, twitchUserId, twitchUserName, discordChannelId string) {
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

func (s *StreamerService) GetStreamersData(serverId string) map[string]GuildStreamers {
	serverStreamers, ok := streamers[serverId]
	if !ok {
		return nil
	}
	return serverStreamers
}

func (s *StreamerService) DeleteStreamerFromData(serverId, username string) bool {
	serverStreamers, ok := streamers[serverId]
	if !ok {
		return false
	}
	delete(serverStreamers, username)
	return true
}

func (s *StreamerService) DeleteServerFromData(serverId string) bool {
	_, ok := streamers[serverId]
	if !ok {
		return false
	}

	delete(streamers, serverId)
	return true
}

func (s *StreamerService) CheckIfTwitchStreamerExist(ctx context.Context, twitchUsername string, uInfo *model.TwitchUserInfo, dS *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) (string, bool) {
	liveAnnoData, err := service.GetDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
	if err != nil {
		log.Println("[CheckIfTwitchStreamerExist] GetDiscordTwitchLiveAnno error:", err.Error())
		return config.ErrorMessage + "#XYXX", false
	}
	if liveAnnoData != nil {
		channel, err := dS.Channel(liveAnnoData.AnnoChannelID)
		if err != nil {
			log.Println("[CheckIfTwitchStreamerExist] s.Channel error:", err.Error(), "GuildID", i.GuildID, "ChannelID", liveAnnoData.AnnoChannelID)
			return config.ErrorMessage + "#YXXX", false
		}
		//return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısının duyuları `%v` isimli yazı kanalı için ekli.", twitchUsername, channel.Name), true
		return "Live stream announcement for Twitch streamer `" + twitchUsername + "` is already added for `" + channel.Name + "` text channel.", true
	}
	return "", false
}

func (s *StreamerService) SetTwitchStreamer(ctx context.Context, uInfo *model.TwitchUserInfo, channelId *string, channel *discordgo.Channel, guildId, creatorUsername string, service service.Service) string {
	var annoChannelId string
	if channelId == nil {
		channelData, err := service.GetDiscordBotConfig(ctx, guildId, "stream_anno_default_channel")
		if err != nil {
			log.Println("[SetTwitchStreamer] GetDiscordBotConfig error:", err.Error())

			//return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı veritabanı hatasından dolayı eklenemedi.", uInfo.Login)
			return "Twitch streamer `" + uInfo.Login + "` could not be added due to database error."
		}

		channelId = &channelData.Value
		annoChannelId = ""
	} else {
		annoChannelId = *channelId
	}

	// Check current streamer count
	liveAnnos, err := service.GetDiscordTwitchLiveAnnos(ctx, guildId)
	if err != nil {
		log.Println("[SetTwitchStreamer] GetDiscordTwitchLiveAnnos error:", err.Error())
		return "Twitch streamer `" + uInfo.Login + "` could not be added due to database error."
	}

	streamerExists := false
	for _, anno := range liveAnnos {
		if anno.TwitchUserID == uInfo.ID {
			streamerExists = true
			break
		}
	}

	// Get livestream limit
	limit, err := getLivestreamLimit(ctx, service, guildId)
	if err != nil {
		log.Println("[SetTwitchStreamer] getLivestreamLimit error:", err.Error())
		return "Twitch streamer `" + uInfo.Login + "` could not be added due to database error."
	}

	if !streamerExists && len(liveAnnos) >= limit {
		return "You have reached the maximum number of streamers (" + strconv.Itoa(limit) + "). Please remove some streamers before adding new ones."
	}

	added, err := service.AddDiscordTwitchLiveAnnos(ctx, uInfo.Login, uInfo.ID, annoChannelId, guildId, creatorUsername)
	if err != nil {
		log.Println("[SetTwitchStreamer] AddDiscordTwitchLiveAnnos error:", err.Error())

		//return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı veritabanı hatasından dolayı eklenemedi.", uInfo.Login)
		return "Twitch streamer `" + uInfo.Login + "` could not be added due to database error."
	}

	if !added {
		s.SetStreamerData(guildId, uInfo.ID, uInfo.Login, *channelId)
		//return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı varitabanında bulunmakta. Ancak... Twitch yayıncısının yayın duyurularının yapılacağı kanalı `%v` yazı kanalı olarak güncellendi.", uInfo.Login, channel.Name)
		return "Twitch streamer `" + uInfo.Login + "` is in the database. However... Streamer's channel for live stream announcements has been updated to the `" + channel.Name + "` text channel."
	}

	s.SetStreamerData(guildId, uInfo.ID, uInfo.Login, *channelId)
	//return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısının yayın duyuruları `%v` isimli yazı kanalı için aktif edildi.", uInfo.Login, channel.Name)
	return "Live stream announcements for Twitch streamer `" + uInfo.Login + "` have been enabled for the `" + channel.Name + "` text channel."
}

func (s *StreamerService) GetStreamAnnoContent(ctx context.Context, service service.Service, guildId, streamerUserId string) string {
	//annoContent := "{twitch.username}, {stream.category} yayınına başladı! {twitch.url}"
	annoContent := "{twitch.username} has started streaming {stream.category}! {twitch.url}"

	streamerAnnoContent, err := service.GetTwitchStreamerAnnoContent(ctx, streamerUserId, guildId)
	if err != nil {
		log.Println("[GetStreamAnnoContent] GetTwitchStreamerAnnoContent error:", err.Error())
	}

	if streamerAnnoContent != nil {
		annoContent = *streamerAnnoContent
	}

	cfg, err := service.GetDiscordBotConfig(ctx, guildId, "stream_anno_default_content")
	if err != nil {
		log.Println("[GetStreamAnnoContent] GetDiscordBotConfig error:", err.Error())
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
		log.Println("[CheckDatesAnnounceable] GetTwitchStreamerLastAnnoDate error:", err.Error())
		return false
	}

	if lastAnnoDate == nil {
		return true // No previous announcement, so announceable
	}

	var annoDate = *lastAnnoDate

	// Parse dates and apply location
	loc, loadLocationErr := time.LoadLocation("Europe/Amsterdam")
	if loadLocationErr != nil {
		log.Println("[CheckDatesAnnounceable] time.LoadLocation error:", loadLocationErr.Error())
		return false
	}
	startDate, err := time.ParseInLocation(time.RFC3339, startedAt, loc)
	if err != nil {
		log.Println("[CheckDatesAnnounceable] time.ParseInLocation error:", err.Error())
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
		log.Println("[CheckDatesAnnounceable] getCooldownDuration error:", err.Error())
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
		log.Println("Error getting Discord bot config:", err.Error())
		return 0, err
	}

	if cfg == nil {
		return 0, nil // No cooldown configured
	}

	cooldownDuration, err := strconv.Atoi(cfg.Value)
	if err != nil {
		log.Println("Error parsing cooldown duration:", err.Error())
		return 0, err
	}

	return cooldownDuration, nil
}

var streamersMutex sync.Mutex

func (s *StreamerService) getStreamersAndLiveData(_ context.Context, _ service.Service, guildId string) ([]model.TwitchStreamerData, map[string]GuildStreamers) {
	streamers := s.GetStreamersData(guildId)

	keys := make([]string, 0, len(streamers))
	for k := range streamers {
		keys = append(keys, k)
	}

	if len(keys) == 0 {
		return nil, nil
	}

	liveStreams, err := s.twitchService.CheckMultipleStreamers(keys)
	if err != nil {
		log.Printf("Error checking multiple streamers: %v", err)
		return nil, streamers
	}

	return liveStreams, streamers
}

func (s *StreamerService) handleAnnouncement(ctx context.Context, dS *discordgo.Session, service service.Service, guildId string, streamers map[string]GuildStreamers, sd model.TwitchStreamerData) {
	streamersMutex.Lock()
	defer streamersMutex.Unlock()

	gs, ok := streamers[sd.UserID]
	announceable := CheckDatesAnnounceable(ctx, service, guildId, sd.UserID, sd.StartedAt)
	if !ok || !announceable {
		return
	}

	annoContent := s.GetStreamAnnoContent(ctx, service, guildId, sd.UserID)
	formattedString := FormatContent(annoContent, sd)
	userInfo, err := s.twitchService.GetUserInfoByLoginName(sd.UserLogin)
	if err != nil {
		// TODO
	}
	dS.ChannelMessageSendComplex(gs.DiscordChannelID, &discordgo.MessageSend{Content: formattedString, Embeds: []*discordgo.MessageEmbed{
		{
			Title:       fmt.Sprintf("%s - Twitch", sd.UserName),
			Description: sd.Title,
			URL:         fmt.Sprintf("https://twitch.tv/%s", sd.UserLogin),
			Thumbnail:   &discordgo.MessageEmbedThumbnail{URL: userInfo.ProfileImageURL},
		},
	}})

	_, err = service.UpdateTwitchStreamerLastAnnoDate(ctx, sd.UserID, guildId, time.Now().UTC())
	if err != nil {
		log.Println("[handleAnnouncement] UpdateTwitchStreamerLastAnnoDate error:", err.Error())
	}
}

var liveStreamChannels = make(map[string]chan struct{})

func (s *StreamerService) StartCheckLiveStreams(dS *discordgo.Session, ctx context.Context, service service.Service, guildId string) {
	if _, ok := liveStreamChannels[guildId]; ok {
		return
	}

	stop := make(chan struct{})
	liveStreamChannels[guildId] = stop

	go s.CheckLiveStreams(dS, ctx, service, guildId, stop)
}

func (s *StreamerService) StopCheckLiveStreams(guildId string) {
	if channel, ok := liveStreamChannels[guildId]; ok {
		close(channel)
		delete(liveStreamChannels, guildId)
	}
}

func (s *StreamerService) CheckLiveStreams(dS *discordgo.Session, ctx context.Context, service service.Service, guildId string, stop <-chan struct{}) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	s.initStreamersData(ctx, service, guildId)

	for {
		select {
		case <-ticker.C:
			streamersMutex.Lock()
			liveStreams, streamers := s.getStreamersAndLiveData(ctx, service, guildId)
			streamersMutex.Unlock()

			if len(liveStreams) == 0 {
				continue
			}

			for _, sd := range liveStreams {
				liveAnnoData, err := service.GetDiscordTwitchLiveAnno(ctx, sd.UserID, guildId)
				if err != nil {
					log.Println("[CheckLiveStreams] GetDiscordTwitchLiveAnno error:", err.Error())
					break
				}
				if sd.Type == "live" && liveAnnoData != nil {
					categoryFilter, err := service.GetDiscordChannelTwitchCategoryFilter(ctx, guildId, liveAnnoData.AnnoChannelID)
					if err != nil {
						log.Println("[CheckLiveStreams] GetDiscordChannelTwitchCategoryFilter error:", err.Error())
						break
					}

					if len(categoryFilter) > 0 {
						cgrFilter := categoryFilter[0]
						expr := cgrFilter.CategoryFilterRegex
						pattern, err := regexp.Compile(expr)
						if err != nil {
							log.Printf("[CheckLiveStreams] regexp.Compile error: %s, Expr: %s, Streamer: %s", err.Error(), expr, liveAnnoData.TwitchUsername)
							continue
						}

						var matchCondition bool
						switch cgrFilter.ConditionType {
						case 0:
							matchCondition = pattern.MatchString(sd.GameName)
						case 1:
							matchCondition = !pattern.MatchString(sd.GameName)
						}

						if matchCondition {
							continue
						}
					}

					s.handleAnnouncement(ctx, dS, service, guildId, streamers, sd)
				} else {
					continue
				}
			}
		case <-stop:
			return
		}
	}
}

func FormatContent(str string, sd model.TwitchStreamerData) string {
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

func getLivestreamLimit(ctx context.Context, service service.Service, guildId string) (int, error) {
	cfg, err := service.GetDiscordBotConfig(ctx, guildId, "stream_anno_limit")
	if err != nil {
		log.Println("Error getting Discord bot config:", err.Error())
		return 10, err // Default to 10 if not configured
	}

	if cfg == nil {
		return 10, nil // Default to 10 if not configured
	}

	limit, err := strconv.Atoi(cfg.Value)
	if err != nil {
		log.Println("Error parsing livestream limit:", err.Error())
		return 10, err // Default to 10 if parsing fails
	}

	return limit, nil
}
