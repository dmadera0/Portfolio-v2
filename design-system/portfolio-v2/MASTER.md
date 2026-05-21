# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Portfolio-v2
**Updated:** 2026-05-21
**Category:** Portfolio / Software Engineer — Technical Recruiter Audience

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Notes |
|------|-----|--------------|-------|
| Background | `#09090B` | `--clr-bg` | OLED near-black |
| Surface | `#111113` | `--clr-surface` | Cards, panels |
| Surface raised | `#1C1C1F` | `--clr-surface-2` | Hover / elevated |
| Border subtle | `rgba(255,255,255,0.07)` | `--clr-border` | Dividers |
| Border visible | `rgba(255,255,255,0.13)` | `--clr-border-2` | Card outlines |
| **Accent (primary)** | `#F59E0B` | `--clr-accent` | Amber — signature color |
| Accent dim | `#D97706` | `--clr-accent-dim` | Darker amber |
| Accent glow | `rgba(245,158,11,0.18)` | `--clr-accent-glow` | Glow shadows |
| **Secondary accent** | `#14B8A6` | `--clr-cyan` | Teal — code/tech moments |
| Secondary dim | `#0D9488` | `--clr-cyan-dim` | |
| Text primary | `#FAFAFA` | `--clr-text` | |
| Text muted | `#A1A1AA` | `--clr-text-muted` | Labels, captions |
| Text faint | `#52525B` | `--clr-text-faint` | Placeholder, decorative |
| Success | `#4ADE80` | `--clr-success` | |
| Error | `#F87171` | `--clr-error` | |

**Rationale:** Amber on near-black is rare in dev portfolios (most use blue/purple) — instantly memorable to recruiters. Teal secondary reads as technical without competing with amber.

### Typography

| Role | Font | Weights | Notes |
|------|------|---------|-------|
| Headings | **Outfit** | 400–800 | Geometric, confident — replaced Syne |
| Body | **Space Grotesk** | 300–600 | Keep — pairs well, technical feel |

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap');
```

**Usage guidance:**
- Hero name: Outfit 800, `--fs-hero`
- Section headings: Outfit 700, `--fs-2xl`
- Card titles: Outfit 600, `--fs-lg`
- Body copy: Space Grotesk 400, `--fs-base`, line-height 1.6
- Labels / tags: Space Grotesk 500, `--fs-sm`, letter-spacing 0.05em uppercase

### Style Direction

**Primary style:** OLED Dark Mode
**Secondary layer:** Glassmorphism (cards only — `backdrop-filter: blur(12px)`)
**Motion:** Scroll-entrance via Intersection Observer + hover microinteractions (250–350ms)

**Do:**
- Amber glow on active/hovered accent elements (`--shadow-glow`)
- Glassmorphism on project cards (`background: rgba(255,255,255,0.04); backdrop-filter: blur(12px)`)
- Entrance animations: fade-up on scroll (60px translate, 600ms `--ease`)
- Subtle gradient on hero name: amber → teal

**Don't:**
- No blue/purple anywhere (breaks the distinctive amber direction)
- No opaque flat cards (kills the layered depth)
- No heavy parallax (performance + a11y concerns)
- No white backgrounds in any section

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--sp-1` | `0.25rem` | Tight gaps |
| `--sp-2` | `0.5rem` | Icon gaps |
| `--sp-4` | `1rem` | Standard padding |
| `--sp-6` | `1.5rem` | Section padding |
| `--sp-8` | `2rem` | Large gaps |
| `--sp-12` | `3rem` | Section margins |
| `--sp-16` | `4rem` | Hero padding |
| `--sp-24` | `6rem` | Section gaps |

### Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,.35)` | Subtle lift |
| `--shadow-md` | `0 8px 24px rgba(0,0,0,.45)` | Cards, buttons |
| `--shadow-lg` | `0 16px 48px rgba(0,0,0,.55)` | Modals, featured |
| `--shadow-glow` | `0 0 40px rgba(245,158,11,.15)` | Amber glow on accent elements |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Tags, badges |
| `--radius-md` | `12px` | Cards, inputs |
| `--radius-lg` | `20px` | Sections, feature blocks |
| `--radius-full` | `9999px` | Pills, avatars |

---

## Page Pattern

**Pattern:** Portfolio Grid (Motion-Driven)

**Section order:** Hero → About → Skills → Projects → Experience → Contact

**Hero must have:**
- Full-viewport height
- Name in Outfit 800 with amber→teal gradient
- Role subtitle in Space Grotesk 400, `--clr-text-muted`
- Two CTAs: primary (amber filled) + secondary (ghost border)

**Project cards:**
- Glassmorphism: `background: rgba(255,255,255,0.04); backdrop-filter: blur(12px)`
- `border: 1px solid var(--clr-border-2)`
- Hover: amber left-border highlight + lift (`translateY(-4px)`)
- Entrance: fade-up on scroll

---

## Anti-Patterns

- No blue or purple accent colors (previous generic aesthetic)
- No emojis as icons — use Lucide SVG icons
- No corporate/template layouts
- No missing `cursor: pointer` on clickable elements
- No layout-shifting hovers (avoid `scale` on cards that shifts surrounding content)
- No invisible focus states

---

## Pre-Delivery Checklist

- [ ] All accents use amber `#F59E0B` or teal `#14B8A6` — no indigo/blue/purple
- [ ] No emojis as icons (Lucide SVG only)
- [ ] `cursor: pointer` on all interactive elements
- [ ] Hover transitions 150–350ms
- [ ] Focus ring: `outline: 2px solid var(--clr-accent)`
- [ ] `prefers-reduced-motion` respected (wrap entrance animations)
- [ ] Text contrast 4.5:1+ against dark backgrounds
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] No content hidden behind fixed navbar
