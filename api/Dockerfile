# --- Stage 1: Build & Compile ---
FROM golang:1.25.2-bookworm AS build
WORKDIR /app

# MeCab compilation
RUN apt-get update && apt-get install -y \
    curl g++ make automake autoconf libtool && \
    rm -rf /var/lib/apt/lists/*

RUN set -ex; \
    GUESS_URL='https://raw.githubusercontent.com/gcc-mirror/gcc/master/config.guess'; \
    SUB_URL='https://raw.githubusercontent.com/gcc-mirror/gcc/master/config.sub'; \
    \
    # 1. Install MeCab Core
    curl -LO https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz && \
    tar zxf mecab-0.996-ko-0.9.2.tar.gz && cd mecab-0.996-ko-0.9.2 && \
    curl -L -o config.guess "$GUESS_URL" && curl -L -o config.sub "$SUB_URL" && \
    ./configure && make && make install && \
    \
    # 2. IMPORTANT: Update linker cache so dict-index can find libmecab.so.2
    ldconfig && \
    \
    cd ..; \
    \
    # 3. Install MeCab Dictionary
    curl -LO https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz && \
    tar zxf mecab-ko-dic-2.1.1-20180720.tar.gz && cd mecab-ko-dic-2.1.1-20180720 && \
    curl -L -o config.guess "$GUESS_URL" && curl -L -o config.sub "$SUB_URL" && \
    ./autogen.sh && ./configure && make && make install

# 2. Build go project
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Using CGO_ENABLED=1 because MeCab is a C library
RUN CGO_ENABLED=1 GOOS=linux go build -o /main.out main.go

# --- Stage 2: Production ---
FROM debian:bookworm-slim AS prod

# Install only Runtime Rependencies (No compilers)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    default-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Copy Compiled MeCab files from build stage
COPY --from=build /usr/local/lib/libmecab* /usr/local/lib/
COPY --from=build /usr/local/bin/mecab* /usr/local/bin/
COPY --from=build /usr/local/lib/mecab /usr/local/lib/mecab
COPY --from=build /usr/local/etc/mecabrc /usr/local/etc/mecabrc
RUN ldconfig

# Set Environment
ENV JAVA_HOME=/usr/lib/jvm/default-java
RUN pip3 install konlpy openkorpos_dic --break-system-packages

WORKDIR /app
COPY --from=build /main.out .
COPY .env .
COPY nlp/ ./nlp/
COPY dict/ ./dict/
COPY static/ ./static/
COPY templates/ ./templates/
# Note: dict/nlp/handlers are likely compiled into main.out; 
# only copy if they contain non-code assets (e.g., .txt or .json)

EXPOSE 3000
CMD ["./main.out"]