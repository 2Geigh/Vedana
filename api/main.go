package main

import (
	"Vedana/handlers"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

const (
	API_URL_WITHOUT_KEY = "https://krdict.korean.go.kr/api/search?key="
)

func main() {
	var (
		port = 3000
	)

	fmt.Println("Server starting...")

	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "./templates/index.html")
	})

	http.HandleFunc("/results", func(w http.ResponseWriter, req *http.Request) {
		// Create API query
		godotenv.Load()
		apiKey := os.Getenv("API_KEY")
		apiUrlWithKey := API_URL_WITHOUT_KEY + apiKey

		handlers.Results(w, req, apiUrlWithKey)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("Connection healthy!\n"))
	})

	fmt.Printf("Server accessible at http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
