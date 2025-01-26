package command

import (
	"context"
	"regexp"

	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

type getCustomVariableContentServiceType func(ctx context.Context, botPlatformId string, varName string) string

func checkCommandContentLengthWithCustomVariable(command_content string, context context.Context, message model.MessageData, getcvcservice getCustomVariableContentServiceType) bool {
	commandContentLen := len(command_content)

	re := regexp.MustCompile(`{([^}]+)}`)
	matches := re.FindAllStringSubmatch(command_content, -1)

	if matches != nil {
		for _, match := range matches {
			variableContent := getcvcservice(context, message.PlatformEntityID, match[1])
			if variableContent != "" {
				commandContentLen -= len(match[1]) + 2
				commandContentLen += len(variableContent)
			}
		}
	}

	if commandContentLen > helper.MaxCommandContentLength {
		return false
	}

	return true
}
