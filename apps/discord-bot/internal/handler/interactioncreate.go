package handler

import (
	"context"
	"fmt"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
)

func (h *handler) InteractionCreate(command command.Command) {
	h.discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		ctx := context.Background()
		commandHandlers := command.GetCommands()
		if cmd, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
			cmd(ctx, h.discordClient, i, h.service)
			options := []string{}
			for _, v := range i.ApplicationCommandData().Options {
				options = append(options, v.Name)
				if len(v.Options) > 0 {
					for _, vj := range v.Options {
						switch vj.Type.String() {
						case "String":
							options = append(options, fmt.Sprintf(`"%v: %v"`, vj.Name, vj.StringValue()))
						case "Channel":
							options = append(options, fmt.Sprintf(`"%v: %v"`, vj.Name, vj.ChannelValue(s).Name))
						}
					}
				}
			}
			command := i.ApplicationCommandData().Name + " " + strings.Join(options, " ")
			h.service.SaveCommandActivity(ctx, command, i.GuildID, i.Member.User.Username, i.Member.User.ID)
		}
	})
}
