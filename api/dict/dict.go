package dict

import (
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

type Results struct {
	SearchQuery   string   `json:"search_query"`
	SearchResults []Search `json:"search_results"`
}

type Search struct {
	Title   string `xml:"title" json:"title"`
	Total   int    `xml:"total" json:"total"`
	Results []Item `xml:"item" json:"results"`
}

type Item struct {
	Target_code      int        `xml:"target_code" json:"target_code"`
	Word             string     `xml:"word" json:"word"`
	Sup_no           int        `xml:"sup_no" json:"sup_no"`
	Etymology        string     `xml:"origin" json:"etymology"`
	Pronunciation    string     `xml:"pronunciation" json:"pronunciation"`
	Word_grade_level string     `xml:"word_grade" json:"word_grade_level"`
	Word_type        string     `xml:"pos" json:"word_type"`
	Entry_link       string     `xml:"link" json:"entry_link"`
	Sense            EntrySense `xml:"sense" json:"sense"`
}

type EntrySense struct {
	Order      int    `xml:"sense_order" json:"order"`
	Definition string `xml:"definition" json:"definition"`
}

func FetchData(word string, urlWithApiKey string) (Search, error) {

	urlWithQuery := urlWithApiKey + "&q=" + url.QueryEscape(word)

	req, err := http.NewRequest("GET", urlWithQuery, nil)
	if err != nil {
		return Search{}, fmt.Errorf("Failed to create request: %v", err)
	}

	// Mozilla/5.0 is set as the header to mimic web browsers
	// because the Korean government blocks generic headers to block scrapers
	req.Header.Set("User-Agent", "Mozilla/5.0")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return Search{}, fmt.Errorf("Failed to execute request: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return Search{}, fmt.Errorf("HTTP status code: %v", resp.StatusCode)
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return Search{}, fmt.Errorf("Could not read response body: %v", err)
	}

	var xml_data Search
	err = xml.Unmarshal(body, &xml_data)
	if err != nil {
		return Search{}, fmt.Errorf("Could not parse XML: %v", err)
	}

	return xml_data, nil
}
