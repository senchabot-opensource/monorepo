package command

import (
	"context"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) CmdsCommand(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*model.CommandResponse, error) {
	msgData := &model.MessageData{
		PlatformEntityID: m.GuildID,
		UserName:         m.Author.Username,
	}
	return command.CmdsCommand(context, c.service.GetCommandList, c.IsSystemCommand, *msgData, commandName, params)

}
