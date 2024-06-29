package event

import (
	"log"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	twsrvc "github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

func CreateLiveStreamScheduledEvent(s *discordgo.Session, msgContent string, msgEmbeds []*discordgo.MessageEmbed, guildId string) {
	url := gosenchabot.GetURL("twitch.tv", msgContent)
	if url == "" && len(msgEmbeds) > 0 {
		url = msgEmbeds[0].URL
	}

	username := gosenchabot.ParseTwitchUsernameURLParam(url)
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

func CheckLiveStreamScheduledEvents(s *discordgo.Session) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		for _, guild := range s.State.Guilds {
			events, err := s.GuildScheduledEvents(guild.ID, false)
			if err != nil {
				log.Println("[CheckLiveStreamScheduledEvents] GuildScheduledEvents error:", err.Error())
				continue
			}

			go func(guildID string, events []*discordgo.GuildScheduledEvent) {
				for _, e := range events {
					if !e.Creator.Bot {
						continue
					}

					twitchUsername := gosenchabot.ParseTwitchUsernameURLParam(e.EntityMetadata.Location)
					isLive, streamTitle := twsrvc.CheckTwitchStreamStatus(twitchUsername)
					if len(streamTitle) > 100 {
						streamTitle = streamTitle[0:90]
					}
					if isLive {
						if e.Name != streamTitle {
							_, err = s.GuildScheduledEventEdit(e.GuildID, e.ID, &discordgo.GuildScheduledEventParams{
								Name: streamTitle,
							})
							if err != nil {
								log.Println("[CheckLiveStreamScheduledEvents] GuildScheduledEventEdit error:", err.Error())
							}
						}
					}

					if !isLive {
						err := s.GuildScheduledEventDelete(e.GuildID, e.ID)
						if err != nil {
							log.Println("[CheckLiveStreamScheduledEvents] GuildScheduledEventDelete error:", err.Error())
						}
					}
				}
			}(guild.ID, events)
		}
	}
}
