package command

import (
	"context"
	"log"
	"os"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/model"
)

// Delete Command Handler
func (c *commands) DcmdCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options
	message := &model.MessageData{
		PlatformEntityID: i.GuildID,
		UserName:         i.Member.User.Username,
	}

	command_name := options[0].StringValue()

	deletedCommandName, infoText, err := c.service.DeleteCommand(ctx, command_name, message.PlatformEntityID)
	if err != nil {
		log.Println("Something went wrong while deleting command: `"+command_name+"`. Error:", err.Error())
		ephemeralRespond(s, i, "Something went wrong while deleting command: `"+command_name+"`")
		return
	}
	if infoText != nil {
		ephemeralRespond(s, i, message.UserName+", "+*infoText)
		return
	}

	appGuildCmds, err := s.ApplicationCommands(os.Getenv("CLIENT_ID"), i.GuildID)
	if err != nil {
		log.Println("Something went wrong while deleting slash command: `"+command_name+"`. Error:", err.Error())
		ephemeralRespond(s, i, "Something went wrong while deleting slash command: `"+command_name+"`")
		return
	}
	for _, appCmd := range appGuildCmds {
		if appCmd.Name == command_name {
			s.ApplicationCommandDelete(os.Getenv("CLIENT_ID"), i.GuildID, appCmd.ID)
			break
		}
	}

	log.Println("COMMAND_DELETE: command_name:", *deletedCommandName)

	cmdResp := "Command Deleted: " + *deletedCommandName

	ephemeralRespond(s, i, cmdResp)
}

// Delete Command Metadata
func DcmdCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "dcmd",
		Description: "Delete an existing command",
		Options: []*discordgo.ApplicationCommandOption{
			{
				Type:        discordgo.ApplicationCommandOptionString,
				Name:        "name",
				Description: "Name of the command to delete",
				Required:    true,
			},
		},
		DefaultMemberPermissions: &setdeletePermissions,
	}
}
