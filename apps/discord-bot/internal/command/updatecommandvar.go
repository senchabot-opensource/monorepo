package command

import (
	"context"
	"errors"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) UpdateCommandVariableCommand(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*model.CommandResponse, error) {
	msgData := &model.MessageData{
		PlatformEntityID: m.GuildID,
		UserName:         m.Author.Username,
	}

	p, err := c.dS.UserChannelPermissions(m.Author.ID, m.ChannelID)
	if err != nil {
		return nil, err
	}

	if p&discordgo.PermissionManageChannels != discordgo.PermissionManageChannels {
		return nil, errors.New("dont have permission")
	}

	return command.UpdateCommandVariableCommand(context, c.service.UpdateCommandVariable, c.service.GetCommandVariable, *msgData, commandName, params)
}
