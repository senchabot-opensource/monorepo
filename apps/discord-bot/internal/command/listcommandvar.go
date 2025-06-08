package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) LcmdvarCommandHandler(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	message := &model.MessageData{
		PlatformEntityID: i.GuildID,
		UserName:         i.Member.User.Username,
	}

	variables, err := c.service.ListCommandVariables(ctx, message.PlatformEntityID)
	if err != nil {
		ephemeralRespond(s, i, "Failed to retrieve command variables")
		return
	}

	if len(variables) == 0 {
		ephemeralRespond(s, i, "No command variables found")
		return
	}

	var response strings.Builder
	response.WriteString("Command variables: ")

	for i, v := range variables {
		if i > 0 {
			response.WriteString(", ")
		}
		response.WriteString(fmt.Sprintf("%s={%s}", v.VariableName, v.VariableContent))
	}

	ephemeralRespond(s, i, response.String())
}

func LcmdvarCommandMetadata() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:                     "lcmdvar",
		Description:              "List all command variables",
		DefaultMemberPermissions: &setdeletePermissions,
	}
}
