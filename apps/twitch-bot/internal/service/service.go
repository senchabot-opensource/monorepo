package service

import (
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service/database"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service/database/postgresql"
)

type Services struct {
	DB database.Database
}

func NewServices() Services {
	dbService := postgresql.NewPostgreSQL()

	return Services{
		DB: dbService,
	}
}
