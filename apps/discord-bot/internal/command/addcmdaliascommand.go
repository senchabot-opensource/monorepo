package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func (c *commands) AddCmdAliasCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	cmdName := options[0].StringValue()
	params := strings.Split(options[1].StringValue(), " ")

	cmdName = gosenchabot.GetProcessedCommandName(cmdName)
	aliasCommands := gosenchabot.MakeUniqueArray(params)

	if infoText, check := gosenchabot.ValidateAliasCommandsLength(aliasCommands); !check {
		ephemeralRespond(s, i, infoText)
		return
	}

	infoText, err := db.CreateCommandAlias(ctx, cmdName, aliasCommands, i.GuildID, i.Member.User.Username)
	if err != nil {
		fmt.Println("AddCommandAlias Error: " + err.Error())
		return
	}
	if infoText != nil {
		ephemeralRespond(s, i, i.Member.User.Username+", "+*infoText)
		return
	}

	commandAliasesList := strings.Join(aliasCommands, ", ")
	fmt.Println("COMMAND_ALIAS_ADD: command_aliases:", commandAliasesList, "command_name:", cmdName)

	ephemeralRespond(s, i, "New Command Aliases Added: "+commandAliasesList)
}
