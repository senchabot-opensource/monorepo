package handler

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/helper"
)

func (h *handler) InteractionCreate(command command.Command) {
	h.discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		ctx := context.Background()
		commandHandlers := command.GetSystemCommands()
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
			commandStr := i.ApplicationCommandData().Name + " " + strings.Join(options, " ")
			h.service.SaveCommandActivity(ctx, commandStr, i.GuildID, i.Member.User.Username, i.Member.User.ID)
			return
		}

		commandName := i.ApplicationCommandData().Name
		botCommand, err := h.service.GetUserBotCommand(ctx, commandName, i.GuildID)
		if err == nil && botCommand != nil {
			log.Printf("[InteractionCreate] Executing custom command: %s for guild %s\n", commandName, i.GuildID)

			cmdVar := helpers.GetCommandVariables(s, botCommand, i)
			formattedCommandContent := helper.FormatCommandContent(cmdVar, h.service)
			err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: formattedCommandContent,
				},
			})

			if err != nil {
				log.Printf("[InteractionCreate] Error responding to custom command: %v\n", err)
				return
			}

			h.service.AddBotCommandStatistic(ctx, commandName)
			h.service.SaveCommandActivity(ctx, commandName, i.GuildID, i.Member.User.Username, i.Member.User.ID)
		}
	})
}
