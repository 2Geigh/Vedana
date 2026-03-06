# Build stage
FROM golang:latest AS build
WORKDIR /app
COPY . /app
RUN go build -o ./bin

# Production stage
# Production stage
FROM alpine:latest AS prod
RUN apk add --no-cache python3
WORKDIR /app
COPY --from=build /app/bin/KDict ./
COPY src/sentenceParsing/ ./src/sentenceParsing/
COPY templates/ ./templates/
COPY static/ ./static/
COPY .env ./
EXPOSE 3000
CMD ["./KDict"]
