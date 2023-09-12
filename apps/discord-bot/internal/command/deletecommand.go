package command

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

func (c *commands) DeleteCommandCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	cmdName := options[0].StringValue()

	deletedCmdName, resp, err := service.DeleteCommand(ctx, cmdName, i.GuildID)
	if err != nil {
		fmt.Println(err)
		return
	}

	if resp != nil {
		ephemeralRespond(s, i, *resp)
		return
	}

	ephemeralRespond(s, i, "Command Deleted: "+*deletedCmdName)
}
