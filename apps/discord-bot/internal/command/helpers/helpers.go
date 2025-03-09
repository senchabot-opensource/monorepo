package helpers

import (
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/platform"
)

func GetCommandVariables(dS *discordgo.Session, cmdData *model.BotCommand, i *discordgo.InteractionCreate) *model.CommandVariable {
	var channelName string
	chData, err := dS.Channel(i.ChannelID)
	if err != nil {
		log.Println("[helpers.GetCommandVariables] dS.Channel error:", err.Error())
		channelName = "None"
	}
	if chData != nil {
		channelName = chData.Name
	}

	return &model.CommandVariable{
		CommandContent:   cmdData.CommandContent,
		UserName:         i.Member.User.Username,
		CurrentDate:      &i.Message.Timestamp,
		CommandCreatedAt: cmdData.CreatedAt,
		ChannelName:      channelName,
		BotPlatform:      platform.DISCORD,
		BotPlatformID:    i.GuildID,
	}
}

func IsChannelNameNotGiven(optionsLen int) bool {
	return optionsLen < 2
}
