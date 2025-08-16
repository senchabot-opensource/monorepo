package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/model"
)

// Commands List Handler
func (c *commands) CmdsCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	msgData := &model.MessageData{
		PlatformEntityID: i.GuildID,
		UserName:         i.Member.User.Username,
	}

	resp, err := command.CmdsCommand(ctx, c.service.GetCommandList, c.IsSystemCommand, *msgData, "cmds", []string{})
	if err != nil {
		log.Printf("[CmdsCommandHandler] command.CmdsCommand Error: %s\n", err.Error())
		ephemeralRespond(s, i, "Something went wrong while getting commands")
		return
	}

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: resp.Message,
		},
	})
}

// Commands List Metadata
func CmdsCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:         "cmds",
		Description:  "List all available commands",
		DMPermission: &dmPermission,
	}
}
