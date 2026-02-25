package client

import (
	"context"

	"github.com/senchabot-opensource/monorepo/grpc/botcommand"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type BotCommandClient struct {
	conn *grpc.ClientConn
	svc  botcommand.BotCommandServiceClient
}

func NewBotCommandClient(address string) (*BotCommandClient, error) {
	conn, err := grpc.NewClient(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	return &BotCommandClient{
		conn: conn,
		svc:  botcommand.NewBotCommandServiceClient(conn),
	}, nil
}

func (c *BotCommandClient) Close() error {
	return c.conn.Close()
}

func (c *BotCommandClient) CreateBotCommand(ctx context.Context, platform, commandName, commandContent, botPlatformId, createdBy string) (*botcommand.CreateBotCommandResponse, error) {
	return c.svc.CreateBotCommand(ctx, &botcommand.CreateBotCommandRequest{
		Platform:       platform,
		CommandName:    commandName,
		CommandContent: commandContent,
		BotPlatformId:  botPlatformId,
		CreatedBy:      createdBy,
	})
}

func (c *BotCommandClient) UpdateBotCommand(ctx context.Context, platform, commandName, commandContent, botPlatformId, updatedBy string) (*botcommand.UpdateBotCommandResponse, error) {
	return c.svc.UpdateBotCommand(ctx, &botcommand.UpdateBotCommandRequest{
		Platform:       platform,
		CommandName:    commandName,
		CommandContent: commandContent,
		BotPlatformId:  botPlatformId,
		UpdatedBy:      updatedBy,
	})
}

func (c *BotCommandClient) GetGlobalBotCommand(ctx context.Context, commandName string) (*botcommand.BotCommand, error) {
	resp, err := c.svc.GetGlobalBotCommand(ctx, &botcommand.GetGlobalBotCommandRequest{
		CommandName: commandName,
	})
	if err != nil {
		return nil, err
	}
	return resp.GetCommand(), nil
}

func (c *BotCommandClient) GetUserBotCommand(ctx context.Context, platform, commandName, botPlatformId string) (*botcommand.BotCommand, error) {
	resp, err := c.svc.GetUserBotCommand(ctx, &botcommand.GetUserBotCommandRequest{
		Platform:      platform,
		CommandName:   commandName,
		BotPlatformId: botPlatformId,
	})
	if err != nil {
		return nil, err
	}
	return resp.GetCommand(), nil
}

func (c *BotCommandClient) GetCommandList(ctx context.Context, platform, botPlatformId string) ([]*botcommand.BotCommand, error) {
	resp, err := c.svc.GetCommandList(ctx, &botcommand.GetCommandListRequest{
		Platform:      platform,
		BotPlatformId: botPlatformId,
	})
	if err != nil {
		return nil, err
	}
	return resp.GetCommands(), nil
}

func (c *BotCommandClient) DeleteBotCommand(ctx context.Context, platform, commandName, botPlatformId string) (*botcommand.DeleteBotCommandResponse, error) {
	return c.svc.DeleteBotCommand(ctx, &botcommand.DeleteBotCommandRequest{
		Platform:      platform,
		CommandName:   commandName,
		BotPlatformId: botPlatformId,
	})
}

func (c *BotCommandClient) GetCommandAlias(ctx context.Context, platform, commandAlias, botPlatformId string) (string, error) {
	resp, err := c.svc.GetCommandAlias(ctx, &botcommand.GetCommandAliasRequest{
		Platform:      platform,
		CommandAlias:  commandAlias,
		BotPlatformId: botPlatformId,
	})
	if err != nil {
		return "", err
	}
	return resp.GetCommandName(), nil
}

func (c *BotCommandClient) CreateCommandAlias(ctx context.Context, platform, commandName string, aliases []string, botPlatformId, createdBy string) (*botcommand.CreateCommandAliasResponse, error) {
	return c.svc.CreateCommandAlias(ctx, &botcommand.CreateCommandAliasRequest{
		Platform:      platform,
		CommandName:   commandName,
		Aliases:       aliases,
		BotPlatformId: botPlatformId,
		CreatedBy:     createdBy,
	})
}

func (c *BotCommandClient) DeleteCommandAlias(ctx context.Context, platform, commandAlias, botPlatformId string) (*botcommand.DeleteCommandAliasResponse, error) {
	return c.svc.DeleteCommandAlias(ctx, &botcommand.DeleteCommandAliasRequest{
		Platform:      platform,
		CommandAlias:  commandAlias,
		BotPlatformId: botPlatformId,
	})
}
