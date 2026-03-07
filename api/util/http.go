package util

import (
	"log"
	"net/http"
)

const (
	CLIENT_ORIGIN       = "http://localhost:8081"
	API_URL_WITHOUT_KEY = "https://krdict.korean.go.kr/api/search?key="
)

func CrossOriginResourceSharing(w http.ResponseWriter, options string) {
	w.Header().Add("Access-Control-Allow-Origin", CLIENT_ORIGIN)
	w.Header().Add("Access-Control-Request-Method", options)
}

func LogHttpError(w http.ResponseWriter, err error, errorMessage string, statusCode int) {
	http.Error(w, errorMessage, statusCode)
	log.Printf("%s: %v", errorMessage, err)
}
