package webhook

import (
	"net/http"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
)

type Webhook interface {
	BotJoin(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)
}

type webhooks struct {
}

func NewWebhooks() Webhook {
	return &webhooks{}
}
