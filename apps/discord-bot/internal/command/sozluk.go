package command

import (
	"context"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) SozlukCommand(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*model.CommandResponse, error) {
	return command.SozlukCommand(params)

}

func SozlukCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "sozluk",
		Description: "Kampus sozluk.",
	}
}
