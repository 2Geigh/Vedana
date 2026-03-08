package main

import (
	"Vedana/handlers"
	"Vedana/util"
	"fmt"
	"log"
	"net/http"
)

const (
	PORT = 3002
)

func main() {

	fmt.Println("Server starting...")

	// Explicitly map keys to their target variables
	err := util.LoadEnv(
		util.EnvPair{Key: "API_KEY", Value: &handlers.API_KEY},
		util.EnvPair{Key: "CLIENT_ORIGIN", Value: &util.CLIENT_ORIGIN},
	)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("API_KEY:", handlers.API_KEY)
	fmt.Println("CLIENT_ORIGIN:", util.CLIENT_ORIGIN)

	http.HandleFunc("/", handlers.Root)
	http.HandleFunc("/health", handlers.Health)
	http.HandleFunc("/results", handlers.Results)

	fmt.Printf("Server accessible at http://localhost:%d\n", PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), nil))
}
