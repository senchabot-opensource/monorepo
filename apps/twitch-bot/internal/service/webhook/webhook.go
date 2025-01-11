package webhook

import (
	"net/http"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

type Webhook interface {
	BotJoin(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)
	BotDepart(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)
}

type webhook struct {
	DB            db.Database
	twitchService twitchapi.TwitchService
}

func NewWebhook(db db.Database, twitchService twitchapi.TwitchService) *webhook {
	return &webhook{
		DB:            db,
		twitchService: twitchService,
	}
}
