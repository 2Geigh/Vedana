package util

import "net/http"

const (
	CLIENT_ORIGIN string = "localhost:8081"
)

func CrossOriginResourceSharing(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", CLIENT_ORIGIN)
	w.Header().Add("Access-Control-Request-Method", "OPTIONS, GET")
}
