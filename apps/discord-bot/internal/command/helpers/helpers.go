package helpers

import (
	"log"
	"time"

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

	// If i.Message is nil or timestamp is empty, use current time
	var currentDate *time.Time
	if i.Message != nil && !i.Message.Timestamp.IsZero() {
		currentDate = &i.Message.Timestamp
	} else {
		now := time.Now().UTC()
		currentDate = &now
	}

	return &model.CommandVariable{
		CommandContent:   cmdData.CommandContent,
		UserName:         i.Member.User.Username,
		CurrentDate:      currentDate,
		CommandCreatedAt: cmdData.CreatedAt,
		ChannelName:      channelName,
		BotPlatform:      platform.DISCORD,
		BotPlatformID:    i.GuildID,
	}
}

func IsChannelNameNotGiven(optionsLen int) bool {
	return optionsLen < 2
}
