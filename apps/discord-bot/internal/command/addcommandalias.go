package command

import (
	"context"
	"errors"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func (c *commands) AddCommandAliasCommand(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*models.CommandResponse, error) {
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

	return command.AcmdaCommand(context, c.service.CheckCommandExists, c.service.CreateCommandAlias, c.IsSystemCommand, *msgData, commandName, params)
}

func AddCommandAliasCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:                     "acmda",
		Description:              "Add command aliases to a command.",
		DefaultMemberPermissions: &manageCmdPermissions,
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "command-name",
				Description: "Command Name",
				Required:    true,
			},
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "command-aliases",
				Description: "Command alias(es) separated by space",
				Required:    true,
			},
		},
	}
}
