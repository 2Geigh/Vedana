package main

import (
	"Vedana/handlers"
	"fmt"
	"log"
	"net/http"
)

func main() {
	var (
		port = 3000
	)

	fmt.Println("Server starting...")

	http.HandleFunc("/", handlers.Root)
	http.HandleFunc("/health", handlers.Health)
	http.HandleFunc("/results", handlers.Results)

	fmt.Printf("Server accessible at http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
