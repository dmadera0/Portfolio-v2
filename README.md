# Personal Portfolio — Static Site on AWS S3 + CloudFront

> A modern, dark-themed developer portfolio built with vanilla HTML/CSS/JS and deployed as a static site via AWS S3 (origin) and CloudFront (CDN + HTTPS).

```
┌─────────────────────────────────────────────────────────┐
│  [Screenshot placeholder — add your own after deploy]   │
│  Tip: run `open dist/index.html` locally to preview.   │
└─────────────────────────────────────────────────────────┘
```

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Local Development](#3-local-development)
4. [AWS Setup (Step-by-Step)](#4-aws-setup-step-by-step)
5. [Deployment](#5-deployment)
6. [Customization Guide](#6-customization-guide)
7. [Cost Estimate](#7-cost-estimate)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Project Overview

A fully static personal portfolio website featuring:

- **Hero** — animated particle mesh canvas background, typing effect, gradient name display
- **About** — bio, profile photo, meta information
- **Skills** — icon grid organized by category (Languages / Frontend / Backend & Cloud / DevOps)
- **Projects** — 3 project cards with tags, GitHub + demo links
- **Experience** — vertical timeline with role, company, dates, bullet accomplishments
- **Contact** — mailto-based contact form + direct contact links
- **Footer** — copyright + social links

All personal content is marked with `<!-- TODO: -->` comments so you can replace placeholder text with your real information.

### File Structure

```
portfolio/
├── src/               ← source files (edit these)
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── assets/        ← add profile.jpg, favicon, etc. here
│
├── dist/              ← build output (what gets uploaded to S3)
│
├── scripts/
│   ├── build.sh       ← copies src/ → dist/
│   └── deploy.sh      ← build + S3 sync + CloudFront invalidation
│
├── aws/
│   └── setup.sh       ← one-time AWS infrastructure creation
│
├── .env               ← your secrets (gitignored)
├── .env.example       ← template to copy
└── README.md
```

---

## 2. Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| Markup       | HTML5 (semantic, ARIA-labelled)                         |
| Styles       | Vanilla CSS with custom properties                      |
| Scripts      | Vanilla JavaScript (ES2020, no frameworks)              |
| Fonts        | Google Fonts — Syne + Space Grotesk                     |
| Icons        | Devicons v2 (CDN)                                       |
| Hosting      | AWS S3 (static website origin)                          |
| CDN / HTTPS  | AWS CloudFront (PriceClass_100)                         |
| Deployment   | AWS CLI + bash scripts                                  |

---

## 3. Local Development

No build tooling required — the site runs directly from files.

### Option A — Open directly

```bash
open src/index.html        # macOS
start src/index.html       # Windows
xdg-open src/index.html    # Linux
```

> **Note:** Some browsers block CDN resources (fonts, devicons) when opening `file://` URLs. Use Option B for full fidelity.

### Option B — Local HTTP server (recommended)

**Python (built-in):**
```bash
cd src
python3 -m http.server 3000
# Open http://localhost:3000
```

**Node.js (npx, no install needed):**
```bash
npx serve src -p 3000
# Open http://localhost:3000
```

**VS Code:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `src/index.html` → "Open with Live Server".

---

## 4. AWS Setup (Step-by-Step)

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| AWS CLI v2  | [Install guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) |
| AWS account | Free tier is sufficient |
| IAM user / role | Needs the permissions listed below |

**Minimum IAM permissions:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:PutBucketPolicy",
        "s3:PutBucketWebsite",
        "s3:PutPublicAccessBlock",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateDistribution",
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListDistributions"
      ],
      "Resource": "*"
    }
  ]
}
```

**Configure AWS CLI:**
```bash
aws configure
# AWS Access Key ID:     <your key>
# AWS Secret Access Key: <your secret>
# Default region name:   us-east-1
# Default output format: json
```

---

### Automated Setup (Recommended)

The `aws/setup.sh` script handles all steps automatically:

```bash
chmod +x aws/setup.sh scripts/build.sh scripts/deploy.sh
./aws/setup.sh
```

It will:
1. Prompt for a bucket name (must be globally unique)
2. Create and configure the S3 bucket
3. Enable static website hosting
4. Apply a public-read bucket policy
5. Create a CloudFront distribution pointing at the S3 website endpoint
6. Write a `.env` file with the generated IDs

Skip ahead to [Section 5 — Deployment](#5-deployment) once setup completes.

---

### Manual Setup (Step-by-Step Reference)

#### 4a. Create the S3 Bucket

```bash
BUCKET=your-portfolio-bucket-name
REGION=us-east-1

aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region "$REGION"
  # For regions other than us-east-1, add:
  # --create-bucket-configuration LocationConstraint="$REGION"
```

#### 4b. Disable Block Public Access

```bash
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

#### 4c. Enable Static Website Hosting

```bash
aws s3api put-bucket-website \
  --bucket "$BUCKET" \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'
```

#### 4d. Apply Bucket Policy (Public Read)

```bash
aws s3api put-bucket-policy \
  --bucket "$BUCKET" \
  --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [{
      \"Sid\": \"PublicReadGetObject\",
      \"Effect\": \"Allow\",
      \"Principal\": \"*\",
      \"Action\": \"s3:GetObject\",
      \"Resource\": \"arn:aws:s3:::${BUCKET}/*\"
    }]
  }"
```

#### 4e. Create CloudFront Distribution

> `aws/setup.sh` handles this automatically. Key settings applied:

| Setting                 | Value                                         |
|-------------------------|-----------------------------------------------|
| Origin                  | S3 website endpoint (HTTP)                    |
| Viewer protocol policy  | Redirect HTTP → HTTPS                         |
| Cache policy            | CachingOptimized (AWS managed)                |
| Custom error responses  | 403 + 404 → `/index.html` (SPA support)       |
| Price class             | PriceClass_100 (US, Canada, Europe)           |
| HTTP versions           | HTTP/2 + HTTP/3                               |
| Default root object     | `index.html`                                  |
| Compression             | Enabled                                       |

#### 4f. (Optional) Custom Domain with Route 53

1. Register or transfer your domain to Route 53.
2. Request an **ACM certificate** in `us-east-1`:
   ```bash
   aws acm request-certificate \
     --domain-name "yourdomain.com" \
     --subject-alternative-names "www.yourdomain.com" \
     --validation-method DNS \
     --region us-east-1
   ```
3. Add the CNAME records ACM provides to your Route 53 hosted zone to validate.
4. Update your CloudFront distribution with the alternate domain name + ACM certificate.
5. In Route 53, create an **A record (Alias)** → your CloudFront distribution.

---

## 5. Deployment

### First deploy

```bash
# Make scripts executable (one-time)
chmod +x scripts/build.sh scripts/deploy.sh aws/setup.sh

# Run setup (creates S3 + CloudFront, writes .env)
./aws/setup.sh

# Deploy
./scripts/deploy.sh
```

### Subsequent deploys

```bash
./scripts/deploy.sh
```

This will:
1. Rebuild `dist/` from `src/`
2. Sync `dist/` → S3 (`--delete` removes files no longer in source)
3. Create a CloudFront invalidation for `/*`

### Skip rebuild

```bash
./scripts/deploy.sh --skip-build
```

### Check invalidation status

```bash
source .env
aws cloudfront get-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --id <INVALIDATION_ID>
```

---

## 6. Customization Guide

### Personal information

All placeholder content is marked with `<!-- TODO: -->` comments in `src/index.html`. Find all locations:

```bash
grep -n "TODO" src/index.html
```

Key items to update:

| Item              | Location in `index.html`                      |
|-------------------|-----------------------------------------------|
| Name + title      | `<title>`, `.hero__name`, `.hero__title`      |
| Tagline           | `.hero__tagline`                              |
| Bio               | `.about__bio` (×2 paragraphs)                 |
| Location / status | `.about__meta`                                |
| Résumé link       | `<a href="#" download>` in About section      |
| Profile photo     | Replace `.about__photo-placeholder` with `<img>` |
| Projects (×3)     | `.project-card` — title, desc, tags, links   |
| Work experience   | `.timeline__item` entries                     |
| Email             | `mailto:` links + form `action`               |
| LinkedIn          | `linkedin.com/in/...` links                   |
| GitHub            | `github.com/...` links                        |
| Typed words       | `words` array in `src/js/main.js` line ~57    |
| Footer name       | `.footer__copy` paragraph                     |

### Colors

All colors are CSS custom properties at the top of `src/css/styles.css`:

```css
:root {
  --clr-accent: #7c6dfa;      /* ← primary accent (indigo-violet) */
  --clr-cyan:   #22d3ee;      /* ← secondary highlight (cyan)     */
}
```

Change these two values to completely retheme the site.

### Fonts

1. Pick a pair at [fonts.google.com](https://fonts.google.com)
2. Replace the `<link>` tag in `src/index.html`
3. Update in `src/css/styles.css`:
   ```css
   --font-heading: 'YourHeadingFont', sans-serif;
   --font-body:    'YourBodyFont',    sans-serif;
   ```

### Adding a profile photo

1. Add `src/assets/profile.jpg` (recommended: 600×750 px)
2. In `src/index.html`, replace the `about__photo-placeholder` div:
   ```html
   <img src="assets/profile.jpg" alt="Your Name" />
   ```
3. Add CSS:
   ```css
   .about__photo-placeholder img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     border-radius: var(--radius-xl);
   }
   ```

### Real contact form backend

The current form uses `mailto:`. For a proper backend:

- **Formspree** (easiest): change form `action` to `https://formspree.io/f/<YOUR_ID>` and `method="POST"`
- **AWS SES + Lambda**: create an API Gateway endpoint → Lambda → SES, then call it via `fetch()` in `main.js`

---

## 7. Cost Estimate

| Service          | Free Tier / Expected Cost                                           |
|------------------|---------------------------------------------------------------------|
| S3 Storage       | ~$0.023/GB/month — a portfolio is <1 MB, essentially **free**      |
| S3 Requests      | 20,000 GET free/month — well within limits for a portfolio          |
| CloudFront       | 1 TB + 10M requests free/month (always-free tier)                  |
| ACM Certificate  | **Free** (CloudFront-attached certificates)                         |
| Route 53         | $0.50/hosted zone/month + $12–$15/year for a `.dev` domain         |
| **Total**        | **~$0–$1/month** for typical portfolio traffic                      |

---

## 8. Troubleshooting

### 403 Forbidden on S3

Block Public Access is still enabled or the bucket policy is missing.

```bash
aws s3api get-public-access-block --bucket "$S3_BUCKET"
# All four values should be "false"
```

### CloudFront returns stale content

Force a cache invalidation:

```bash
source .env
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*"
```

### CORS errors in browser console

Usually a `file://` browser restriction — serve via a local HTTP server instead (see Section 3).

### Site shows S3 XML error page

You're accessing the S3 REST endpoint, not the website endpoint. Use the CloudFront URL or the S3 website URL (`http://<bucket>.s3-website-<region>.amazonaws.com`).

### `aws: command not found`

```bash
# macOS
brew install awscli

# All platforms — see official docs:
# https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
```

### CloudFront distribution stuck in "InProgress"

Normal — distributions take 5–15 minutes to propagate globally.

```bash
source .env
aws cloudfront get-distribution \
  --id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --query 'Distribution.Status' \
  --output text
# "Deployed" = ready
```

---

## License

MIT — free to use, fork, and customize.
