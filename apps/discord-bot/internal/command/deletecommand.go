package command

import (
	"context"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) DeleteCommandCommand(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*models.CommandResponse, error) {
	msgData := &models.MessageData{
		PlatformEntityID: m.GuildID,
		UserName:         m.Author.Username,
	}

	return command.DcmdCommand(context, c.service.DeleteCommand, c.IsSystemCommand, *msgData, commandName, params)
}

func DeleteCommandCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:                     "dcmd",
		Description:              "Delete a custom command.",
		DefaultMemberPermissions: &manageCmdPermissions,
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "command-name",
				Description: "Command Name",
				Required:    true,
			},
		},
	}
}
