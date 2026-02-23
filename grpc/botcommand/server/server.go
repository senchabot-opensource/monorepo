package server

import (
	"context"
	"time"

	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/grpc/botcommand"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/platform"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type BotCommandServer struct {
	botcommand.UnimplementedBotCommandServiceServer
	db db.Database
}

func NewBotCommandServer(database db.Database) *BotCommandServer {
	return &BotCommandServer{
		db: database,
	}
}

func (s *BotCommandServer) CreateBotCommand(ctx context.Context, req *botcommand.CreateBotCommandRequest) (*botcommand.CreateBotCommandResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	infoText, err := s.db.CreateBotCommand(
		ctx,
		plat,
		req.GetCommandName(),
		req.GetCommandContent(),
		req.GetBotPlatformId(),
		req.GetCreatedBy(),
	)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to create bot command: %v", err)
	}

	return &botcommand.CreateBotCommandResponse{
		InfoText: func() string {
			if infoText != nil {
				return *infoText
			}
			return ""
		}(),
	}, nil
}

func (s *BotCommandServer) UpdateBotCommand(ctx context.Context, req *botcommand.UpdateBotCommandRequest) (*botcommand.UpdateBotCommandResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	commandName, infoText, err := s.db.UpdateBotCommand(
		ctx,
		plat,
		req.GetCommandName(),
		req.GetCommandContent(),
		req.GetBotPlatformId(),
		req.GetUpdatedBy(),
	)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to update bot command: %v", err)
	}

	return &botcommand.UpdateBotCommandResponse{
		CommandName: func() string {
			if commandName != nil {
				return *commandName
			}
			return ""
		}(),
		InfoText: func() string {
			if infoText != nil {
				return *infoText
			}
			return ""
		}(),
	}, nil
}

func (s *BotCommandServer) GetUserBotCommand(ctx context.Context, req *botcommand.GetUserBotCommandRequest) (*botcommand.GetUserBotCommandResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	cmd, err := s.db.GetUserBotCommand(ctx, plat, req.GetCommandName(), req.GetBotPlatformId())
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "user bot command not found: %v", err)
	}

	return &botcommand.GetUserBotCommandResponse{
		Command: convertModelToProto(cmd),
	}, nil
}

func (s *BotCommandServer) GetCommandList(ctx context.Context, req *botcommand.GetCommandListRequest) (*botcommand.GetCommandListResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	commands, err := s.db.GetCommandList(ctx, plat, req.GetBotPlatformId())
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to get command list: %v", err)
	}

	var protoCommands []*botcommand.BotCommand
	for _, cmd := range commands {
		protoCommands = append(protoCommands, convertModelToProto(cmd))
	}

	return &botcommand.GetCommandListResponse{
		Commands: protoCommands,
	}, nil
}

func (s *BotCommandServer) DeleteBotCommand(ctx context.Context, req *botcommand.DeleteBotCommandRequest) (*botcommand.DeleteBotCommandResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	commandName, infoText, err := s.db.DeleteBotCommand(ctx, plat, req.GetCommandName(), req.GetBotPlatformId())
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete bot command: %v", err)
	}

	return &botcommand.DeleteBotCommandResponse{
		CommandName: func() string {
			if commandName != nil {
				return *commandName
			}
			return ""
		}(),
		InfoText: func() string {
			if infoText != nil {
				return *infoText
			}
			return ""
		}(),
	}, nil
}

func (s *BotCommandServer) GetCommandAlias(ctx context.Context, req *botcommand.GetCommandAliasRequest) (*botcommand.GetCommandAliasResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	commandName, err := s.db.GetCommandAlias(ctx, plat, req.GetCommandAlias(), req.GetBotPlatformId())
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "command alias not found: %v", err)
	}

	return &botcommand.GetCommandAliasResponse{
		CommandName: func() string {
			if commandName != nil {
				return *commandName
			}
			return ""
		}(),
	}, nil
}

func (s *BotCommandServer) CreateCommandAlias(ctx context.Context, req *botcommand.CreateCommandAliasRequest) (*botcommand.CreateCommandAliasResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	infoText, err := s.db.CreateCommandAlias(ctx, plat, req.GetCommandName(), req.GetAliases(), req.GetBotPlatformId(), req.GetCreatedBy())
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to create command alias: %v", err)
	}

	return &botcommand.CreateCommandAliasResponse{
		InfoText: func() string {
			if infoText != nil {
				return *infoText
			}
			return ""
		}(),
	}, nil
}

func (s *BotCommandServer) DeleteCommandAlias(ctx context.Context, req *botcommand.DeleteCommandAliasRequest) (*botcommand.DeleteCommandAliasResponse, error) {
	if req.GetBotPlatformId() == "" {
		return nil, status.Errorf(codes.InvalidArgument, "bot_platform_id is required for commands")
	}

	plat := platform.Platform(req.GetPlatform())

	infoText, err := s.db.DeleteCommandAlias(ctx, plat, req.GetCommandAlias(), req.GetBotPlatformId())
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete command alias: %v", err)
	}

	return &botcommand.DeleteCommandAliasResponse{
		InfoText: func() string {
			if infoText != nil {
				return *infoText
			}
			return ""
		}(),
	}, nil
}

func convertModelToProto(m *model.BotCommand) *botcommand.BotCommand {
	if m == nil {
		return nil
	}

	var createdAt string
	if m.CreatedAt != nil {
		createdAt = m.CreatedAt.Format(time.RFC3339)
	}

	return &botcommand.BotCommand{
		Id:             int32(m.ID),
		CommandName:    m.CommandName,
		CommandContent: m.CommandContent,
		CommandType:    int32(m.CommandType),
		Status:         int32(m.Status),
		CreatedBy: func() string {
			if m.CreatedBy != nil {
				return *m.CreatedBy
			}
			return ""
		}(),
		UpdatedBy: func() string {
			if m.UpdatedBy != nil {
				return *m.UpdatedBy
			}
			return ""
		}(),
		CreatedAt: createdAt,
	}
}
