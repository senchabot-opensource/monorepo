package command

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/command"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

// Add Command Handler
func (c *commands) AcmdCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options
	message := &model.MessageData{
		PlatformEntityID: i.GuildID,
		UserName:         i.Member.User.Username,
	}

	command_name := options[0].StringValue()
	command_content := options[1].StringValue()

	if !helpers.IsValidSlashCommandName(command_name) {
		ephemeralRespond(s, i, fmt.Sprintf("%v, command name must be 1-32 characters long, lowercase, and contain only letters, numbers, and hyphens", message.UserName))
		return
	}

	if c.IsSystemCommand(command_name) {
		ephemeralRespond(s, i, fmt.Sprintf("%v, the command \"%v\" is used as system command", message.UserName, command_name))
		return
	}

	// Check command name and content length
	if infoText, check := helper.ValidateCommandCreateParams(command_name, command_content); !check {
		ephemeralRespond(s, i, message.UserName+", "+infoText)
		return
	}

	if !command.CheckCommandContentLengthWithCustomVariable(command_content, ctx, *message, c.service.GetCustomVariableContent) {
		ephemeralRespond(s, i, config.CommandContentLimit)
		return
	}

	infoText, err := c.service.CreateCommand(ctx, command_name, command_content, message.PlatformEntityID, message.UserName)
	if err != nil {
		log.Printf("[AcmdCommandHandler] Failed to create command '%s' for guild %s: %v\n",
			command_name, i.GuildID, err)
		ephemeralRespond(s, i, fmt.Sprintf("Something went wrong while creating command `%s`", command_name))
		return
	}

	if infoText != nil {
		ephemeralRespond(s, i, message.UserName+", "+*infoText)
		return
	}

	// Deploy the new command as a slash command

	description := "Custom command"

	slashCmd := CreateCustomCommandSlashCommand(command_name, description)
	_, err = s.ApplicationCommandCreate(os.Getenv("CLIENT_ID"), i.GuildID, slashCmd)
	if err != nil {
		log.Printf("[AcmdCommandHandler] Failed to create slash command '%s' for guild %s: %v\n",
			command_name, i.GuildID, err)
		ephemeralRespond(s, i, fmt.Sprintf("Something went wrong while creating command `%s`", command_name))
		return
	} else {
		log.Printf("[AcmdCommandHandler] Created slash command '%s' for guild %s\n",
			command_name, i.GuildID)
	}

	log.Println("COMMAND_ADD: command_name:", command_name, ", command_content:", command_content)
	cmdResp := "New Command Added: " + command_name

	ephemeralRespond(s, i, cmdResp)
}

func AcmdCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "acmd",
		Description: "Add a new command",
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "name",
				Description: "Name of the command",
				Required:    true,
			},
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "content",
				Description: "Content of the command",
				Required:    true,
			},
		},
		DMPermission:             &dmPermission,
		DefaultMemberPermissions: &setdeletePermissions,
	}
}
