package nlp

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"time"
)

func RemoveEmojis(input string) string {
	// This regex pattern matches emojis by their Unicode ranges using the correct escape sequence.
	emojiRegex := regexp.MustCompile(
		`[\x{1F600}-\x{1F64F}` + // Emoticons
			`|\x{1F300}-\x{1F5FF}` + // Miscellaneous Symbols and Pictographs
			`|\x{1F680}-\x{1F6FF}` + // Transport and Map Symbols
			`|\x{1F700}-\x{1F8FF}` + // Alchemical Symbols
			`|\x{1F900}-\x{1F9FF}` + // Supplemental Symbols and Pictographs
			`|\x{2700}-\x{27BF}` + // Dingbats
			`|\x{1F1E6}-\x{1F1FF}]`) // Regional Indicator Symbols

	return emojiRegex.ReplaceAllString(input, "")
}

func ParseSentence(query string) ([]string, error) {

	dir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("Could not get working directory: %v\n", err)
	}
	fmt.Println("Current working directory:", dir)

	filename := "parseSentence.py"
	pythonProgramPath := fmt.Sprintf("%s/nlp/%s", dir, filename)

	// Create parseSentence.py terminal call
	cmd := exec.Command("python3", pythonProgramPath, query)

	// Capture the standard output
	var (
		out    bytes.Buffer
		stderr bytes.Buffer // To capture standard error
	)
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	// Execute command and wait for it to complete
	log.Printf("Calling %s...", filename)
	start := time.Now()
	err = cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("Failed to call %s: %v, stderr: %s", filename, err, stderr.String())
	}
	elapsed := time.Since(start)
	log.Printf("%s call completed in %v\n", filename, elapsed)

	// Get output as string
	output := out.String()

	// Split the output into words by line
	words := strings.Split((strings.TrimSpace(output)), "\n")

	return words, err

}
