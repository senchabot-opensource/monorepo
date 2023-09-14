package command

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

func (c *commands) AddCommandCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	options := i.ApplicationCommandData().Options

	cmdName := options[0].StringValue()
	cmdContent := options[1].StringValue()

	if c.IsSystemCommand(cmdName) {
		ephemeralRespond(s, i, fmt.Sprintf("%v, the command \"%v\" is used as system command", i.Member.User.Username, cmdName))
		return
	}

	resp, err := service.CreateCommand(ctx, cmdName, cmdContent, i.GuildID, i.Member.User.Username)
	if err != nil {
		fmt.Println("[AddCommandCommand] Error:", err.Error())
		return
	}

	if resp != nil {
		ephemeralRespond(s, i, *resp)
		return
	}

	ephemeralRespond(s, i, "New Command Added: "+cmdName)
}
