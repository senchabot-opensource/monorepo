package command

import (
	"context"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

func (c *commands) InviteCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	ephemeralRespond(s, i, "https://discord.com/oauth2/authorize?client_id=1039550209274945587&permissions=681697203976878&scope=bot")
}
