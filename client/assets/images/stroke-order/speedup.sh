#!/bin/bash

SPEED=0.125
CONTRAST=1.5
COLORKEY_SIM=0.9
PAUSE_DURATION=0.0
TARGET_FPS=30
OUTPUT_DIR="./fast"
JSON_FILE="${OUTPUT_DIR}/durations.json"

mkdir -p "$OUTPUT_DIR"
echo "{" > "$JSON_FILE"

VISUALS="format=gray,eq=contrast=${CONTRAST},colorkey=white:${COLORKEY_SIM}:0"
TIMING="fps=${TARGET_FPS},setpts=${SPEED}*PTS"

PAUSE_FILTER=""
if (( $(echo "$PAUSE_DURATION > 0" | bc -l) )); then
    PAUSE_FILTER=",tpad=stop_mode=clone:stop_duration=${PAUSE_DURATION}"
fi

files=(*.gif)
total=${#files[@]}

for (( i=0; i<$total; i++ )); do
    f="${files[$i]}"
    out="fast_${f}"

    ffmpeg -y -v error -i "$f" -filter_complex \
        "[0:v]${VISUALS},${TIMING}[v]; \
         [v]split=2[main][first]; \
         [first]select='eq(n,0)'[f0]; \
         [main]select='gt(n,0)'[rest]; \
         [rest][f0]concat=n=2:v=1:a=0${PAUSE_FILTER}[final]; \
         [final]split[inner_a][inner_b]; \
         [inner_a]palettegen=reserve_transparent=1[p]; \
         [inner_b][p]paletteuse" \
        "${OUTPUT_DIR}/${out}"

    dur_sec=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${OUTPUT_DIR}/${out}")
    dur_ms=$(echo "$dur_sec * 1000 / 1" | bc)

    if [ $i -eq $((total - 1)) ]; then
        echo "  \"${out}\": ${dur_ms}" >> "$JSON_FILE"
    else
        echo "  \"${out}\": ${dur_ms}," >> "$JSON_FILE"
    fi
done

echo "}" >> "$JSON_FILE"