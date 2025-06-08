package command

import (
	"context"
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) AcmdvarCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	message := &model.MessageData{
		PlatformEntityID: i.GuildID,
		UserName:         i.Member.User.Username,
	}

	options := i.ApplicationCommandData().Options

	cmdVarName := options[0].StringValue()
	cmdVarContent := options[1].StringValue()

	if !helper.IsValidVariableName(cmdVarName) {
		ephemeralRespond(s, i, "Variable name must start with a letter and can only contain letters, numbers, and underscores")
		return
	}

	// Check if variable already exists
	_, err := c.service.GetCommandVariable(ctx, cmdVarName, message.PlatformEntityID)
	if err == nil {
		ephemeralRespond(s, i, fmt.Sprintf("Variable '%s' already exists", cmdVarName))
		return
	}

	err = c.service.CreateCommandVariable(ctx, cmdVarName, cmdVarContent, message.PlatformEntityID, message.UserName)
	if err != nil {
		log.Printf("[AcmdvarCommandHandler] service.CreateCommandVariable Error: %s\n", err.Error())
		ephemeralRespond(s, i, "Something went wrong while creating command variable `"+cmdVarName+"`")
		return
	}

	ephemeralRespond(s, i, fmt.Sprintf("Command variable '%s' has been created", cmdVarName))
}

func AcmdvarCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "acmdvar",
		Description: "Add a new command variable",
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "name",
				Description: "Name of the command variable",
				Required:    true,
			},
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "content",
				Description: "Content of the command variable",
				Required:    true,
			},
		},
		DMPermission:             &dmPermission,
		DefaultMemberPermissions: &setdeletePermissions,
	}
}
