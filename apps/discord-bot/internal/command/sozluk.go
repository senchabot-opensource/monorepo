package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/command"
)

func (c *commands) SozlukCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	sozlukTerm := options[0].StringValue()

	resp, err := command.SozlukCommand([]string{sozlukTerm})
	if err != nil {
		log.Printf("[SozlukCommandHandler] Error: %s\n", err.Error())
		//ephemeralRespond(s, i, "Something went wrong :(") TODO: uncomment if you need
		return
	}

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: resp.Message,
		},
	})
}

func SozlukCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "sozluk",
		Description: "kamp.us sozluk.",
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "term",
				Description: "Term to search for",
				DescriptionLocalizations: map[discordgo.Locale]string{
					discordgo.Turkish: "Aranacak terim",
				},
				Required: true,
			},
		},
	}
}
