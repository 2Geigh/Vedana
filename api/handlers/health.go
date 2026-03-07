package handlers

import (
	"Vedana/util"
	"net/http"
)

func Health(w http.ResponseWriter, req *http.Request) {
	util.CrossOriginResourceSharing(w, "GET, OPTIONS")
	w.Write([]byte("Connection healthy!\n"))
}
