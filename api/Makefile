.DEFAULT_GOAL := build

.PHONY:fmt vet clean mkdir_bin dependencies build run
fmt:
		go fmt ./...

vet: fmt
		go vet ./...

clean: vet
		go clean ./...

mkdir_bin: clean
		rm -rf ./bin
		mkdir -p bin
	
dependencies: mkdir_bin
		pip install --upgrade pip
		pip install konlpy openkorpos_dic
		java --version
		
build: dependencies
		CGO_ENABLED=0 go build -o ./bin/main.out main.go

run: build
	./bin/main.out
