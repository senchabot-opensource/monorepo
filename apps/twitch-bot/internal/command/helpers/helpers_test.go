package helpers

import (
	"testing"
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

			if !elementsEqual(uniqueArr, testCase.expected) {
				t.Errorf("Array elements are not equal: uniqueArray: %s, expected: %s", uniqueArr, testCase.expected)
			}
		})
	}
}

func elementsEqual(arr []string, arr2 []string) bool {
	if len(arr) != len(arr2) {
		return false
	}

	for i := range arr {
		if arr[i] != arr2[i] {
			return false
		}
	}
	return true
}
