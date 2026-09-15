#!/bin/bash
# One-time media migration: upload existing local media to the propagenda-media
# R2 bucket, preserving a predictable key structure. Run once (TASK-11.5).
set -euo pipefail
cd "$(dirname "$0")/.."

BUCKET="propagenda-media"
COUNT=0

upload_dir() {
  local src_dir="$1"
  local key_prefix="$2"
  find "$src_dir" -type f | while read -r file; do
    rel="${file#"$src_dir"/}"
    key="${key_prefix}/${rel}"
    echo "-> ${key}"
    npx wrangler r2 object put "${BUCKET}/${key}" --file "$file" --remote 2>&1 | grep -v "^$" | tail -1
  done
}

echo "=== case-study images (public/images/work) ==="
upload_dir "public/images/work" "case-study-media"

echo "=== client logos (public/images/clients) ==="
upload_dir "public/images/clients" "clients"

echo "=== services hub previews (public/images/portfolio) ==="
upload_dir "public/images/portfolio" "portfolio"

echo "=== videos (public/videos) ==="
upload_dir "public/videos" "videos"

echo "=== video posters (public/images/video-posters) ==="
upload_dir "public/images/video-posters" "video-posters"

echo "Done."
