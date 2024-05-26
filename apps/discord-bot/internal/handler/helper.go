package handler

import (
	"github.com/bwmarrin/discordgo"
)

func checkGuildExist(guilds []*discordgo.Guild, id string) bool {
	for _, s := range guilds {
		if s.ID == id {
			return true
		}
	}
	return false
}
