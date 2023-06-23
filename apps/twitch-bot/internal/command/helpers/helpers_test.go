package helpers

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseMessage(t *testing.T) {
	type TestCase struct {
		description string
		input       string
		expected    string
	}

	testCases := []TestCase{
		{
			description: "with just message",
			input:       "abc",
			expected:    "",
		},
		{
			description: "with a command",

			input:    "!kampus",
			expected: "discord.gg/kampus • github.com/kamp-us",
		},
		{

			description: "with a mention and a command",
			input:       "@senchabot !kampus",
			expected:    "discord.gg/kampus • github.com/kamp-us",
		},
		{

			description: "with a command and a mention",
			input:       "!kampus @senchabot",
			expected:    "discord.gg/kampus • github.com/kamp-us @senchabot",
		},
		{

			description: "with wrong mention",
			input:       "@s",
			expected:    "",
		},
		{

			description: "with just mention",
			input:       "@senchabot",
			expected:    "",
		},
		//{

		//	description: "with a command and its params",
		//	input:       "!acmd acommand a command content",
		//	expected:    "",
		//},

		//{

		//	description: "with a command and params but some of params are just space",
		//	input:       "!acmd  a couple of params",
		//	expected:    "",
		//},
	}

	for _, testCase := range testCases {
		t.Run(testCase.description, func(t *testing.T) {

			// test params cannot be a space or empty value
			// expectedCmd, expectedParams = ParseMessage(testCase.input)
			ParseMessage(testCase.input)
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

			input:    []string{"abc", "def", "abc"},
			expected: []string{"abc", "def"},
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
