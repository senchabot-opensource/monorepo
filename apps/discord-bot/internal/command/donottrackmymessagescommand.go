package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

func DoNotTrackMessagesCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "do-not-track-my-messages",
		Description: "Opt-out of having your message content tracked by the Senchabot",
	}
}

func (c *commands) DoNotTrackMessagesCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	if err := service.SetDiscordUserPrivacyPreferences(context.Background(), i.Member.User.ID, true); err != nil {
		log.Println("[command.DoNotTrackMessagesCommand] service.SetDiscordUserPrivacyPreferences error:", err.Error())
		return
	}

	ephemeralRespond(s, i, "Your preference has been saved. Your message content will no longer be tracked. You will not be able to use any Senchabot text based commands. You can change your preference at any time.")
}
