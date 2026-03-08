package util

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type EnvPair struct {
	Key   string  //.env key
	Value *string //variable pointer
}

func LoadEnv(pairs ...EnvPair) error {
	err := godotenv.Load()
	if err != nil {
		return fmt.Errorf("couldn't read .env: %w", err)
	}

	for _, pair := range pairs {
		val := os.Getenv(pair.Key)
		if val == "" {
			fmt.Printf("Warning: Environment variable %s is not set\n", pair.Key)
		}
		if pair.Value != nil {
			*pair.Value = val
		}
	}

	return nil
}
