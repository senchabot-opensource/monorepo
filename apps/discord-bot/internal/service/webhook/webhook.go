package webhook

import (
	"net/http"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/db"
)

type Webhook interface {
	BotLeave(s *discordgo.Session, w http.ResponseWriter, r *http.Request)
}

type webhook struct {
	DB db.Database
}

func NewWebhook(database db.Database) Webhook {
	return &webhook{DB: database}
}
