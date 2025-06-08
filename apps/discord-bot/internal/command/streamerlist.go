package command

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/config"
)

func (c *commands) StreamerListCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	liveAnnos, err := service.GetDiscordTwitchLiveAnnos(ctx, i.GuildID)
	if err != nil {
		log.Println("[command.StreamerListCommand] GetDiscordTwitchLiveAnnos error:", err.Error())
		// TODO: edit respond or create errorMessage sheet
		ephemeralRespond(s, i, config.ErrorMessage+"streamer-list#0001")
		return
	}
	var streamerList []string
	for _, v := range liveAnnos {
		streamerList = append(streamerList, fmt.Sprintf("`%s`", v.TwitchUsername))
	}

	if len(streamerList) < 1 {
		ephemeralRespond(s, i, "No streamer added")
		return
	}

	ephemeralRespond(s, i, strings.Join(streamerList, ", "))
}

func StreamerListCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:                     "streamer-list",
		Description:              "Show list of Twitch streamers added for live stream announcements",
		DMPermission:             &dmPermission,
		DefaultMemberPermissions: &setdeletePermissions,
	}
}
