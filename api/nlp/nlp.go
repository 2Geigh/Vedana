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

func RemoveNonAlphaNumHangulCJK(input string) string {
	// Matches any character that is NOT:
	// - ASCII letters (a-zA-Z)
	// - numbers (0-9)
	// - Hangul (한글) (U+AC00–U+D7AF)
	// - CJK Unified Ideographs (漢字) (U+4E00–U+9FFF)
	nonAllowed := regexp.MustCompile(`[^a-zA-Z0-9\x{AC00}-\x{D7AF}\x{4E00}-\x{9FFF}]+`)

	return nonAllowed.ReplaceAllString(input, " ")
}

func ParseSentence(query string) ([]string, error) {

	dir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("Could not get working directory: %v\n", err)
	}
	// fmt.Println("Current working directory:", dir)

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
