package webhook

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
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

	var data models.WebhookData
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
		return
	}

	fmt.Println("DEPART THE CHANNEL WITH WEBHOOK")

	token := strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:")
	twitchChannel, err := twitch.GetTwitchUserInfo("id", channelId, token)
	if err != nil {
		log.Println("(BotDepart.Webhook): Error: ", err.Error())
		return
	}

	client.Twitch.Depart(twitchChannel.Login)
	deleted, err := s.DB.DeleteTwitchChannel(context.Background(), channelId, nil)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		log.Println("(BotDepart.Webhook) (DeleteTwitchChannel) Error: " + err.Error())
		return
	}

	if !deleted {
		w.WriteHeader(http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusOK)
}
