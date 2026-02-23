package main

import (
	"log"
	"net"

	"github.com/senchabot-opensource/monorepo/db/postgresql"
	"github.com/senchabot-opensource/monorepo/grpc/botcommand"
	"github.com/senchabot-opensource/monorepo/grpc/botcommand/server"
	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	database := postgresql.New()

	grpcServer := grpc.NewServer()
	botcommand.RegisterBotCommandServiceServer(grpcServer, server.NewBotCommandServer(database))

	log.Printf("Bot Command Server starting on port %s", port)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
