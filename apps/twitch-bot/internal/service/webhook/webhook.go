package webhook

import (
	"net/http"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/db"
)

type Webhook interface {
	BotJoin(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)
	BotDepart(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)
}

type webhook struct {
	DB db.Database
}

func NewWebhook(database db.Database) Webhook {
	return &webhook{DB: database}
}
