package handler

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/event"
)

func (h *handler) Ready(token string) {
	h.discordClient.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		//	guilds := s.State.Guilds

		//botAppID := os.Getenv("CLIENT_ID")

		//for i, v := range guilds {
		//fmt.Println(i, botAppID, v.ID, v.Name)
		//cmds, err := discordClient.ApplicationCommands(botAppID, "")
		//if err != nil {
		//fmt.Println("err", err.Error())
		//}
		//fmt.Println("CMDS LEN", len(cmds))
		//for i, c := range cmds {
		//fmt.Println(i, c)
		//err := s.ApplicationCommandDelete(botAppID, c.GuildID, c.ID)
		//if err != nil {
		//log.Fatalf("Cannot delete slash command %q: %v", c.Name, err)
		//}
		//}
		//}
		go event.CheckLiveStreamScheduledEvents(s, token)

		fmt.Println("Bot is ready. Logged in as:", s.State.User.Username)
	})
}
