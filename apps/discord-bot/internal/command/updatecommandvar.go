package command

import (
	"context"
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) UcmdvarCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	message := &model.MessageData{
		PlatformEntityID: i.GuildID,
		UserName:         i.Member.User.Username,
	}

	options := i.ApplicationCommandData().Options

	cmdVarName := options[0].StringValue()
	cmdVarContent := options[1].StringValue()

	_, err := c.service.GetCommandVariable(ctx, cmdVarName, message.PlatformEntityID)
	if err != nil {
		ephemeralRespond(s, i, fmt.Sprintf("Variable '%s' not found", cmdVarName))
		return
	}

	err = c.service.UpdateCommandVariable(ctx, cmdVarName, cmdVarContent, message.PlatformEntityID, message.UserName)
	if err != nil {
		log.Printf("[UcmdvarCommandHandler] service.UpdateCommandVariable Error: %s\n", err.Error())
		ephemeralRespond(s, i, "Something went wrong while updating command variable `"+cmdVarName+"`")
		return
	}

	ephemeralRespond(s, i, fmt.Sprintf("Command variable '%s' has been updated", cmdVarName))
}

func UcmdvarCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "ucmdvar",
		Description: "Update a command variable",
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "name",
				Description: "Name of the command variable to update",
				Required:    true,
			},
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "content",
				Description: "Content of the command variable",
				Required:    true,
			},
		},
		DefaultMemberPermissions: &setdeletePermissions,
	}
}
