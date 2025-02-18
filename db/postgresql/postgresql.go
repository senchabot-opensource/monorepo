package postgresql

import (
	"log"
	"os"

	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/model"
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
		log.Println("failed to connect database. error:", err.Error())
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Println("error while getting generic database object. error:", err.Error())
	}

	sqlDB.SetMaxIdleConns(1)
	sqlDB.SetMaxOpenConns(1)

	db.AutoMigrate(&model.BotCommandVariable{})
	if err := CreateTwitchCommunities(db); err != nil {
		log.Println("failed to create twitch communities. error:", err.Error())
	}

	//db.Where("1 = 1").Delete(&model.TwitchCommunityMember{})
	//db.Where("1 = 1").Delete(&model.TwitchCommunity{})
	//db.Where("1 = 1").Delete(&model.TwitchCommunitySubscription{})

	return &postgresql{
		DB: db,
	}
}

func CreateTwitchCommunities(db *gorm.DB) error {
	err := db.AutoMigrate(&model.TwitchCommunity{})
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&model.TwitchCommunityMember{})
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&model.TwitchCommunitySubscription{})
	if err != nil {
		return err
	}

	return nil
}
