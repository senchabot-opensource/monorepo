package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

type acommandVariableCommandServiceType func(ctx context.Context, varName string, varContent string, botPlatformId string, createdBy string) error
type gcommandVariableCommandServiceType func(ctx context.Context, varName string, botPlatformId string) (*model.BotCommandVariable, error)
type ucommandVariableCommandServiceType func(ctx context.Context, varName string, varContent string, botPlatformId string, updatedBy string) error
type dcommandVariableCommandServiceType func(ctx context.Context, varName string, botPlatformId string, deletedBy string) error
type lcommandVariableCommandServiceType func(ctx context.Context, botPlatformId string) ([]*model.BotCommandVariable, error)

func AddCommandVariableCommand(ctx context.Context, acmdvarservice acommandVariableCommandServiceType, gcmdvarservice gcommandVariableCommandServiceType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	if len(params) < 2 {
		return &model.CommandResponse{Message: "Usage: !acmdvar <variable_name> <variable_content>"}, nil
	}

	varName := strings.TrimSpace(params[0])
	varContent := strings.TrimSpace(strings.Join(params[1:], " "))

	if !helper.IsValidVariableName(varName) {
		return &model.CommandResponse{Message: "Variable name must start with a letter and can only contain letters, numbers, and underscores"}, nil
	}

	// Check if variable already exists
	_, err := gcmdvarservice(ctx, varName, message.PlatformEntityID)
	if err == nil {
		return &model.CommandResponse{Message: fmt.Sprintf("Variable '%s' already exists", varName)}, nil
	}

	err = acmdvarservice(ctx, varName, varContent, message.PlatformEntityID, message.UserName)
	if err != nil {
		return &model.CommandResponse{Message: "Failed to create command variable"}, nil
	}

	return &model.CommandResponse{Message: fmt.Sprintf("Command variable '%s' has been created", varName)}, nil
}

func UpdateCommandVariableCommand(ctx context.Context, ucmdvarservice ucommandVariableCommandServiceType, gcmdvarservice gcommandVariableCommandServiceType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	if len(params) < 2 {
		return &model.CommandResponse{Message: "Usage: !ucmdvar <variable_name> <new_content>"}, nil
	}

	varName := strings.TrimSpace(params[0])
	newContent := strings.TrimSpace(strings.Join(params[1:], " "))

	// Check if variable exists
	_, err := gcmdvarservice(ctx, varName, message.PlatformEntityID)
	if err != nil {
		return &model.CommandResponse{Message: fmt.Sprintf("Variable '%s' not found", varName)}, nil
	}

	err = ucmdvarservice(ctx, varName, newContent, message.PlatformEntityID, message.UserName)
	if err != nil {
		return &model.CommandResponse{Message: "Failed to update command variable"}, nil
	}

	return &model.CommandResponse{Message: fmt.Sprintf("Command variable '%s' has been updated", varName)}, nil
}

func DeleteCommandVariableCommand(ctx context.Context, dcmdvarservice dcommandVariableCommandServiceType, gcmdvarservice gcommandVariableCommandServiceType, message model.MessageData, commandName string, params []string) (*model.CommandResponse, error) {
	if len(params) < 1 {
		return &model.CommandResponse{Message: "Usage: !dcmdvar <variable_name>"}, nil
	}

	varName := strings.TrimSpace(params[0])

	// Check if variable exists
	_, err := gcmdvarservice(ctx, varName, message.PlatformEntityID)
	if err != nil {
		return &model.CommandResponse{Message: fmt.Sprintf("Variable '%s' not found", varName)}, nil
	}

	err = dcmdvarservice(ctx, varName, message.PlatformEntityID, message.UserName)
	if err != nil {
		return &model.CommandResponse{Message: "Failed to delete command variable"}, nil
	}

	return &model.CommandResponse{Message: fmt.Sprintf("Command variable '%s' has been deleted", varName)}, nil
}

func ListCommandVariablesCommand(ctx context.Context, lcmdvarservice lcommandVariableCommandServiceType, message model.MessageData) (*model.CommandResponse, error) {
	variables, err := lcmdvarservice(ctx, message.PlatformEntityID)
	if err != nil {
		return &model.CommandResponse{Message: "Failed to retrieve command variables"}, nil
	}

	if len(variables) == 0 {
		return &model.CommandResponse{Message: "No command variables found"}, nil
	}

	var response strings.Builder
	response.WriteString("Command variables: ")

	for i, v := range variables {
		if i > 0 {
			response.WriteString(", ")
		}
		response.WriteString(fmt.Sprintf("%s={%s}", v.VariableName, v.VariableContent))
	}

	return &model.CommandResponse{Message: response.String()}, nil
}
