package command

import (
	"context"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) UpdateCommandCommand(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*models.CommandResponse, error) {
	msgData := &models.MessageData{
		PlatformEntityID: m.GuildID,
		UserName:         m.Author.Username,
	}

	return command.UcmdCommand(context, c.service.UpdateCommand, c.IsSystemCommand, *msgData, commandName, params)
}
