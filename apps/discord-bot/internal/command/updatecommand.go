package command

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/model"
)

// Update Command Handler
func (c *commands) UcmdCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options
	message := &model.MessageData{
		PlatformEntityID: i.GuildID,
		UserName:         i.Member.User.Username,
	}

	command_name := options[0].StringValue()
	newCommandContent := options[1].StringValue()

	if !command.CheckCommandContentLengthWithCustomVariable(newCommandContent, ctx, *message, c.service.GetCustomVariableContent) {
		ephemeralRespond(s, i, config.CommandContentLimit)
		return
	}

	updatedCommandName, infoText, err := c.service.UpdateCommand(ctx, command_name, newCommandContent, message.PlatformEntityID, message.UserName)
	if err != nil {
		ephemeralRespond(s, i, "Something went wrong while updating command: `"+command_name+"`")
		return
	}

	if infoText != nil {
		ephemeralRespond(s, i, message.UserName+", "+*infoText)
		return
	}

	log.Println("COMMAND_UPDATE: command_name:", *updatedCommandName, "new_command_content:", newCommandContent)

	cmdResp := "Command Updated: " + *updatedCommandName

	ephemeralRespond(s, i, cmdResp)
}

// Update Command Metadata
func UcmdCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "ucmd",
		Description: "Update an existing command",
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "name",
				Description: "Name of the command to update",
				Required:    true,
			},
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "content",
				Description: "New content for the command",
				Required:    true,
			},
		},
		DMPermission:             &dmPermission,
		DefaultMemberPermissions: &setdeletePermissions,
	}
}
