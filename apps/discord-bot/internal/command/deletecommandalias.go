package command

import (
	"context"
	"errors"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) DeleteCommandAliasCommand(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*models.CommandResponse, error) {
	msgData := &models.MessageData{
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

	return command.DcmdaCommand(context, c.service.DeleteCommandAlias, c.IsSystemCommand, *msgData, commandName, params)
}

func DeleteCommandAliasCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:                     "dcmda",
		Description:              "Delete a command alias.",
		DefaultMemberPermissions: &manageCmdPermissions,
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "command-alias",
				Description: "Command Alias",
				Required:    true,
			},
		},
	}
}
