# Daniel Madera — Portfolio · AWS S3 + CloudFront

> Vanilla HTML/CSS/JS static portfolio deployed via AWS S3 (origin) and CloudFront (CDN + HTTPS). No build tooling, no frameworks, no dependencies to maintain.

**Live site:** [danielmadera.dev](https://www.danielmadera.dev)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [Tech Stack](#3-tech-stack)
4. [Local Development](#4-local-development)
5. [Admin Panel](#5-admin-panel)
6. [Contact Form](#6-contact-form)
7. [AWS Setup](#7-aws-setup)
8. [Deployment](#8-deployment)
9. [Customization Guide](#9-customization-guide)
10. [Cost Estimate](#10-cost-estimate)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Overview

### Sections

| Section    | Description |
|------------|-------------|
| **Hero**   | Two-column layout — text left, floating terminal card right. Animated particle mesh canvas, typing effect, floating stat badges |
| **About**  | Profile photo, two-paragraph bio, scannable 4-stat row (Years / Technologies / Cloud / Status), meta grid, résumé download |
| **Skills** | Icon grid by category: Languages · Frontend · Backend & Cloud · DevOps & Tools (20 technologies) |
| **Projects** | 2-column grid — featured project spans full width, two secondary cards side-by-side |
| **Experience** | Vertical timeline — role, company, date range, bullet accomplishments, tech tags |
| **Contact** | Fetch-based form (Formspree) + direct contact links (email, LinkedIn, GitHub) |
| **Footer** | Copyright · Admin link · Social icons |

### Design System — Forest Ember

| Token | Value | Role |
|-------|-------|------|
| `--clr-bg` | `#101A11` | Deep forest green background |
| `--clr-accent` | `#4ADE80` | Primary emerald green |
| `--clr-cyan` | `#FBBF24` | Secondary warm amber |
| `--clr-text` | `#F0FFF4` | Soft mint-white |
| `--font-heading` | Outfit | Section titles, hero name |
| `--font-body` | Space Grotesk | Body copy, nav, buttons |

---

## 2. File Structure

```
portfolio/
├── src/                    ← source files (edit these)
│   ├── index.html          ← main portfolio page
│   ├── admin.html          ← password-protected content editor
│   ├── css/
│   │   ├── styles.css      ← all portfolio styles + design tokens
│   │   └── admin.css       ← admin panel styles
│   ├── js/
│   │   ├── main.js         ← animations, nav, typed effect, contact form
│   │   └── admin.js        ← admin auth, form builder, HTML generator
│   └── assets/
│       └── headshot.jpg    ← profile photo
│
├── dist/                   ← build output (rsync copy of src/, uploaded to S3)
│
├── scripts/
│   ├── build.sh            ← rsync src/ → dist/
│   └── deploy.sh           ← build + S3 sync + CloudFront invalidation
│
├── aws/
│   └── setup.sh            ← one-time S3 bucket + CloudFront creation
│
├── .env                    ← secrets (gitignored)
├── .env.example            ← template — copy to .env and fill in values
└── README.md
```

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic, ARIA-labelled) |
| Styles | Vanilla CSS with custom properties |
| Scripts | Vanilla JavaScript (ES2020, no frameworks) |
| Fonts | Google Fonts — Outfit (headings) + Space Grotesk (body) |
| Skill icons | Devicons v2 (CDN) |
| Contact form | Formspree (`/f/xlgvnkzb`) |
| Hosting | AWS S3 (static website origin) |
| CDN / HTTPS | AWS CloudFront (PriceClass_100) |
| Deployment | AWS CLI + bash scripts |

---

## 4. Local Development

No build step required — the site runs directly from the file system.

```bash
# Start a local HTTP server (required for CDN fonts/icons to load)
cd src && python3 -m http.server 3000
# Open http://localhost:3000

# Alt: Node
npx serve src -p 3000
```

> Do not open `index.html` via `file://` — CDN resources (fonts, devicons) will be blocked by the browser.

---

## 5. Admin Panel

A password-protected content editor lives at `/admin.html`.

**Access:** `http://localhost:3000/admin.html` (local) or `danielmadera.dev/admin.html` (live)

### First use

On first visit, you are prompted to **create a password**. The password is hashed with SHA-256 via the browser's Web Crypto API and stored in `localStorage` — it never leaves your device.

### Editing workflow

1. Open the admin panel and log in
2. Edit content across tabs: **Hero · About · Projects · Experience · Contact**
3. Click **Download index.html** — a fully updated `index.html` is downloaded
4. Replace `src/index.html` with the downloaded file
5. Run `./scripts/deploy.sh`

### What can be edited

| Tab | Fields |
|-----|--------|
| Hero | Greeting, name, tagline, typed words |
| About | Bio paragraphs, location, status, focus, résumé URL, availability badge |
| Projects | Title, description, tags, GitHub URL, demo URL, icon (7 options) — add/remove cards |
| Experience | Role, company, URL, period, bullet points, tags — add/remove entries |
| Contact | Lead text, email, LinkedIn URL/label, GitHub URL/label |

> Skills are not editable via admin — they use Devicon CSS class names. Edit the `skills` section of `src/index.html` directly.

### Typed words

Typed words are injected into `index.html` as a `<script>` block when downloaded from admin:

```html
<script>window.TYPED_WORDS = ["cloud solutions", "business value", "scalable systems"];</script>
```

`main.js` reads `window.TYPED_WORDS` at runtime, falling back to built-in defaults if the variable is absent.

---

## 6. Contact Form

The contact form POSTs JSON to **Formspree** and shows an inline success state — no page reload, no mail client popup.

| Setting | Value |
|---------|-------|
| Endpoint | `https://formspree.io/f/xlgvnkzb` |
| Submissions delivered to | `dmadera0@gmail.com` |
| Method | `fetch` POST with `Content-Type: application/json` |

To change the endpoint, update `ENDPOINT` in `src/js/main.js`:

```js
const ENDPOINT = 'https://formspree.io/f/xlgvnkzb';
```

---

## 7. AWS Setup

### Prerequisites

- AWS CLI v2 configured (`aws configure`)
- IAM user/role with S3 + CloudFront permissions

**Minimum IAM permissions:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket", "s3:PutBucketPolicy", "s3:PutBucketWebsite",
        "s3:PutPublicAccessBlock", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateDistribution", "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation", "cloudfront:ListDistributions"
      ],
      "Resource": "*"
    }
  ]
}
```

### One-time setup

```bash
chmod +x aws/setup.sh scripts/build.sh scripts/deploy.sh
./aws/setup.sh
```

The script creates the S3 bucket, enables static hosting, applies a public-read policy, creates a CloudFront distribution, and writes `.env` with the generated IDs.

### Current AWS resources

| Resource | Value |
|----------|-------|
| S3 Bucket | `d.madera-porfolio` (us-east-1) |
| CloudFront Distribution | `EST245WQ0FXQM` |
| Custom domains | `danielmadera.dev`, `www.danielmadera.dev` |

---

## 8. Deployment

```bash
# Full build + deploy
./scripts/deploy.sh

# Deploy without rebuilding dist/
./scripts/deploy.sh --skip-build
```

The deploy script:
1. Rsyncs `src/` → `dist/`
2. Uploads HTML with `no-cache` headers (always fresh)
3. Uploads CSS/JS/assets with `max-age=31536000` (long-lived cache)
4. Creates a CloudFront invalidation for `/*`

**Cache note:** After deploying, CloudFront propagation takes ~30–60 seconds. If your browser shows stale content, do a hard refresh (`Cmd+Shift+R` on Mac) or open in an incognito window.

### Check invalidation status

```bash
source .env
aws cloudfront get-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --id <INVALIDATION_ID>
```

---

## 9. Customization Guide

### Colors

All tokens live in the `:root` block at the top of `src/css/styles.css`. The two values that retheme the entire site:

```css
--clr-accent: #4ADE80;   /* primary green — buttons, tags, highlights */
--clr-cyan:   #FBBF24;   /* secondary amber — typed text, timeline hover */
```

Also update the hardcoded RGBA values in the same file that reference the accent/cyan numerically (search for `rgba(74,222,128` and `rgba(251,191,36`).

### Particle canvas colors

In `src/js/main.js`, the mesh particle colors must be updated manually to match CSS changes:

```js
const ACCENT = { r:  74, g: 222, b: 128 };  // matches --clr-accent
const CYAN   = { r: 251, g: 191, b:  36 };  // matches --clr-cyan
```

### Fonts

1. Choose a pairing at [fonts.google.com](https://fonts.google.com)
2. Replace the `<link>` in `src/index.html`
3. Update in `src/css/styles.css`:
   ```css
   --font-heading: 'YourFont', sans-serif;
   --font-body:    'YourFont', sans-serif;
   ```

### Profile photo

Place the image at `src/assets/headshot.jpg`. The `<img>` tag in the About section references this path directly.

---

## 10. Cost Estimate

| Service | Cost |
|---------|------|
| S3 Storage | ~$0.023/GB/month — portfolio is <5 MB, essentially **free** |
| S3 Requests | 20,000 GET free/month |
| CloudFront | 1 TB + 10M requests free/month (always-free tier) |
| ACM Certificate | **Free** |
| Route 53 | $0.50/hosted zone/month + ~$14/year for `.dev` domain |
| Formspree | Free tier — 50 submissions/month |
| **Total** | **~$1/month** |

---

## 11. Troubleshooting

### Browser shows old version after deploy

CloudFront caches aggressively. Do a hard refresh (`Cmd+Shift+R`) or open in incognito. If the issue persists, create a manual invalidation:

```bash
source .env
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*"
```

### Contact form submissions not arriving

1. Check the Formspree dashboard at [formspree.io](https://formspree.io) — submissions appear there even if email delivery fails
2. Check spam folder
3. Verify `ENDPOINT` in `main.js` matches your form ID

### Admin password forgotten

Clear `localStorage` in DevTools (`Application → Local Storage → Clear All`) and reload `/admin.html`. You will be prompted to create a new password.

### 403 Forbidden on S3

Block Public Access is still enabled or the bucket policy is missing:

```bash
aws s3api get-public-access-block --bucket "$S3_BUCKET"
# All four values should be "false"
```

### Site shows S3 XML error page

You're hitting the S3 REST endpoint directly. Always access via the CloudFront URL or custom domain.

### CloudFront distribution stuck in "InProgress"

Normal — global propagation takes 5–15 minutes:

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
