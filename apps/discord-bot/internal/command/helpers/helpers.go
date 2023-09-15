package helpers

import (
	"log"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

func GetCommandVariables(dS *discordgo.Session, cmdData *models.BotCommand, m *discordgo.MessageCreate) *models.CommandVariable {
	var channelName string
	chData, err := dS.Channel(m.ChannelID)
	if err != nil {
		log.Println("chData Channel Error", err.Error())
		channelName = "None"
	}
	if chData != nil {
		channelName = chData.Name
	}

	return &models.CommandVariable{
		CommandContent:   cmdData.CommandContent,
		UserName:         m.Author.Username,
		CurrentDate:      &m.Timestamp,
		CommandCreatedAt: cmdData.CreatedAt,
		ChannelName:      channelName,
	}
}

func IsChannelNameNotGiven(optionsLen int) bool {
	return optionsLen < 2
}

func ParseMessage(message string) (string, []string) {
	var splitMsg = strings.Split(message, " ")
	var cmdName = splitMsg[0]

	params := splitMsg[1:]

	if !gosenchabot.CheckIfCommand(cmdName) {
		return "", nil
	}

	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}
