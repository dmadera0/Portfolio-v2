#!/usr/bin/env bash
# =============================================================================
# aws/setup.sh
# ONE-TIME setup script: creates S3 bucket + CloudFront distribution.
#
# Run this once. After it completes, copy the output values into your .env
# file and use scripts/deploy.sh for all future deployments.
#
# Prerequisites:
#   - AWS CLI v2 installed: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
#   - AWS credentials configured: aws configure
#   - IAM permissions required:
#       s3:CreateBucket, s3:PutBucketPolicy, s3:PutBucketWebsite,
#       s3:PutPublicAccessBlock,
#       cloudfront:CreateDistribution, cloudfront:CreateOriginAccessControl
#
# Usage:
#   ./aws/setup.sh
#
# The script will prompt for your bucket name if not set in the environment.
# =============================================================================
set -euo pipefail

# ── Configuration — override via environment or prompts ───────────────────────
BUCKET_NAME="${S3_BUCKET:-}"
REGION="${AWS_REGION:-us-east-1}"

if [[ -z "$BUCKET_NAME" ]]; then
  read -rp "Enter a globally unique S3 bucket name (e.g. johndoe-portfolio): " BUCKET_NAME
fi

if [[ -z "$BUCKET_NAME" ]]; then
  echo "✗ Bucket name cannot be empty." && exit 1
fi

echo ""
echo "============================================================"
echo "  Portfolio AWS Setup"
echo "  Bucket  : $BUCKET_NAME"
echo "  Region  : $REGION"
echo "============================================================"
echo ""

# ── Step 1: Create S3 bucket ──────────────────────────────────────────────────
echo "▶ Step 1/5 — Creating S3 bucket…"

# us-east-1 does NOT accept a LocationConstraint; all other regions do
if [[ "$REGION" == "us-east-1" ]]; then
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION"
else
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION"
fi

echo "✓ Bucket created: $BUCKET_NAME"

# ── Step 2: Disable Block Public Access ───────────────────────────────────────
echo ""
echo "▶ Step 2/5 — Disabling Block Public Access…"

aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo "✓ Public access unblocked."

# ── Step 3: Enable static website hosting ────────────────────────────────────
echo ""
echo "▶ Step 3/5 — Enabling static website hosting…"

aws s3api put-bucket-website \
  --bucket "$BUCKET_NAME" \
  --website-configuration '{
    "IndexDocument": { "Suffix": "index.html" },
    "ErrorDocument": { "Key": "index.html" }
  }'

# Bucket policy: allow public GetObject
POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF
)

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy "$POLICY"

S3_WEBSITE_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
echo "✓ Static hosting enabled: $S3_WEBSITE_URL"

# ── Step 4: Create CloudFront distribution ────────────────────────────────────
echo ""
echo "▶ Step 4/5 — Creating CloudFront distribution…"

# Use the S3 website endpoint as origin (not the REST endpoint) so that
# directory indexes / error redirects work correctly via the bucket config.
ORIGIN_DOMAIN="${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"

CF_CONFIG=$(cat <<EOF
{
  "Comment": "${BUCKET_NAME} portfolio",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-website-origin",
        "DomainName": "${ORIGIN_DOMAIN}",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-website-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["HEAD", "GET"],
      "CachedMethods": { "Quantity": 2, "Items": ["HEAD", "GET"] }
    }
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "PriceClass": "PriceClass_100",
  "Enabled": true,
  "HttpVersion": "http2and3"
}
EOF
)

CF_OUTPUT=$(aws cloudfront create-distribution \
  --distribution-config "$CF_CONFIG" \
  --query 'Distribution.[Id, DomainName]' \
  --output text)

CF_ID=$(echo "$CF_OUTPUT" | awk '{print $1}')
CF_DOMAIN=$(echo "$CF_OUTPUT" | awk '{print $2}')

echo "✓ CloudFront distribution created."

# ── Step 5: Write .env file ───────────────────────────────────────────────────
echo ""
echo "▶ Step 5/5 — Writing .env file…"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_PATH="$ROOT_DIR/.env"

cat > "$ENV_PATH" <<ENVFILE
# Auto-generated by aws/setup.sh — $(date -u +"%Y-%m-%d %H:%M:%S UTC")
S3_BUCKET=$BUCKET_NAME
AWS_REGION=$REGION
CLOUDFRONT_DISTRIBUTION_ID=$CF_ID
ENVFILE

echo "✓ .env written to $ENV_PATH"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo "  ✓ AWS infrastructure ready!"
echo ""
echo "  S3 Bucket        : $BUCKET_NAME"
echo "  S3 Website URL   : $S3_WEBSITE_URL"
echo "  CloudFront ID    : $CF_ID"
echo "  CloudFront URL   : https://$CF_DOMAIN  ← share this"
echo ""
echo "  NOTE: CloudFront takes 5–15 min to fully deploy globally."
echo ""
echo "  Next step — deploy your site:"
echo "    ./scripts/deploy.sh"
echo "============================================================"
