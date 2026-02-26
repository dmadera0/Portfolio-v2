#!/usr/bin/env bash
# =============================================================================
# scripts/deploy.sh
# Builds the portfolio and deploys it to AWS S3 + CloudFront.
#
# Prerequisites:
#   - AWS CLI installed and configured (aws configure)
#   - A .env file (copy from .env.example) with your S3 bucket name,
#     AWS region, and CloudFront distribution ID filled in
#   - The S3 bucket and CloudFront distribution must already exist
#     (run aws/setup.sh once to create them)
#
# Usage:
#   ./scripts/deploy.sh              # build + deploy
#   ./scripts/deploy.sh --skip-build # deploy only (skip rsync build step)
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Load environment variables ────────────────────────────────────────────────
ENV_FILE="$ROOT_DIR/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "✗ .env file not found at $ROOT_DIR/.env"
  echo "  Copy .env.example → .env and fill in your values."
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

# ── Validate required variables ───────────────────────────────────────────────
: "${S3_BUCKET:?'S3_BUCKET is not set in .env'}"
: "${AWS_REGION:?'AWS_REGION is not set in .env'}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?'CLOUDFRONT_DISTRIBUTION_ID is not set in .env'}"

echo "============================================================"
echo "  Portfolio Deployment"
echo "  Bucket  : s3://$S3_BUCKET"
echo "  Region  : $AWS_REGION"
echo "  CF Dist : $CLOUDFRONT_DISTRIBUTION_ID"
echo "============================================================"

# ── Step 1: Build ─────────────────────────────────────────────────────────────
SKIP_BUILD=false
for arg in "$@"; do
  [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true
done

if [[ "$SKIP_BUILD" == false ]]; then
  echo ""
  echo "▶ Step 1/3 — Building…"
  bash "$SCRIPT_DIR/build.sh"
else
  echo "▶ Step 1/3 — Skipping build (--skip-build)"
fi

DIST="$ROOT_DIR/dist"
if [[ ! -d "$DIST" ]] || [[ -z "$(ls -A "$DIST")" ]]; then
  echo "✗ dist/ is empty. Run build.sh first or drop --skip-build."
  exit 1
fi

# ── Step 2: Sync to S3 ────────────────────────────────────────────────────────
echo ""
echo "▶ Step 2/3 — Syncing to S3…"

# Upload HTML files with no-cache headers (always fresh)
aws s3 sync "$DIST" "s3://$S3_BUCKET" \
  --region "$AWS_REGION" \
  --delete \
  --exclude "*.css" \
  --exclude "*.js" \
  --exclude "*.png" \
  --exclude "*.jpg" \
  --exclude "*.svg" \
  --exclude "*.ico" \
  --exclude "*.woff2" \
  --content-type "text/html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

# Upload CSS/JS with long-lived cache (fingerprint in filename if using Vite)
aws s3 sync "$DIST" "s3://$S3_BUCKET" \
  --region "$AWS_REGION" \
  --delete \
  --exclude "*.html" \
  --exclude "*.txt" \
  --exclude "*.xml" \
  --cache-control "public, max-age=31536000, immutable" \
  --metadata-directive REPLACE

echo "✓ S3 sync complete."

# ── Step 3: Invalidate CloudFront cache ───────────────────────────────────────
echo ""
echo "▶ Step 3/3 — Invalidating CloudFront cache…"

INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "✓ Invalidation created: $INVALIDATION_ID"
echo "  (CloudFront propagation takes ~30–60 seconds globally)"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo "  ✓ Deployment complete!"
echo ""
echo "  CloudFront URL (check aws/setup.sh output or AWS console):"
echo "  https://<your-distribution>.cloudfront.net"
echo ""
echo "  To watch the invalidation status:"
echo "  aws cloudfront get-invalidation \\"
echo "    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \\"
echo "    --id $INVALIDATION_ID"
echo "============================================================"
