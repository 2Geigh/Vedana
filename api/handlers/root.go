package handlers

import (
	"Vedana/util"
	"net/http"
)

func Root(w http.ResponseWriter, req *http.Request) {
	util.CrossOriginResourceSharing(w, "GET, OPTIONS")
	http.ServeFile(w, req, "./templates/index.html")
}
