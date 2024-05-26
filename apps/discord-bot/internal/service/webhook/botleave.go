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

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"gorm.io/gorm"
)

func (ss *webhook) BotLeave(s *discordgo.Session, w http.ResponseWriter, r *http.Request) {
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

	serverId := strings.TrimPrefix(data.Event, "server.leave.")

	if serverId == "" {
		return
	}

	log.Println("LEAVING THE SERVER `" + serverId + "` WITH WEBHOOK")

	err = s.GuildLeave(serverId)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = ss.DB.DeleteServerFromDB(context.Background(), serverId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		log.Println("(BotLeave.Webhook) (DeleteDiscordServer) Error: " + err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
}

func removeAt(slice []string, index int) []string {
	newSlice := make([]string, 0)                 //Create a new slice of type []int and length 0
	newSlice = append(newSlice, slice[:index]...) //Copies the values contained in the old slice to the new slice up to the index (excluded)
	if index != len(slice)-1 {
		newSlice = append(newSlice, slice[index+1:]...) //If the index to be removed was different from the last one, then proceed to copy the following values of the index to the end of the old slice
	}
	return newSlice
}
