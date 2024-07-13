package webhook

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/service/twitch"
	"gorm.io/gorm"
)

func (s *webhook) BotDepart(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	var data model.WebhookData
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusBadRequest)
		return
	}

	if data.Token != os.Getenv("WEBHOOK_TOKEN") {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	channelId := strings.TrimPrefix(data.Event, "channel.depart.")

	if channelId == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	twitchChannel, err := twitch.GetTwitchUserInfo("id", channelId)
	if err != nil {
		log.Println("[webhook.BotDepart] GetTwitchUserInfo error:", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	deleted, err := s.DB.DeleteTwitchChannel(context.Background(), channelId, nil)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		log.Println("[webhook.BotDepart] DeleteTwitchChannel error:", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if !deleted {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Println("DEPART THE CHANNEL `" + twitchChannel.Login + "` WITH WEBHOOK")
	client.Twitch.Depart(twitchChannel.Login)

	w.WriteHeader(http.StatusOK)
}
