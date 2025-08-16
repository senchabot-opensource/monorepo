package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

func TrackMyMessagesCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "track-my-messages",
		Description: "Opt-in to having your message content tracked by the Senchabot",
	}
}

func (c *commands) TrackMyMessagesCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	var memberId string
	if i.Member != nil {
		memberId = i.Member.User.ID
	} else {
		memberId = i.User.ID
	}
	if err := service.SetDiscordUserPrivacyPreferences(context.Background(), memberId, false); err != nil {
		log.Println("[command.TrackMyMessagesCommand] service.SetDiscordUserPrivacyPreferences error:", err.Error())
		return
	}

	ephemeralRespond(s, i, "Your preference has been saved. Your message content will be tracked. You can use Senchabot's text based functions. You can change your preference at any time.")
}
