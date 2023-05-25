package service

import (
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service/database"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service/database/postgresql"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service/webhook"
)

type Services struct {
	DB      database.Database
	Webhook webhook.Webhook
}

func NewServices() Services {
	dbService := postgresql.NewPostgreSQL()
	whService := webhook.NewWebhooks()

	return Services{
		DB:      dbService,
		Webhook: whService,
	}
}
