package commands

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/senchabot-dev/monorepo/packages/common/helpers"
)

const (
	gqlUrl    = "https://gql.dev.kamp.us/graphql"
	sozlukUrl = "https://sozluk.dev.kamp.us"

	SOZLUK_COMMAND_INFO = "For example: !sozluk [term-name]"
)

func SozlukCommand(params []string) (string, error) {
	if check := helpers.IsCommandParamsLengthEqualToOne(params); !check {
		return SOZLUK_COMMAND_INFO, nil
	}
	var sozlukTerm = strings.ToLower(strings.TrimSpace(params[0]))

	query := fmt.Sprintf(`{
				sozluk {
					term(id: "%s") {
						title,
						body {
							raw
						}
					}
				}
			}`, sozlukTerm)

	response, err := helpers.FetchGraphQL(gqlUrl, query)
	if err != nil {
		return "", errors.New("Error:" + err.Error())
	}

	var gqlResponse helpers.SozlukGraphQLResponse
	err = json.Unmarshal(response, &gqlResponse)
	if err != nil {
		return "", errors.New("json.Unmarshal error:" + err.Error())
	}

	termTitle := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Title)
	termDesc := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Body.Raw)

	if termDesc == "" {
		return fmt.Sprintf(`the term "%s" not found`, sozlukTerm), nil
	}

	if len(termDesc) > 400 {
		termDesc = termDesc[:250]

		return termTitle + ": " + termDesc + "... " + sozlukUrl + "/" + sozlukTerm, nil
	}

	return termTitle + ": " + termDesc, nil
}
