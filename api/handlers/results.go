package handlers

import (
	"Vedana/dict"
	"Vedana/nlp"
	"fmt"
	"html/template"
	"net/http"
	"strings"
)

func Results(w http.ResponseWriter, req *http.Request, apiUrl string) {

	var (
		data = dict.TemplateData{}
	)

	data.SearchQuery = req.FormValue("search_query")

	if data.SearchQuery == "" {
		http.Redirect(w, req, "/", http.StatusSeeOther)
		return
	}

	data.SearchQuery = nlp.RemoveEmojis(data.SearchQuery)

	if strings.Contains(data.SearchQuery, " ") {
		words, err := nlp.ParseSentence(data.SearchQuery)
		if err != nil {
			http.Error(w, fmt.Sprint(err), 500)
			return
		}

		// Send each parsed word to API
		for _, v := range words {
			wordSearchData, err := dict.FetchData(v, apiUrl)
			if err != nil {
				http.Error(w, fmt.Sprint(err), 500)
				return
			}

			data.SearchResults = append(data.SearchResults, wordSearchData)
		}
	} else {
		wordSearchData, err := dict.FetchData(data.SearchQuery, apiUrl)
		if err != nil {
			http.Error(w, fmt.Sprint(err), 500)
			return
		}

		data.SearchResults = append(data.SearchResults, wordSearchData)
	}

	tmpl := template.Must(template.ParseFiles("./templates/results.html"))

	err := tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, fmt.Sprint(err), 500)
		return
	}

}
