package webhook

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

func (s *webhook) BotJoin(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
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
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	channelId := strings.TrimPrefix(data.Event, "channel.join.")

	if channelId == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	token := strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:")
	twitchChannel, err := twitch.GetTwitchUserInfo("id", channelId, token)
	if err != nil {
		log.Println("[webhook.BotJoin] GetTwitchUserInfo error:", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	alreadyJoined, err := s.DB.CreateTwitchChannel(context.Background(), channelId, twitchChannel.Login, nil)
	if err != nil {
		log.Printf("[webhook.BotJoin] CreateTwitchChannel channelId: %v, twitchChannel.Login: %v, error: %v", channelId, twitchChannel.Login, err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if alreadyJoined {
		log.Printf("[webhook.BotJoin] i have already joined this channel: %v", twitchChannel.Login)
		w.WriteHeader(http.StatusConflict)
		return
	}

	_ = append(joinedChannelList, channelId)
	log.Println("JOINING TO THE CHANNEL `" + twitchChannel.Login + "` WITH WEBHOOK")
	client.Twitch.Join(twitchChannel.Login)

	w.WriteHeader(http.StatusOK)
}
