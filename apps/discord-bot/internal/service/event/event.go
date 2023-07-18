package event

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/client"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/helpers"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/service/streamer"
)

func CreateLiveStreamScheduledEvent(s *discordgo.Session, msgContent, guildId string, wg *sync.WaitGroup) {
	defer wg.Done()

	url := helpers.GetURL("twitch.tv", msgContent)
	username := helpers.ParseTwitchUsernameURLParam(url)
	if url == "" || username == "" {
		return
	}

	wg.Add(1)

	events, err := s.GuildScheduledEvents(guildId, false)
	if err != nil {
		fmt.Println("s.GuildScheduledEvents")
	}
	for _, e := range events {
		if e.Creator.Bot && e.EntityMetadata.Location == url {
			return
		}
	}

	startingTime := time.Now().Add(2 * time.Minute)
	endingTime := startingTime.Add(16 * time.Hour)

	scheduledEvent, err := s.GuildScheduledEventCreate(guildId, &discordgo.GuildScheduledEventParams{
		Name:               username + " is about to go live!",
		ScheduledStartTime: &startingTime,
		ScheduledEndTime:   &endingTime,
		EntityType:         discordgo.GuildScheduledEventEntityTypeExternal,
		EntityMetadata: &discordgo.GuildScheduledEventEntityMetadata{
			Location: url,
		},
		PrivacyLevel: discordgo.GuildScheduledEventPrivacyLevelGuildOnly,
	})
	if err != nil {
		log.Printf("Error while creating scheduled event: %v", err)
		wg.Done()
		return
	}

	fmt.Println("Created scheduled event: ", scheduledEvent.Name)
	wg.Done()
}

func CheckLiveStreams(s *discordgo.Session, ctx context.Context, db *db.MySQL, guildId string) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	streamer.InitStreamersData(ctx, db, guildId)

	for range ticker.C {
		streamers := streamer.GetStreamersData(guildId)
		keys := make([]string, 0, len(streamers))
		for k := range streamers {
			//streamers[dtla.TwitchUsername] = dtla.AnnoChannelID
			keys = append(keys, k)
		}

		if len(keys) == 0 {
			return
		}

		liveStreams := client.CheckMultipleTwitchStreamer(keys)
		annoContent := ""
		for _, sd := range liveStreams {
			if sd.Type == "live" {
				ch, prs := streamers[sd.UserLogin]
				if prs {
					date, err := db.GetTwitchStreamerLastAnnoDate(ctx, sd.UserLogin, guildId)
					if err != nil {
						log.Printf("There was an error while checking Twitch streamer last anno date: %v", err)
					}
					if date != nil {
						if int(time.Until(*date).Hours()) == 0 {
							return
						}
					}

					annoContent = "{twitch.user.name}, {twitch.category} yayınına başladı! {twitch.url}"

					streamerAnnoContent, err := db.GetTwitchStreamerAnnoContent(ctx, sd.UserLogin, guildId)
					if err != nil {
						log.Printf("There was an error while getting Twitch streamer announcement content in CheckLiveStreams: %v", err)
					}

					if streamerAnnoContent != nil {
						annoContent = *streamerAnnoContent
					}

					cfg, err := db.GetDiscordBotConfig(ctx, guildId, "stream_anno_content")
					if err != nil {
						log.Printf("There was an error while getting Discord bot config in CheckLiveStreams: %v", err)
					}

					if cfg != nil && streamerAnnoContent == nil {
						if cfg.Value != "" {
							annoContent = cfg.Value
						}
					}

					formattedString := helpers.FormatContent(annoContent, sd)
					s.ChannelMessageSend(ch.ChannelID, formattedString)

					_, err = db.UpdateTwitchStreamerLastAnnoDate(ctx, sd.UserLogin, guildId, time.Now())
					if err != nil {
						log.Printf("There was an error while getting updating Twitch streamer last anno date in CheckLiveStreams: %v", err)
					}
					delete(streamers, sd.UserLogin)
				}
			}
		}
	}
}

func CheckLiveStreamScheduledEvents(s *discordgo.Session) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	var twitchUsername string

	for range ticker.C {
		for _, guild := range s.State.Guilds {
			events, err := s.GuildScheduledEvents(guild.ID, false)
			if err != nil {
				fmt.Println("s.GuildScheduledEvents")
			}

			for _, e := range events {
				if !e.Creator.Bot {
					return
				}

				twitchUsername = helpers.ParseTwitchUsernameURLParam(e.EntityMetadata.Location)
				isLive, streamTitle := client.CheckTwitchStreamStatus(twitchUsername)
				if len(streamTitle) > 100 {
					streamTitle = streamTitle[0:90]
				}
				if isLive {
					if e.Name != streamTitle {
						_, err = s.GuildScheduledEventEdit(e.GuildID, e.ID, &discordgo.GuildScheduledEventParams{
							Name: streamTitle,
						})
						if err != nil {
							log.Printf("Error while updating scheduledevent: %v", err)
						}
					}
				}

				if !isLive {
					err := s.GuildScheduledEventDelete(e.GuildID, e.ID)
					if err != nil {
						log.Printf("Error deleting scheduled event: %v", err)
					}
				}
			}
		}
	}
}
