# Build stage
FROM golang AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /main.out main.go

# Production stage
FROM debian:stable-slim AS prod

# Install Python, MeCab compilation tools, and dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    g++ \
    make \
    automake \
    autoconf \
    libtool \
    && rm -rf /var/lib/apt/lists/*

# Install Konlpy
RUN pip3 install konlpy --break-system-packages

# Compile and install MeCab and MeCab Dictionary for ARM64/AMD64 compatibility
RUN set -ex; \
    GUESS_URL='https://github.com/gcc-mirror/gcc/raw/master/config.guess'; \
    SUB_URL='https://github.com/gcc-mirror/gcc/raw/master/config.sub'; \
    \
    curl -LO https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz; \
    tar zxf mecab-0.996-ko-0.9.2.tar.gz; \
    cd mecab-0.996-ko-0.9.2; \
    curl -L -o config.guess "$GUESS_URL"; \
    curl -L -o config.sub "$SUB_URL"; \
    chmod +x config.guess config.sub; \
    ./configure; \
    make; \
    make install; \
    ldconfig; \
    cd ..; \
    \
    curl -LO https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz; \
    tar zxf mecab-ko-dic-2.1.1-20180720.tar.gz; \
    cd mecab-ko-dic-2.1.1-20180720; \
    curl -L -o config.guess "$GUESS_URL"; \
    curl -L -o config.sub "$SUB_URL"; \
    chmod +x config.guess config.sub; \
    ./autogen.sh; \
    ./configure; \
    make; \
    make install; \
    cd ..; \
    rm -rf mecab-*

WORKDIR /app

# Transfer compiled binary and static assets
COPY --from=build /main.out ./main.out
COPY /dict ./dict
COPY /handlers ./handlers
COPY /dict ./dict
COPY /nlp ./nlp
COPY static/ ./static/
COPY templates/ ./templates/

EXPOSE 3000
CMD ["./main.out"]