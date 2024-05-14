package postgresql

import (
	"os"

	"github.com/senchabot-opensource/monorepo/db"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type postgresql struct {
	DB *gorm.DB
}

func New() db.Database {
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})

	if err != nil {
		panic("failed to connect database")
	}
	return &postgresql{
		DB: db,
	}
}
