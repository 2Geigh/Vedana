package handlers

import (
	"Vedana/dict"
	"Vedana/nlp"
	"Vedana/util"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"slices"
	"strings"
	"sync"
)

var (
	API_KEY string
)

func Results(w http.ResponseWriter, req *http.Request) {
	util.CrossOriginResourceSharing(w, "GET, OPTIONS")

	switch req.Method {

	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
		return

	case http.MethodGet:
		// Create dictionary API query
		var (
			query         string       = req.URL.Query().Get("search_query")
			data          dict.Results = dict.Results{SearchQuery: query}
			apiKey        string       = API_KEY
			apiUrlWithKey string       = util.API_URL_WITHOUT_KEY + apiKey
		)

		if strings.TrimSpace(data.SearchQuery) == "" {
			log.Println("Blank request recieved (possible Javascript injection attempt)")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		data.SearchQuery = nlp.RemoveEmojis(data.SearchQuery)
		// data.SearchQuery = nlp.RemovePunctuation(data.SearchQuery)

		if strings.Contains(data.SearchQuery, " ") {
			words, err := nlp.ParseSentence(data.SearchQuery)
			if err != nil {
				util.LogHttpError(w, err, fmt.Sprintf("couldn't parse search query '%s'", data.SearchQuery), http.StatusInternalServerError)
				return
			}

			// Send each unique parsed word to dictionary API
			uniqueWords := uniqueWords(words)
			log.Printf("Querying the following words:\n%v", uniqueWords)

			var wg sync.WaitGroup
			for _, word := range uniqueWords {
				wg.Go(func() {
					wordSearchData, err := dict.FetchData(word, apiUrlWithKey)
					if err != nil {
						util.LogHttpError(w, err, fmt.Sprintf("couldn't fetch dictionary data for '%s'", word), http.StatusInternalServerError)
						return
					}
					data.SearchResults = append(data.SearchResults, wordSearchData)
				})
			}
			wg.Wait()
		} else {
			wordSearchData, err := dict.FetchData(data.SearchQuery, apiUrlWithKey)
			if err != nil {
				http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)
				return
			}

			data.SearchResults = append(data.SearchResults, wordSearchData)
		}

		resultsJson, err := json.Marshal(data)
		if err != nil {
			util.LogHttpError(w, err, "couldn't marshall search result data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		statusCode, err := w.Write(resultsJson)
		if err != nil {
			util.LogHttpError(w, err, "couldn't write search result data JSON to response", statusCode)
			return
		}

	}
}

func uniqueWords(words []string) []string {
	var (
		nonRedundantWords []string = []string{}
	)

	for _, word := range words {
		if !slices.Contains(nonRedundantWords, word) {
			nonRedundantWords = append(nonRedundantWords, word)
		}
	}

	return nonRedundantWords
}
