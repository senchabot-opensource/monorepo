package alert

import (
	"log"

	"github.com/bwmarrin/discordgo"
)

func SendDMToGuildOwner(dS *discordgo.Session, guildId string, msgContent string) bool {
	guild, err := dS.Guild(guildId)
	if err != nil {
		log.Println("[SendDMToGuildOwner] error getting guild:", err)
		return false
	}

	dmCh, err := dS.UserChannelCreate(guild.OwnerID)
	if err != nil {
		log.Println("[SendDMToGuildOwner] error creating user (private) channel:", err)
		return false
	}

	msgContent = msgContent + " Guild (Server) Name: " + guild.Name + ", ID: " + guild.ID

	_, err = dS.ChannelMessageSend(dmCh.ID, msgContent)
	if err != nil {
		log.Println("[SendDMToGuildOwner] error sending DM message:", err)
		return false
	}

	return true
}
