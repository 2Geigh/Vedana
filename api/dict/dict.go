package dict

import (
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

type TemplateData struct {
	SearchQuery   string
	SearchResults []Search
}

type Search struct {
	Title   string `xml:"title"`
	Total   int    `xml:"total"`
	Results []Item `xml:"item"`
}

type Item struct {
	Target_code      int        `xml:"target_code"`
	Word             string     `xml:"word"`
	Sup_no           int        `xml:"sup_no"`
	Etymology        string     `xml:"origin"`
	Pronunciation    string     `xml:"pronunciation"`
	Word_grade_level string     `xml:"word_grade"`
	Word_type        string     `xml:"pos"`
	Entry_link       string     `xml:"link"`
	Sense            EntrySense `xml:"sense"`
}

type EntrySense struct {
	Order      int    `xml:"sense_order"`
	Definition string `xml:"definition"`
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
