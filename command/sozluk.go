package command

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

const (
	gqlUrl    = "https://gql.dev.kamp.us/graphql"
	sozlukUrl = "https://sozluk.dev.kamp.us"
)

type SozlukGraphQLResponse struct {
	Data struct {
		Sozluk struct {
			Term struct {
				Title string `json:"title"`
				Body  struct {
					Raw string `json:"raw"`
				} `json:"body"`
			} `json:"term"`
		} `json:"sozluk"`
	} `json:"data"`
}

func SozlukCommand(params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if check := helper.IsCommandParamsLengthEqualToOne(params); !check {
		cmdResp.Message = config.SozlukCommandInfo
		return &cmdResp, nil
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

	response, err := helper.FetchGraphQL(gqlUrl, query)
	if err != nil {
		return nil, errors.New("Error:" + err.Error())
	}

	var gqlResponse SozlukGraphQLResponse
	err = json.Unmarshal(response, &gqlResponse)
	if err != nil {
		return nil, errors.New("json.Unmarshal error:" + err.Error())
	}

	termTitle := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Title)
	termDesc := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Body.Raw)

	if termDesc == "" {
		cmdResp.Message = fmt.Sprintf(`the term "%s" not found :( it is so easy to open a pr: https://github.com/kamp-us/monorepo/new/dev/packages/sozluk-content/terms`, sozlukTerm)
		return &cmdResp, nil
	}

	if len(termDesc) > 400 {
		termDesc = termDesc[:250]
		cmdResp.Message = termTitle + ": " + termDesc + "... " + sozlukUrl + "/" + sozlukTerm
		return &cmdResp, nil
	}

	cmdResp.Message = termTitle + ": " + termDesc
	return &cmdResp, nil
}
