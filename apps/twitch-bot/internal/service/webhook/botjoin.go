package webhook

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
)

func (*webhooks) BotJoin(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	var data models.WebhookData
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusBadRequest)
		return
	}

	if data.Token != os.Getenv("WEBHOOK_TOKEN") {
		return
	}

	channel := strings.TrimPrefix(data.Event, "channel.join.")

	if channel == "" {
		return
	}

	// check if channel is not in joinedChannelList
	for _, v := range joinedChannelList {
		if v == channel {
			return
		}
	}

	_ = append(joinedChannelList, channel)
	client.Twitch.Join(channel)

	w.WriteHeader(http.StatusOK)
}
