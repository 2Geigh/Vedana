.DEFAULT_GOAL := build

.PHONY:fmt vet clean mkrdir_bin build
fmt:
		go fmt ./...

vet: fmt
		go vet ./...

clean: vet
		go clean ./...

mkrdir_bin: clean
		rm -rf ./bin
		mkdir -p bin

build: mkrdir_bin
		CGO_ENABLED=0 GOOS=linux go build -o ./bin/main.out main.go
