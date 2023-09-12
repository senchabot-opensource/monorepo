package webhook

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
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

	channelId := strings.TrimPrefix(data.Event, "channel.join.")

	if channelId == "" {
		return
	}

	// check if channel is not in joinedChannelList
	for _, v := range joinedChannelList {
		if v == channelId {
			return
		}
	}

	fmt.Println("JOINING TO THE CHANNEL WITH WEBHOOK")

	token := strings.TrimPrefix(os.Getenv("OAUTH"), "oauth:")
	twitchChannel, err := twitch.GetTwitchUserInfo("id", channelId, token)
	if err != nil {
		log.Println("(BotJoin.Webhook): Error: ", err.Error())
		return
	}

	_ = append(joinedChannelList, channelId)
	client.Twitch.Join(twitchChannel.Login)

	w.WriteHeader(http.StatusOK)
}
