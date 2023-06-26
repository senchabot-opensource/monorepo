// https://www.youtube.com/watch?v=dQw4w9WgXcQ
package helpers

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseMessage(t *testing.T) {
	type TestCase struct {
		description    string
		input          string
		expectedCmd    string
		expectedParams []string
	}

	testCase := []TestCase{
		{
			description:    "with just message",
			input:          "abc",
			expectedCmd:    "",
			expectedParams: nil,
		},
		{
			description:    "with a command",
			input:          "!kampus",
			expectedCmd:    "kampus",
			expectedParams: []string{},
		},
		{
			description:    "with wrong mention",
			input:          "@s",
			expectedCmd:    "",
			expectedParams: nil,
		},
		{
			description:    "with just mention",
			input:          "@senchabot",
			expectedCmd:    "",
			expectedParams: nil,
		},
		{
			description:    "a command and its params",
			input:          "!acmd acommand a command content",
			expectedCmd:    "acmd",
			expectedParams: []string{"acommand", "a", "command", "content"},
		},
		{
			description:    "if there is space in params, do not include the space in the params",
			input:          "!acmd a couple of  params",
			expectedCmd:    "acmd",
			expectedParams: []string{"a", "couple", "of", "params"},
		},
		{
			description:    "if the command with its params are in the wrong position, return nothing",
			input:          "blabla !acmd acommand a command content",
			expectedCmd:    "",
			expectedParams: []string(nil),
		},
		{
			description:    "if there is more than one mention, only the first mention is used",
			input:          "!lurk @senchabot and @whimsicallymade",
			expectedCmd:    "lurk",
			expectedParams: []string{"@senchabot"},
		},
		{
			description:    "if there is a mention after the command, the command name should be at index 0, and the remaning words should be treated as params",
			input:          "!acmd @senchabot",
			expectedCmd:    "acmd",
			expectedParams: []string{"@senchabot"},
		},
		{
			description:    "with a mention and a command",
			input:          "@senchabot !acmd",
			expectedCmd:    "acmd",
			expectedParams: []string{"@senchabot"},
		},
	}

	for _, tc := range testCase {
		t.Run(tc.description, func(t *testing.T) {
			cmd, params := ParseMessage(tc.input)

			assert.Equal(t, tc.expectedCmd, cmd, "cmd should be equal")
			assert.Equal(t, tc.expectedParams, params, "params should equal")
		})
	}
}

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
			uniqueArr := MakeUniqueArray(testCase.input)

			assert.Equal(t, testCase.expected, uniqueArr, "they should be equal")
		})
	}
}
