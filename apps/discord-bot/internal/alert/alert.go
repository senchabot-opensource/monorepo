package alert

import (
	"log"

	"github.com/bwmarrin/discordgo"
)

func SendDMToGuildOwner(dS *discordgo.Session, guildId string, msgContent string) {
	guild, err := dS.Guild(guildId)
	if err != nil {
		log.Println("[SendDMToGuildOwner] error getting guild:", err)
		return
	}

	dmCh, err := dS.UserChannelCreate(guild.OwnerID)
	if err != nil {
		log.Println("[SendDMToGuildOwner] error creating user (private) channel:", err)
		return
	}

	msgContent = "Hello, this is an automated message from Senchabot for your guild (server) **" + guild.Name + "** (ID: " + guild.ID + ").\n\n" + msgContent

	_, err = dS.ChannelMessageSend(dmCh.ID, msgContent)
	if err != nil {
		log.Println("[SendDMToGuildOwner] error sending DM message:", err)
	}
}
