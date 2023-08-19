package gosenchabot_test

import (
	"testing"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/stretchr/testify/assert"
)

func TestMakeUniqueArray(t *testing.T) {
	type TestCase struct {
		description string
		input       []string
		expected    []string
	}

	testCases := []TestCase{
		{
			description: "with one element",
			input:       []string{"abc"},
			expected:    []string{"abc"},
		},
		{
			description: "with the same elements",
			input:       []string{"abc", "def", "abc"},
			expected:    []string{"abc", "def"},
		},
		{

			description: "with the unique elements",
			input:       []string{"abc", "def", "ghi"},
			expected:    []string{"abc", "def", "ghi"},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.description, func(t *testing.T) {
			uniqueArr := gosenchabot.MakeUniqueArray(testCase.input)

			assert.Equal(t, testCase.expected, uniqueArr, "they should be equal")
		})
	}
}
