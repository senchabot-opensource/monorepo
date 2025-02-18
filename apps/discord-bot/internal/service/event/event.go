package event

import (
	"log"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

type EventService struct {
	twitchService twitchapi.TwitchService
}

func NewEventService(twitchService twitchapi.TwitchService) *EventService {
	return &EventService{
		twitchService: twitchService,
	}
}

func (es *EventService) CreateLiveStreamScheduledEvent(s *discordgo.Session, msgContent string, msgEmbeds []*discordgo.MessageEmbed, guildId string) {
	url := helper.GetURL("twitch.tv", msgContent)
	if url == "" && len(msgEmbeds) > 0 {
		url = msgEmbeds[0].URL
	}

	username := helper.ParseTwitchUsernameURLParam(url)
	if url == "" || username == "" {
		return
	}

	startingTime := time.Now().Add(2 * time.Minute)
	endingTime := startingTime.Add(16 * time.Hour)

	scheduledEvent, err := s.GuildScheduledEventCreate(guildId, &discordgo.GuildScheduledEventParams{
		Name:               username + " is live on Twitch!",
		ScheduledStartTime: &startingTime,
		ScheduledEndTime:   &endingTime,
		EntityType:         discordgo.GuildScheduledEventEntityTypeExternal,
		EntityMetadata: &discordgo.GuildScheduledEventEntityMetadata{
			Location: url,
		},
		PrivacyLevel: discordgo.GuildScheduledEventPrivacyLevelGuildOnly,
	})
	if err != nil {
		log.Println("[CreateLiveStreamScheduledEvent] GuildScheduledEventCreate error:", err.Error())
		return
	}

	log.Println("Created scheduled event: ", scheduledEvent.Name)
}

func (es *EventService) CheckLiveStreamScheduledEvents(dS *discordgo.Session) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		for _, guild := range dS.State.Guilds {
			events, err := dS.GuildScheduledEvents(guild.ID, false)
			if err != nil {
				log.Println("[CheckLiveStreamScheduledEvents] GuildScheduledEvents error:", err.Error())
				continue
			}

			go func(guildID string, events []*discordgo.GuildScheduledEvent) {
				for _, e := range events {
					if !e.Creator.Bot {
						continue
					}

					twitchUsername := helper.ParseTwitchUsernameURLParam(e.EntityMetadata.Location)
					isLive, streamTitle, err := es.twitchService.CheckStreamStatusByUsername(twitchUsername)
					if err != nil {
						log.Printf("[CheckLiveStreamScheduledEvents] CheckStreamStatus error for %s: %v", twitchUsername, err)
						continue
					}

					if len(streamTitle) > 100 {
						streamTitle = streamTitle[0:90]
					}
					if isLive {
						if e.Name != streamTitle {
							_, err = dS.GuildScheduledEventEdit(e.GuildID, e.ID, &discordgo.GuildScheduledEventParams{
								Name: streamTitle,
							})
							if err != nil {
								log.Println("[CheckLiveStreamScheduledEvents] GuildScheduledEventEdit error:", err.Error())
							}
						}
					}

					if !isLive {
						err := dS.GuildScheduledEventDelete(e.GuildID, e.ID)
						if err != nil {
							log.Println("[CheckLiveStreamScheduledEvents] GuildScheduledEventDelete error:", err.Error())
						}
					}
				}
			}(guild.ID, events)
		}
	}
}
