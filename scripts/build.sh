#!/usr/bin/env bash
# =============================================================================
# scripts/build.sh
# Copies source files from src/ into dist/ (the S3 upload target).
#
# For a vanilla HTML/CSS/JS site there's no compile step —
# dist/ is an exact mirror of src/. If you later add Vite/React,
# replace the rsync below with: npm run build
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

SRC="$ROOT_DIR/src"
DIST="$ROOT_DIR/dist"

echo "▶ Building portfolio…"
echo "  src  → $SRC"
echo "  dist → $DIST"

# Clean dist so removed files don't linger
rm -rf "$DIST"
mkdir -p "$DIST"

# Copy everything from src/ to dist/
# --exclude .DS_Store etc.
rsync -a --exclude='.DS_Store' "$SRC/" "$DIST/"

echo "✓ Build complete — dist/ is ready."
ls -lh "$DIST"
