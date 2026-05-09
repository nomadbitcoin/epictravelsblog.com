#!/bin/bash
# Import markdown files from recovered-content/ into the Astro site.
#
# Usage: ./import-content.sh
#
# Copies all .md files from recovered-content/ to site/src/content/posts/.
# Validates that each file has the required frontmatter fields.
# Skips files that already exist in the destination (use -f to overwrite).

set -euo pipefail

SRC_DIR="recovered-content"
DEST_DIR="site/src/content/posts"

FORCE=false
[[ "${1:-}" == "-f" ]] && FORCE=true

if [ ! -d "$SRC_DIR" ]; then
  echo "Error: $SRC_DIR directory not found"
  exit 1
fi

mkdir -p "$DEST_DIR"

REQUIRED_FIELDS=("title" "description" "date" "category")

count=0
skipped=0
errors=0

for file in "$SRC_DIR"/*.md; do
  [ -f "$file" ] || continue

  filename=$(basename "$file")
  dest="$DEST_DIR/$filename"

  # Skip if exists and not forcing
  if [ -f "$dest" ] && [ "$FORCE" = false ]; then
    echo "SKIP  $filename (already exists, use -f to overwrite)"
    skipped=$((skipped + 1))
    continue
  fi

  # Validate frontmatter
  missing=""
  for field in "${REQUIRED_FIELDS[@]}"; do
    if ! grep -q "^${field}:" "$file"; then
      missing="$missing $field"
    fi
  done

  if [ -n "$missing" ]; then
    echo "ERROR $filename — missing frontmatter:$missing"
    errors=$((errors + 1))
    continue
  fi

  cp "$file" "$dest"
  echo "OK    $filename"
  count=$((count + 1))
done

echo ""
echo "Imported: $count | Skipped: $skipped | Errors: $errors"
echo ""
if [ $count -gt 0 ]; then
  echo "Run 'cd site && npm run dev' to preview."
fi
