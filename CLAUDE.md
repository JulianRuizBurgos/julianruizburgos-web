# Project context — julianruizburgos-web

## What this is
Personal website for Julian Ruiz Burgos. Two equal primary goals:
- Showcase and sell prints of amateur landscape and wildlife photography
- Advertise IT freelancing services

Secondary sections: Ecology (professional identity — consulting, research, publications), a general personal blog, and an About page.

## Stack
- **Framework**: Next.js 16.1.6, App Router, TypeScript
- **Styling**: Tailwind CSS v4 — config via `@theme` in `app/globals.css`, no `tailwind.config.ts`
- **Components**: shadcn/ui (copied into `components/ui/`), lucide-react icons, Radix UI (via shadcn)
- **Content**: Markdown files in `content/blog/<slug>/index.md` — folder-per-post structure
- **Version control**: GitHub
- **Hosting**: Hetzner CX23 VPS (Helsinki) — live at https://julianruizburgos.net
- **Deployment**: Coolify — auto-deploy on push to `main`, active
- **Payments**: Mollie (EU-based payment processor, replaces Stripe)
- **Node**: v20+ required (v18 will fail the build)

## Design system

### Typography
- **Display/serif**: Playfair Display (`font-serif`) — headings, section titles, editorial voice
- **Body/sans**: Inter (`font-sans`) — body text, UI labels

### Colour palette (defined in `app/globals.css` via `@theme`)
- **Page background**: `earth-50` (#faf8f5) — warm off-white
- **Body text**: `earth-900` (#241c16) — near-black
- **Headings on light bg**: `earth-900` — merged with body text token (forest-900 removed)
- **Muted text on light bg**: `earth-600` — minimum for secondary/caption text
- **Muted text on dark bg**: `earth-300` or `earth-400`
- **Accent**: `terracotta-*` — rust/terracotta, used sparingly for CTAs and hover states
- **Section colours**: `olive-*` (ecology), `navy-*` (IT — dark blue derived from the photography blue family)
- **Photography section**: blue-tinted `stone-*` palette built around `#1068b6`. Active states use `#1068b6` directly. stone-50 through stone-900 all defined.
- **Do not use plum, sage, or forest-* tokens** — removed from the palette as part of the 3-colour consolidation (2026-04-02)
- **Do not use `earth-500` for text** — fails contrast on both light and dark backgrounds

### Layout principles
- Photography leads — UI is minimal, images carry visual weight
- Generous negative space throughout
- No white cards with shadows — editorial top-rule style (`border-t-2`) on inner pages
- Homepage section cards: full-height photo cards (80vh on desktop), grayscale→colour on hover, vertical serif label, dark overlay lifts on hover, terracotta "Explore →" fades up, thin accent line grows from left at bottom
- **Page header sections** (Photography, Collections, Ecology, etc.) default to `pt-20 pb-20` — do not use larger values unless there is a specific reason (e.g. a full-screen hero)

### Navigation
- **No sticky nav** — two fixed floating elements overlay the page:
  - `HOME` text link — top-left, `z-50`
  - `MENU` text button — top-right, `z-50`
- Both use `text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]` for contrast on any background
- Clicking MENU opens a dark (`bg-earth-900`) slide-in sidebar from the left (Kaer-style)
- Inner pages must add `pt-28` at the top to clear the floating nav

### Hero (homepage)
- Full-screen (`h-screen`), `object-cover`, centered text
- Ken Burns CSS animation: `animate-kenburns` (14s, scale 1→1.12 + slight pan), defined in globals.css
- Dark overlays: uniform `bg-black/30` + top/bottom gradients
- Title: large Playfair serif, `drop-shadow` for legibility
- Subtitle: small-caps disciplines, `font-semibold`, full white

### shadcn/ui components available
button, card, dialog, sheet, badge, separator, aspect-ratio

## Site architecture

```
Homepage
├── Photography & prints      (amber — combined gallery + shop)
│   ├── Galleries             (landscape, wildlife, series)
│   ├── Browse prints
│   └── Checkout              (Mollie)
├── IT freelancing            (navy)
│   ├── Services + case studies
│   └── Contact
├── Ecology                   (olive — full ecology identity)
│   ├── Consulting
│   ├── Research
│   └── Publications
├── Blog                      (general, multi-topic)
│   ├── All posts
│   └── Topic + tag filtering
└── About                     (footer-level)
```

## Folder structure

```
app/                          # Next.js App Router routes (no src/ prefix)
  layout.tsx                  # root layout — Nav + Footer
  page.tsx                    # homepage
  it/
    page.tsx                  # IT consulting services + projects
    [slug]/page.tsx           # case study detail pages
  blog/
    page.tsx                  # Server Component — fetches posts, renders BlogReader
    assets/[slug]/[...file]/
      route.ts                # serves static assets from content/blog/<slug>/
  photography/
    page.tsx                  # Server Component — fetches photos/tags/collections, renders PhotographyGallery
    images/[filename]/
      route.ts                # image proxy — streams from Nextcloud or falls back to public/photography/dev/
    collections/
      page.tsx                # collections index — cover cards with vignette effect
      [slug]/page.tsx         # SSG collection detail — renders CollectionView
  ecology/page.tsx            # placeholder
  about/page.tsx              # placeholder
  globals.css                 # Tailwind v4 config + custom palette + keyframes + prose-content CSS

components/
  BlogReader.tsx              # "use client" — interactive blog UI (filters, article view)
  PhotographyGallery.tsx      # "use client" — sidebar nav + masonry grid + tag filtering + lightbox
  CollectionView.tsx          # "use client" — collection detail grid + lightbox
  ui/                         # Nav.tsx, Footer.tsx, NowListening.tsx + shadcn/ui components

lib/
  blog.ts                     # reads content/blog/ from filesystem (gray-matter + marked)
  photography.ts              # Photo + Collection types, getAllPhotos(), getTagCounts(), getAllCollections(), getCollection()
  it.ts                       # IT services & projects data
  utils.ts                    # cn() helper (shadcn)

content/
  blog/
    <slug>/
      index.md                # post content + frontmatter
      *.png / *.pdf / ...     # co-located assets (served via /blog/assets/<slug>/*)
    _template/
      index.md                # copy this when writing a new post
  photography/
    photos.json               # photo manifest — metadata for all published photos
    collections.json          # collection definitions — ordered photo lists

public/
  images/                     # hero images (21:9 ultrawide crop in use)
  photography/dev/            # local dev placeholder images (not served directly — use the proxy route)

components.json               # shadcn/ui config
```

## Blog content pipeline

Posts live in `content/blog/<slug>/`. The slug becomes the URL-safe post ID.

**Required frontmatter:**
```yaml
---
title: "Post title"
date: "YYYY-MM-DD"           # ISO format — used for sorting
topic: personal              # ecology | photography | technology | travel | personal
excerpt: "One or two sentences."
tags: ["tag one", "tag two"]
# pdf: "filename.pdf"        # optional — embeds a PDF viewer below the text body
---
```

**Key behaviours:**
- `readTime` is auto-calculated (~200 wpm) — do not add to frontmatter
- Obsidian `![[image embeds]]` and `[[wikilinks]]` are stripped automatically
- Images referenced with relative paths (`![alt](image.png)`) are served via the asset route
- Footnotes (`[^1]` / `[^1]: text`) rendered and linked via `marked-footnote`
- Body text is justified with automatic hyphenation
- Files/folders starting with `_` are ignored by the blog reader

**Architecture note:** `app/blog/page.tsx` is a Server Component — it fetches data and passes it as props to `BlogReader.tsx` (client). Page components never read content directly; they go through `lib/blog.ts`. Swapping the data source only requires touching that file.

## Photography content pipeline

Photos are served from Nextcloud WebDAV in production (`Photography/Workspace/03_Exports/Shop/`), with `content/photography/photos.json` as the local dev fallback and repo backup. Collections are in `content/photography/collections.json` (same pattern).

### Scripts

```bash
# 1. Scan Shop folder and update photos.json with EXIF data
bash scripts/generate-photos-json.sh \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json --sync

# 2. Enrich photos with Claude Sonnet 4.6 vision (converts TIF/PNG, renames, writes EXIF)
ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-photo-metadata.mjs \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json \
  content/photography/collections.json --sync

# 3. Auto-generate/update collections from filename prefixes
node scripts/generate-collections.mjs \
  content/photography/photos.json \
  content/photography/collections.json \
  --sync ~/Nextcloud/Photography/Workspace/03_Exports/Shop

# 4. After any manual tag edits in photos.json, sync tags back to EXIF
#    (prevents generate-photos-json.sh from overwriting cleaned tags on re-run)
node scripts/sync-tags-to-exif.mjs \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json

# 5. Pre-warm the Next.js image cache after syncing (avoids slow first loads for visitors)
bash scripts/warm-cache.sh                       # production
bash scripts/warm-cache.sh http://localhost:3000 # local dev
```

- `--sync` copies the JSON(s) into the Nextcloud Shop folder so the live site picks them up without redeployed.
- The enrich script skips photos that already have a title — safe to re-run.
- Filename convention after enrichment: `<category>_<location>_<title>.jpg` (e.g. `landscape_norway_glacier_descending_through_autumn_valley.jpg`)
- The generate-collections script merges with existing collections (preserves descriptions, badges, coverPhoto).
- After any tag cleanup, run `sync-tags-to-exif.mjs` to write changes back to EXIF — keeps digiKam and generate script in sync.

### Publishing checklist — adding or updating photos

Full details in `docs/photography-workflow.md`. Quick reference:

**Before export (digiKam):** set XMP Title, Description, IPTC Location, and Subject tags on every photo.

**After Darktable export to `~/Nextcloud/Photography/Workspace/03_Exports/Shop/`:**

```bash
# 1. Scan EXIF → update photos.json + copy to Nextcloud
bash scripts/generate-photos-json.sh \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json --sync

# 2. AI enrichment — titles, descriptions, rename (skips existing titles)
ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-photo-metadata.mjs \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json \
  content/photography/collections.json --sync

# 3. Update collections
node scripts/generate-collections.mjs \
  content/photography/photos.json \
  content/photography/collections.json \
  --sync ~/Nextcloud/Photography/Workspace/03_Exports/Shop

# 4. (If you edited tags manually in photos.json) sync back to EXIF
node scripts/sync-tags-to-exif.mjs \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json

# 5. Commit and deploy
git add content/photography/photos.json content/photography/collections.json
git commit -m "photos: add <description>"
git push origin main

# 6. Bust cache immediately
curl -X POST "https://julianruizburgos.net/api/revalidate?secret=YOUR_ADMIN_SECRET"

# 7. Warm image cache
bash scripts/warm-cache.sh
```

**Tag conventions (2026-04-07):**
- Always singular (`mountain` not `mountains`, `cloud` not `clouds`, `flower` not `flowers`)
- Always lowercase
- High-level contextual categories only — no species names (use `insect` not `crane fly`), no colours, no props, no material details
- Target: ~100 unique tags across the full gallery; 1-count tags should be rare exceptions

### Nextcloud env vars (set in Coolify)
- `NEXTCLOUD_WEBDAV_URL`: `https://221015zlatrl2k5kune.nextcloud.hosting.zone/remote.php/dav/files/JulianRuizBurgos`
- `NEXTCLOUD_USER`: `JulianRuizBurgos`
- `NEXTCLOUD_APP_PASSWORD`: (app password — not login password)
- `NEXTCLOUD_PHOTOS_PATH`: `Photography/Workspace/03_Exports/Shop`

**On-demand cache revalidation:**
After running `--sync` to push updated JSONs to Nextcloud, force an immediate cache bust (instead of waiting up to 5 min):
```bash
curl -X POST "https://julianruizburgos.net/api/revalidate?secret=YOUR_ADMIN_SECRET"
```
Endpoint: `app/api/revalidate/route.ts` — protected by `ADMIN_SECRET` env var.

**`photos.json` entry shape:**
```json
{
  "filename": "my_photo.jpg",
  "title": "My Photo",
  "date": "YYYY-MM-DD",
  "location": "Location name",
  "description": null,
  "tags": ["wildlife", "birds"],
  "widthPx": 6000,
  "heightPx": 4000,
  "aspectRatio": 1.5,
  "camera": "Olympus OM-D E-M5 Mark II · 40-150mm F4-5.6",
  "sortOrder": null
}
```

**Print availability:**
- All photos are available as prints and postcards — no per-photo flag needed
- Available print sizes are computed at runtime in `lib/shop.ts` from `widthPx`/`heightPx`, `aspectRatio`, and the customer's chosen `presentationStyle` (`'bordered'` or `'borderless'`) — see the pricing section for the full logic
- `printAvailable` and `printSizes` fields in existing `photos.json` entries are **deprecated** — remove when implementing the shop
- The "Print available" badge in `PhotographyGallery.tsx` and `CollectionView.tsx` should be removed at that point too

**`collections.json` entry shape:**
```json
{
  "slug": "my-collection",
  "title": "My Collection",
  "description": "Short description.",
  "coverPhoto": "cover.jpg",
  "photos": ["photo1.jpg", "photo2.jpg"]
}
```

**Key rules:**
- `aspectRatio`, `widthPx`, and `heightPx` all come from EXIF — do not enter manually. Use `scripts/generate-photos-json.sh` to populate them. Values are cached in `photos.json` so the site never needs to read EXIF at request time (important for Nextcloud images in production).
- `widthPx`/`heightPx` are used by `lib/shop.ts` to compute which print sizes are available at sufficient quality.
- `sortOrder` null = sort by date descending. Set integers to force order within a collection.
- `PrintSize` valid values: `"A4"` `"A3"` `"A3+"` `"20×30 cm"` `"30×40 cm"` `"40×60 cm"` `"50×70 cm"` `"A2"` `"60×80 cm"` `"A2+"` `"Panoramic"` — postcards are always `"A6"` (10×15 cm), not in this list. **A2+ is the maximum fixed size** (printer cut sheet max). `"Panoramic"` is a variable-length roll print — see pricing section. A0/A1 and the old square/custom sizes are retired. See the pricing section for aspect ratio guidance — `30×40 cm` and `60×80 cm` are the recommended primary sizes for Julian's 4:3 Olympus images.
- `PresentationStyle` type: `'bordered' | 'borderless'` — stored on each cart line item and order record. See the pricing section for the full design decision and implementation guidance.
- Local dev images live in `public/photography/dev/` — served via the proxy route at `/photography/images/[filename]`, not directly from `public/`.
- **Never import `lib/photography.ts` from a client component** — it uses `fs/promises`. Only `import type` is safe across the boundary.

## Infrastructure
- Hetzner CX23 VPS at 204.168.183.129 (Helsinki), Ubuntu 24.04
- Docker + Coolify, Traefik on ports 80/443
- Site live at https://julianruizburgos.net
- Auto-deploy on push to `main` — build happens on the server
- SSL via Let's Encrypt
- GreenNet managing DNS and email (@julianruizburgos.net)

## Current status (2026-04-07)
- [x] Next.js 16.1.6 + TypeScript + Tailwind v4 + App Router
- [x] shadcn/ui components installed
- [x] Design system: 3-colour palette consolidated (terracotta / stone+navy / olive). plum and sage removed. forest-900 merged into earth-900.
- [x] Homepage: full-screen hero + Ken Burns animation + section cards (section accent lines use correct palette colours)
- [x] Navigation: floating HOME + MENU + cart icon, slide-in sidebar — section-aware background colour (stone/navy/olive/earth by pathname) at 60% opacity with backdrop blur
- [x] IT Consulting page: dark navy-700 header + services + case studies (editorial style)
- [x] IT case study detail page (`/it/[slug]`)
- [x] Ecology page: header with background photo + dark overlay (content placeholder — coming soon)
- [x] Blog: three-panel reader (desktop) + full-screen article (mobile). Header has background photo + dark overlay. Reads from `content/blog/` via filesystem. Topic + tag filtering. Folder-per-post with co-located assets. PDF embed support. Footnotes work in all browsers.
- [x] "Now Listening" widget: fixed pill (bottom-centre), animated bars. Update via `lib/listening.ts`.
- [x] Under construction banner: floating pill just below Now Listening widget (bottom-centre).
- [x] Hetzner VPS + Coolify + auto-deploy. Persistent volume for Next.js image cache at `/app/.next/cache/images`. `minimumCacheTTL: 31536000` set in `next.config.ts`.
- [x] Photography section: header with background photo + dark overlay + infinite collections carousel (desktop) + mobile "See Collections" button + free-text search + sidebar nav (tag filter only) + masonry grid + lightbox. Tag + search filtering. `lib/photography.ts` data layer with Nextcloud WebDAV + local dev fallback. Image proxy route.
- [x] Lightbox close button: bottom-centre on mobile (thumb-reachable), top-right on desktop (`md:` breakpoint)
- [x] Photography collections: `/photography/collections` index + `/photography/collections/[slug]` detail pages. Cover cards with vignette effect.
- [x] Image optimisation: Next.js `<Image>` with AVIF/WebP formats, `sizes` prop on gallery/collection grids, server-side cache in `.next/cache/images`. Lightbox capped at 1200px. Copyright overlay on lightbox.
- [x] **Print shop** — fully built and tested end-to-end with Mollie test mode (2026-04-04). Code complete. NOT going live yet — blocked on Mollie onboarding + price/paper type validation. See shop section below.
- [x] **Nextcloud photo integration live** (2026-04-06) — 60+ photos served from Nextcloud WebDAV. Real EXIF data in `photos.json`. Env vars set in Coolify (see Infrastructure section).
- [x] **Photography metadata pipeline** (2026-04-06) — three scripts in `scripts/` handle the full workflow from raw export to published gallery (see Photography content pipeline below).
- [x] **6 collections live**: Urban Photography, Landscapes, Macro & Nature, Architecture, Still Life, Astrophotography.
- [x] **On-demand cache revalidation** (2026-04-07) — `POST /api/revalidate?secret=...` busts `photos` cache tag immediately after Nextcloud sync. Photos cache window: 5 min. See Photography content pipeline section for usage.
- [x] **Tag cleanup** (2026-04-07) — reduced from 213 → 96 unique tags. All singular, lowercase, high-level only. `scripts/sync-tags-to-exif.mjs` writes cleaned tags back to EXIF so re-running the generate script doesn't overwrite them.
- [x] **Footer** (2026-04-07) — fixed at bottom of viewport (always visible), shows legal links only within photography/shop/legal routes.
- [x] **Contact page** (2026-04-07) — company logo displayed alongside business details. Country field in checkout replaced with full-name dropdown (ISO2 stored internally).
- [x] **`middleware.ts` → `proxy.ts`** (2026-04-07) — renamed per Next.js 16 convention to silence deprecation warning.
- [x] **Resend email integration** (2026-04-07) — account created, API key set in Coolify, domain `mail.julianruizburgos.net` added. Awaiting GreenNet DNS records + verification.

## Roadmap

### In progress / next
1. **Print shop go-live** — end-to-end tested with Mollie test mode (2026-04-04). **Blocked on**:
   - [x] PostgreSQL on Hetzner VPS — live
   - [x] `DATABASE_URL` set in Coolify
   - [x] `MOLLIE_API_KEY` set (test key — swap to live key when ready)
   - [x] `NEXT_PUBLIC_BASE_URL` set
   - [x] `ADMIN_SECRET` set
   - [x] End-to-end test with Mollie test mode — passed
   - [x] Mollie onboarding complete — cards, iDEAL, and payouts all activated (2026-04-07)
   - [x] Swap `MOLLIE_API_KEY` to live key (2026-04-07)
   - [x] `RESEND_API_KEY` set — `mail.julianruizburgos.net` verified in Resend (2026-04-08). FROM: `orders@mail.julianruizburgos.net`, Reply-To: `printshop@julianruizburgos.net`
   - [x] Validate and set real prices + paper types in `lib/shop.ts` — **see pricing section below**

### Next (post go-live)
2. **Edition numbering** — sequential print numbers + certificate of authenticity. DB changes needed: `print_edition_number` column on `order_items`, `edition_count` counter per photo. Assign number in Mollie webhook handler, include in customer + Julian emails.

3. **NL free shipping** — absorb €6.35–7.45 PostNL domestic cost for Netherlands orders. Show "Free shipping" at checkout for NL; server-side route adds €0 shipping. No change to international rates.

### Planned
4. **Internationalisation (i18n)** — English + Spanish initially, designed to extend to further languages. Architecture is decided (see section below). **Defer until after shop go-live** — touches every route, best done in one focused pass.

5. **Accessibility (high priority — treat this seriously throughout)**
   The goal is a site that works genuinely well for people with a wide range of disabilities — visual, motor, cognitive, neurological, and situational. Not checkbox compliance; real usability. This is a first-class design constraint, not an afterthought.

   **First step — research (do this before implementing anything):**
   - [ ] Research the full landscape of web accessibility needs and standards. Specifically: what disability categories affect web use (visual, motor, cognitive, neurological, deafness/hearing loss, speech, situational/temporary); what WCAG 2.2 levels AA and AAA require and why; what assistive technologies exist (screen readers, switch access, eye tracking, voice control, magnification); what the most common failure modes are on portfolio/content sites specifically. Produce a prioritised list of what to implement for this site, with rationale.

   **Known items to implement (expand after research):**
   - [ ] Semantic HTML audit across all pages — correct landmark regions (`<main>`, `<nav>`, `<article>`, etc.), heading hierarchy, descriptive link text, alt text on all images
   - [ ] Keyboard navigation — full site navigable without a mouse; visible focus indicators; no keyboard traps
   - [ ] Screen reader testing (NVDA on Linux, VoiceOver on iOS)
   - [ ] WCAG AA contrast compliance across all colour combinations (light and dark backgrounds)
   - [ ] `prefers-reduced-motion` — disable or reduce Ken Burns, card animations, transitions
   - [ ] **Audio narration for blog entries** — Julian records himself reading each post. HTML5 `<audio>` player in the article view, styled to match the design. Audio file lives in the post folder (`narration.mp3`); optional `audio` frontmatter field; served through the existing asset route.
   - [ ] Touch target sizes — minimum 44×44px for all interactive elements (important for motor difficulties and mobile)
   - [ ] `lang` attribute on translated pages (when translation is implemented)
   - [ ] Review whether the three-panel blog layout is navigable and usable with a screen reader or keyboard only

### Parking lot
- About page
- Ecology section (see content plan below)
- Configure health check in Coolify
- Video hero background (clean, watermark-free source needed)
- **Analytics dashboard** — deploy Umami (open source, self-hosted, GDPR-compliant) as a Docker container via Coolify on the same VPS. Add tracking script to `app/layout.tsx`. Access at a subdomain (e.g. `analytics.julianruizburgos.net`). Needs a second PostgreSQL DB and a GreenNet DNS subdomain.

---

## Internationalisation (i18n) — architecture decided, not yet implemented

English + Spanish initially; designed to extend to further languages. Defer until after shop go-live — this is a full-day refactor that touches every route in `app/`.

### UI strings
- Library: `next-intl` (App Router compatible)
- Locale files: `/locales/en/common.json`, `/locales/es/common.json`
- No database — locale files are version-controlled and deploy with the code

### Long-form content (blog, ecology, IT, etc.)
- One markdown file per locale **within the existing slug folder** — keeps co-located assets (images, PDFs, audio narration) intact:
  ```
  content/blog/[slug]/
    en.md          ← was index.md
    es.md          ← Spanish translation (optional — falls back to en)
    image.png      ← assets stay co-located
  ```
- The slug is the stable cross-language identifier; locale is the filename, not a parent folder
- `lib/blog.ts` (and equivalent content fetchers) accept a `locale` parameter and read `[locale].md`, falling back to `en.md`

### Routing
- `[locale]` dynamic segment at the top of `app/`: `app/[locale]/page.tsx`, `app/[locale]/blog/[slug]/page.tsx`, etc.
- Default locale: `en`; root `/` redirects to `/en` or detects browser preference via middleware
- Missing translations fall back to English (next-intl supports this natively)

### What goes under `[locale]` and what doesn't
**Under `[locale]`** — anything a visitor reads or interacts with in their language:
- All page routes: `/`, `/blog`, `/blog/[slug]`, `/photography`, `/collections`, `/it`, `/ecology`, `/about`, `/cart`, `/checkout`, `/checkout/success`, legal pages

**Outside `[locale]`** — server infrastructure, not user-facing content:
- `app/api/` — all API routes (checkout, webhooks, revalidate, orders, image proxy). No locale needed; these are called programmatically, not navigated to.
- `app/admin/` — internal order management; English only is fine.
- `app/photography/images/` — image proxy route; locale-independent.

### Translation approach for content
- Human translation (Julian writes ES himself, or commissions it) — do not use machine translation for ecology or IT writing; quality matters for professional credibility
- Photography UI strings (tags, size names, paper types) — machine translation is acceptable
- Blog: translate only posts worth translating; untranslated posts simply don't appear in the ES locale (or fall back to EN — decide at implementation time)

---

## Print shop — built and tested (2026-04-04), not yet live

### Payment
- **Mollie** — EU-based payment processor (migrated from Stripe 2026-04-03). Supports iDEAL, cards, and all major EU payment methods natively.
- Keys needed: `MOLLIE_API_KEY`, `NEXT_PUBLIC_MOLLIE_PROFILE_ID`, `MOLLIE_WEBHOOK_SECRET`

### Product types

**Photo prints** — standard wall prints. Customer picks size + paper type + presentation style.

**Postcards** — any photo, printed at A6 (10×15 cm). Customer provides:
- Recipient name + full destination address (street, city, postcode, country)
- Message text (the written side of the postcard)
- Text style: `"handwritten"` (Julian writes by hand) or `"printed"` (text printed on the card)
- Sender name (appears on the postcard)

Julian prints, addresses, and mails each postcard himself. No extra shipping address from the customer — the destination IS the mailing address.

Each postcard in the cart is a unique item (different recipient/message), so quantity is always 1 per cart line.

### Edition numbering (not yet implemented)
- Branding on prints/packaging/certificate: logo mark only, no text — "Ruiz Burgos Ecology and Software" tagline doesn't belong on photography materials
- Open edition — no maximum, prints on demand
- Each photo has a sequential print counter in the DB; increments on each order
- The number is recorded on the order and included on the certificate of authenticity
- e.g. "Leenderbos at Dusk II — print #47" — a personal record, not a scarcity claim
- DB change needed: `print_edition_number` column on `order_items`; `edition_count` counter per photo (separate table or on a future `photos` table)

### Decisions made (implemented in `lib/shop.ts`)
- **Paper types**: see pricing section below for validated values — replace the placeholder ranges
- **Presentation style**: `bordered` (default) or `borderless` — see pricing section for full design decision and implementation
- **Postcard price**: €5 flat rate
- **Minimum print DPI**: 200 DPI
- **Shipping**: see pricing section below for real PostNL 2026 zone-based rates — replace the placeholder flat rates

### Architecture overview

```
Cart (client state)
  └── React context + localStorage for persistence across pages

Product catalogue
  └── photos.json × paper/size/presentationStyle matrix in lib/shop.ts

Checkout flow
  ├── /cart                        — cart page, line items, subtotal
  ├── /checkout                    — shipping address form (prints only; postcards ship to recipient)
  └── Mollie hosted checkout       — card + iDEAL + all enabled EU methods

Server
  ├── app/api/checkout/route.ts          — creates Mollie payment
  ├── app/api/webhooks/mollie/route.ts   — payment confirmed → save order, send emails
  └── Database: orders + order_items + postcard_details tables

Post-payment
  ├── /checkout/success            — confirmation page with order number
  ├── Email to customer            — order confirmation with photo thumbnail + postcard details (via Resend)
  └── Email to Julian              — new order notification with everything needed to print/write/mail

Order management
  └── /admin/orders                — password-protected: list orders, mark dispatched, add tracking
```

### Key files
- `lib/shop.ts` — paper types, price matrix, presentation style logic, print size availability (min 200 DPI, ±7% aspect ratio tolerance for borderless; image-area DPI check with no ratio constraint for bordered)
- `lib/cart.tsx` — React context + localStorage cart state
- `lib/db.ts` — PostgreSQL schema + connection pool (tables: `orders`, `order_items`, `postcard_details`)
- `lib/email.ts` — Resend email templates (customer confirmation, Julian notification, dispatch)
- `components/PrintLightbox.tsx` — unified lightbox: image + size/paper/presentation selector or postcard form
- `app/cart/page.tsx` — cart page
- `app/checkout/page.tsx` — contact/shipping form + redirects to Mollie hosted checkout
- `app/checkout/success/` — confirmation page
- `app/api/checkout/route.ts` — creates Mollie payment, verifies prices server-side
- `app/api/webhooks/mollie/route.ts` — `payment.paid` → save order → send emails (idempotent)
- `app/api/orders/[id]/route.ts` — admin API: update status + tracking
- `app/admin/orders/` — Basic Auth protected order management UI
- `middleware.ts` — routing-level Basic Auth enforcement for `/admin/*`

### Fulfilment
Julian handles everything himself:
- **Prints**: prints on own photo printer, packages, ships with tracking. The `presentationStyle` field in the order determines whether the print driver is configured with margins (`bordered`) or full-bleed (`borderless`).
- **Postcards**: prints A6 postcard, handwrites or prints the message side, stamps, mails directly to recipient address

---

## Print shop — pricing data (validated 2026-04-06)

This section documents the researched and validated pricing system. Use it to update the placeholder values in `lib/shop.ts`. All prices are in euros, excluding VAT.

### Pricing methodology

Retail price (print only, excl. shipping) is calculated as:

```
retail = (paper_cost + ink_cost + packaging_cost + labour_cost) × markup × edition_multiplier
```

- **Default markup**: 3.5× production cost
- **Labour per order**: €15.00 (printing + QC + packaging + admin, ~20 min at €35–40/hr — often under-counted, do not remove)
- **Minimum viable price**: production cost (excl. shipping) × 1.20, rounded up to nearest €5
- All retail prices are rounded to the nearest €5
- **Shipping is never included in the print price — it is always a separate line item added at checkout** (see design principle below)

### Markup and pricing architecture — current vs planned

**Current implementation** (`lib/shop.ts`): validated retail prices are stored as `BASE_PRICE_CENTS` hardcoded at `MARKUP = 3.5`. Changing `MARKUP` scales all prices proportionally via `BASE_PRICE_CENTS[size][paper] × (MARKUP / 3.5)`. This works, but requires code changes and a redeploy to reprice.

**Planned improvement** (deferred until admin interface is built): move base production costs and the markup multiplier into the database — a `pricing` table (base cost per size/paper) and a `settings` table (markup, VAT rate). The checkout API and price display apply markup at runtime. This allows repricing without touching code or redeploying. Prerequisite: admin UI with a pricing management screen.

### Shipping separation — core design principle

**Do not bundle shipping into the print price. This is a firm architectural decision, not a convenience choice.**

The reason is that shipping costs vary dramatically by destination: a NL domestic order costs €6–7, while shipping to the US runs €21–36 for the same print. If shipping were folded into the displayed price, you would face an impossible tradeoff: either set a price that overcharges EU buyers to cover the worst-case international rate, or show different prices for the same print depending on where the visitor is browsing from — which is confusing, looks inconsistent in the gallery, and breaks price caching.

The correct pattern is:

1. **Gallery and product pages** show the print price only (e.g. "30×40 cm, Fine Art Cotton — €80"). No shipping mentioned here beyond a note like "Shipping calculated at checkout."
2. **Cart page** shows the print subtotal + a "Shipping — calculated at checkout" placeholder line. The total shown in the cart is therefore the print subtotal only, clearly labelled as such.
3. **Checkout page** collects the delivery country (or full address) first. Once the country is known, the correct shipping zone and cost are resolved and shown before the customer proceeds to payment.
4. **`app/api/checkout/route.ts`** resolves the final shipping cost server-side from the country → zone → package category lookup (see table below) and adds it to the Mollie payment amount. The server always recomputes this — never trust a shipping cost passed from the client.
5. **The Mollie payment amount** = print subtotal + shipping cost + any applicable VAT.

The one deliberate exception: for NL domestic orders, consider absorbing the €6.35–7.45 shipping cost and displaying "Free shipping in the Netherlands." The amount is small relative to any print price and removes a friction point for local buyers. If you do this, the server-side route must still add €0 for shipping (not skip the calculation step entirely) so the logic path stays consistent.

### Aspect ratios and print sizing — design decision

**This section explains why the shop offers traditional photographic sizes (30×40, 60×80 cm etc.) alongside A-series, and how they should be handled in `lib/shop.ts`.**

The Olympus OM-D E-M5 Mark II produces images at a **4:3 aspect ratio** (width:height = 1.333). This is the native format of Micro Four Thirds sensors.

ISO A-series paper (A4, A3, A2…) follows a different ratio — **√2:1 ≈ 1.414** — by design, so that sheets halve cleanly. This means a 4:3 image printed on A-series paper is a mismatch. The image will either be cropped slightly to fill the paper edge-to-edge (changing the composition) or printed with white borders on two sides. The ±7% aspect ratio tolerance in `lib/shop.ts` means A-series sizes will pass the filter for 4:3 images in borderless mode, but the print will need borders or a minor crop in practice. This should be communicated to customers, not silently assumed.

Traditional photographic print sizes, by contrast, were designed around common sensor and film ratios and are standardised to fit off-the-shelf frames in homeware stores:

| Size | Ratio | Match for 4:3 Olympus | Off-the-shelf frames (NL/EU) |
|------|-------|-----------------------|------------------------------|
| 20×30 cm | 3:2 | ~11% crop needed | IKEA, HEMA, Xenos — very common |
| **30×40 cm** | **4:3** | **✓ perfect match** | **IKEA Ribba, HEMA — most popular frame size in NL** |
| 40×60 cm | 3:2 | ~11% crop needed | Available at larger homeware stores |
| **60×80 cm** | **4:3** | **✓ perfect match** | Specialty framers; less off-the-shelf but findable |
| 50×70 cm | 7:5 (1.4) | ~5% crop or tiny borders | Very popular NL poster/print size |
| A4 (21×29.7) | √2 | White borders on 4:3 | Universal — everywhere |
| A3 (29.7×42) | √2 | White borders on 4:3 | Universal — everywhere |

**Recommendation for `lib/shop.ts`:** Structure the size list with two tiers, and surface this to customers:

**Primary sizes** (image fills the paper, no borders, best framing experience):
- `"30×40 cm"` — flagship; perfect 4:3 match; most-framed size in European homes. This should be the default/highlighted option in the UI.
- `"60×80 cm"` — large premium format; same 4:3 match; beautiful statement piece.
- `"50×70 cm"` — very popular NL/European large format; tiny 5% crop from 4:3 is imperceptible.

**Secondary sizes** (A-series with white borders, or 3:2 with minor crop):
- `"A4"` and `"A3"` — accessible entry tier; cheap universal frames; white border is a classical fine art presentation style, not a defect, but must be described in the UI.
- `"40×60 cm"` — 3:2 ratio; requires a visible crop from 4:3 images; only offer for photos where the crop is pre-approved or the image has been composed with extra headroom.

**The ±7% aspect ratio tolerance in `lib/shop.ts`:** This tolerance correctly allows 4:3 images to be offered in A-series sizes (√2:1 is ~6% away from 4:3) and in 50×70 (7:5 is ~5% away). It will also allow 4:3 images in 40×60 (3:2 is ~11% away — this is outside the ±7% tolerance and will be correctly filtered out for borderless, which is the right behaviour). Do not widen the tolerance to accommodate 40×60 in borderless mode — the crop would be noticeable. Note that in bordered mode, the aspect ratio filter does not apply at all (see section below).

### Bordered vs borderless presentation — design decision and implementation

**The customer chooses a presentation style for each print. The default is `bordered`. Both options are the same price.**

**What each means:**

`bordered` (default, Julian's preference): The image is printed smaller than the paper, centred within it, surrounded by a clean white margin on all sides. This is the traditional fine art / gallery presentation — it is what you see on museum prints and in photography galleries. The white border gives the image visual breathing room, protects the image when framed (the frame grip covers border rather than image), and allows the print to be re-matted in different frame configurations without touching the image itself. Julian personally prefers this for framing and it should be the default option.

`borderless`: The image fills the paper completely, edge to edge. This is the commercial / poster presentation style. It is appropriate when the customer has a specific frame and wants the image to fill it without any white space.

**How presentation style affects size availability — this is the critical logic change:**

For `borderless` prints, the existing availability logic applies unchanged: the image's aspect ratio must match the paper's aspect ratio within ±7%, and the image must have sufficient resolution to fill the paper at 200 DPI minimum.

For `bordered` prints, the logic is different in two important ways. First, the aspect ratio check is **dropped entirely** — the image is printed at its native ratio regardless of the paper shape; the border absorbs any ratio difference. A 4:3 image on A3 paper with a border simply has slightly asymmetric left/right vs top/bottom borders, which is normal and intentional. Second, the DPI check is applied to the **image area** (paper minus the borders), not the full paper size. Since the image area is smaller than the paper, the same photo qualifies for a larger range of sizes in bordered mode than in borderless mode.

The practical consequence is that switching from borderless to bordered in the UI will unlock more available sizes for most photos. This should be reflected in real time in `components/PrintLightbox.tsx` — the size list should update when the customer toggles between the two styles.

**Standard border widths — export these as `BORDER_WIDTH_MM` in `lib/shop.ts`:**

| Package category | Border width | Applies to |
|-----------------|-------------|------------|
| `small` | 20 mm | A4, A3, 20×30 cm, 30×40 cm |
| `medium` | 25 mm | A3+, 40×60 cm, 50×70 cm, A2, A2+ |
| `large` | 30 mm | 60×80 cm |

The convention is equal margins on all four sides. The image is centred. There is no "extra space at top" variant for now — equal borders are simpler and look clean.

**Image area dimensions for each size** (paper minus 2× border width, used for DPI check in bordered mode):

| Size | Paper (mm) | Border | Image area (mm) | Image area (cm) |
|------|-----------|--------|-----------------|-----------------|
| A4        | 210 × 297  | 20 mm | 170 × 257 | 17.0 × 25.7 |
| 20×30 cm  | 200 × 300  | 20 mm | 160 × 260 | 16.0 × 26.0 |
| A3        | 297 × 420  | 25 mm | 247 × 370 | 24.7 × 37.0 |
| 30×40 cm  | 300 × 400  | 25 mm | 250 × 350 | 25.0 × 35.0 |
| A3+       | 320 × 450  | 25 mm | 270 × 400 | 27.0 × 40.0 |
| 40×60 cm  | 400 × 600  | 25 mm | 350 × 550 | 35.0 × 55.0 |
| 50×70 cm  | 500 × 700  | 25 mm | 450 × 650 | 45.0 × 65.0 |
| A2        | 420 × 594  | 25 mm | 370 × 544 | 37.0 × 54.4 |
| 60×80 cm  | 600 × 800  | 30 mm | 540 × 740 | 54.0 × 74.0 |
| A2+       | 432 × 610  | 25 mm | 382 × 560 | 38.2 × 56.0 |

**Implementation guidance for `lib/shop.ts`:**

Export a `PresentationStyle` type: `'bordered' | 'borderless'`.

Add a `getAvailableSizes(photo: Photo, style: PresentationStyle): PrintSize[]` function with this logic:

```typescript
// For borderless: existing logic — both ratio check AND paper-level DPI check
// For bordered: image-area DPI check only — NO ratio check
function getAvailableSizes(photo: Photo, style: PresentationStyle): PrintSize[] {
  return ALL_SIZES.filter(size => {
    if (style === 'borderless') {
      // Must have sufficient resolution to fill the paper at 200 DPI
      const requiredPx = size.longEdgeMm * (200 / 25.4)
      if (photo.longEdgePx < requiredPx) return false
      // Must match paper aspect ratio within ±7%
      const ratioDiff = Math.abs(photo.aspectRatio - size.aspectRatio) / size.aspectRatio
      return ratioDiff <= 0.07
    } else {
      // bordered: check resolution against image area, not paper
      const imageArea = getImageArea(size) // returns { longEdgeMm, shortEdgeMm }
      const requiredPx = imageArea.longEdgeMm * (200 / 25.4)
      return photo.longEdgePx >= requiredPx
      // No aspect ratio check — border absorbs the difference
    }
  })
}
```

Also export `getImageArea(size: PrintSize): { longEdgeMm: number, shortEdgeMm: number }` — this is used both in the availability logic above and in the UI to show the customer the actual image dimensions.

**What to store on each order line item:**

`presentationStyle: PresentationStyle` must be stored on `order_items` in the database. Julian needs this when printing — it determines whether to configure the printer driver with margins (`bordered`) or full-bleed (`borderless`). It must also appear in the Julian notification email and the order management UI (`/admin/orders`).

**UI guidance for `components/PrintLightbox.tsx`:**

Show a toggle or two-option selector near the top of the print configuration panel, before the size selector. Label the options clearly:

- "With white border" (default, shown first) — add a parenthetical like "(recommended for framing)"
- "Borderless / full-bleed"

When the customer switches between the two options, recalculate and re-render the available size list immediately. Sizes that were unavailable in borderless mode may appear in bordered mode, and the customer should see this happen — it communicates that the bordered option gives more choice.

For any given size, show the customer both the paper dimensions and, for bordered prints, the image area: e.g. "30×40 cm paper · image printed at 25×35 cm." This is important because a customer who plans to mount the print with a cut mat needs to know the actual image dimensions.

Do not add a price difference between the two options. The paper cost is the same (same sheet); the ink is marginally less for bordered prints but the difference is negligible. Presentation style is a free choice.

### Paper types (three tiers)

Replace the placeholder paper types in `lib/shop.ts` with these:

| ID | Display name | Description | Example product |
|----|-------------|-------------|-----------------|
| `matte` | Premium Matte | Matte photo paper, accessible entry tier. Good DMax for B&W, versatile. | Epson Enhanced Matte, Canson BFK Rives |
| `cotton` | Fine Art Cotton | Matte cotton rag, archival quality. Best for landscape and nature — flagship option. | Hahnemühle Photo Rag 308g |
| `baryta` | Baryta | Semi-glossy, deep blacks, darkroom feel. Ideal for wildlife and B&W. | Hahnemühle FineArt Baryta 325g |

### Production costs per print (€)

These are the internal cost components — not shown to customers, used to verify margin. Labour (€15.00) is added once per order, not per print.

| Size | Dimensions | Ratio | Paper: Matte | Paper: Cotton | Paper: Baryta | Ink | Packaging |
|------|------------|-------|-------------|--------------|--------------|-----|-----------|
| A4        | 21 × 29.7 cm  | √2:1  | 0.90  | 1.80  | 2.00  | 1.00 | 2.00 |
| 20×30 cm  | 20 × 30 cm    | 3:2   | 0.85  | 1.70  | 1.90  | 1.10 | 2.00 |
| A3        | 29.7 × 42 cm  | √2:1  | 1.60  | 3.20  | 3.60  | 1.80 | 2.50 |
| 30×40 cm  | 30 × 40 cm    | 4:3 ✓ | 1.50 | 3.00  | 3.40  | 1.90 | 2.50 |
| A3+       | 32 × 45 cm    | √2:1  | 2.00  | 4.00  | 4.50  | 2.20 | 3.00 |
| 40×60 cm  | 40 × 60 cm    | 3:2   | 3.00  | 5.80  | 6.50  | 3.30 | 3.50 |
| 50×70 cm  | 50 × 70 cm    | 7:5   | 3.50  | 6.50  | 7.00  | 3.80 | 3.80 |
| A2        | 42 × 59.4 cm  | √2:1  | 3.20  | 6.00  | 6.80  | 3.50 | 3.50 |
| 60×80 cm  | 60 × 80 cm    | 4:3 ✓ | 6.00 | 11.50 | 13.00 | 6.50 | 5.00 |
| A2+       | 43.2 × 61 cm  | √2:1  | 3.40  | 6.50  | 7.20  | 3.80 | 3.80 |

### Validated retail prices (€, open edition, excl. shipping)

These are the values to set in `lib/shop.ts`. Rounded to nearest €5, based on 3.5× markup. Prices are the same regardless of presentation style (bordered or borderless). Sizes marked ✓ are the recommended primary options for Julian's 4:3 Olympus images.

| Size | Ratio | Matte | Cotton | Baryta |
|------|-------|-------|--------|--------|
| A4        | √2:1  | 35    | 50     | 55     |
| 20×30 cm  | 3:2   | 40    | 55     | 60     |
| A3        | √2:1  | 55    | 80     | 85     |
| **30×40 cm** ✓ | **4:3** | **55** | **80** | **85** |
| A3+       | √2:1  | 65    | 95     | 100    |
| 40×60 cm  | 3:2   | 85    | 120    | 130    |
| 50×70 cm  | 7:5   | 100   | 145    | 155    |
| A2        | √2:1  | 90    | 135    | 145    |
| **60×80 cm** ✓ | **4:3** | **140** | **200** | **215** |
| A2+       | √2:1  | 95    | 140    | 150    |

### Panoramic roll prints — variable-length format

**Printer**: Epson SC-P900, roll unit. Fixed width: **432 mm** (17"). Length: computed per photo from its aspect ratio.

**When to offer it**: only when the photo's natural print length at 432mm wide would exceed the A2 long edge (594mm). Threshold:

```
longEdgeMm = 432 × aspectRatio
offer panoramic if longEdgeMm > 594   →   aspectRatio > 1.375
```

A standard 4:3 Olympus image (ratio 1.333) gives 576mm — does **not** trigger panoramic (fits within A2). Only genuinely wide images (16:9 = 1.778, 2:1, 3:1, etc.) get this option.

**Alongside A2**: panoramic is offered **in addition to** A2 for photos that qualify, not instead of it.

**Display name in shop UI**: `Panoramic (432 × <N> mm)` — where N = `Math.round(432 × aspectRatio)`. Shown per-photo; no fixed label.

**Pricing**: proportional to A2 price, based on print length:

```
panoramicPrice(paper) = A2_price(paper) × (432 × aspectRatio / 594)
```

Round to the nearest €5. e.g. a 16:9 photo (ratio 1.778): length = 768mm, factor = 768/594 = 1.29 → price = A2 price × 1.29.

**Shipping category**: always `large` (postal tube).

**Presentation style**: bordered only — borderless on a variable-length panoramic is complex and not offered. Do not show the bordered/borderless toggle for panoramic prints.

**Implementation notes for `lib/shop.ts`**:
- `"Panoramic"` is a special case in the `PrintSize` union — its dimensions are not in `PRINT_SIZE_DIMS_MM` (they vary per photo)
- `getAvailablePrintSizes()` should return `"Panoramic"` when `aspectRatio > 1.375` and the photo has sufficient resolution: `longEdgePx >= (432 × aspectRatio / 25.4) × 200`
- `getPriceCents(size, paper, photo?)` needs an overload for `"Panoramic"` that computes the proportional price from A2
- The cart item must store the computed dimensions (`panoramicLengthMm`) alongside the size label

### Edition multipliers

Applied on top of the base retail price when edition type is set per-photo (not yet implemented in shop, planned):

| Edition type | Multiplier | Notes |
|-------------|-----------|-------|
| Open edition | ×1.0 | No limit, prints on demand |
| Limited ×25 | ×1.25 | Number + sign each print, include certificate of authenticity |
| Limited ×10 | ×1.50 | Strictly enforced limit; certificate required |

### Market range reference (European direct-to-consumer fine art photography, April 2026)

Used to sanity-check pricing is competitive. Sources: Dutch market (Fotografie voor Goed, WhiteWall EU, independent photographer storefronts).

| Size | Matte | Cotton | Baryta |
|------|-------|--------|--------|
| A4 / 20×30 cm  | €30–€50  | €40–€65   | €45–€70   |
| A3 / 30×40 cm  | €45–€70  | €65–€95   | €70–€100  |
| A3+ / 40×60 cm | €55–€90  | €80–€120  | €90–€130  |
| 50×70 / A2     | €90–€130 | €130–€180 | €140–€195 |
| 60×80 / A2+    | €120–€170| €175–€250 | €190–€270 |

### Shipping zones and rates (PostNL January 2026 tariffs)

Replace the three flat rates (`NL €4.50 / EU €7.50 / Worldwide €12.00`) in `lib/shop.ts` with this zone-based system.

**Package category by print size** (determines which PostNL rate applies):

| Print size | Package category | Approx. weight | Packaging method |
|------------|----------------|----------------|-----------------|
| A4, A3, 20×30 cm, 30×40 cm | `small` | ~400–700 g | Flat rigid mailer |
| A3+, 40×60 cm, 50×70 cm, A2, A2+ | `medium` | ~700–1400 g | Postal tube or flat box |
| 60×80 cm | `large` | ~1500 g | Large postal tube |

**Shipping cost per zone and package category (€, online franking, track & trace included):**

| Zone ID | Countries | Small | Medium | Large |
|---------|-----------|-------|--------|-------|
| `NL` | Netherlands | 6.35 | 7.45 | 7.45 |
| `BE` | Belgium | 9.50 | 10.00 | 13.75 |
| `EUR1` | Germany, France, Austria, Spain, Italy, Sweden, Denmark, Luxembourg | 10.00 | 11.00 | 14.50 |
| `EUR2` | Other EU (Poland, Czech Republic, Hungary, etc.) | 12.00 | 14.00 | 18.00 |
| `UK` | United Kingdom | 12.00 | 14.00 | 22.00 |
| `US` | USA, Canada | 21.00 | 26.00 | 36.00 |
| `ROW` | Rest of World | 25.00 | 32.00 | 45.00 |

Source: PostNL tarievenfolder January 2026 (official PDF, verified April 2026).

**Implementation notes:**
- Map the customer's delivery country (ISO 3166-1 alpha-2 code) to a zone in `app/api/checkout/route.ts`. The mapping lives server-side only.
- The checkout form collects the full delivery address including country before the customer proceeds to the Mollie payment step.
- Always recompute the shipping cost server-side from the submitted country — never accept a shipping amount from the client payload.
- Consider restricting to EU + UK initially — US shipping is expensive and subject to ongoing regulatory changes (10-digit HS codes required and increased import duties effective August 2025).

### VAT

- Photography prints sold by their creator qualify for **9% BTW** (reduced artwork rate) in the Netherlands — not 21%.
- All prices in `lib/shop.ts` should be stored **excl. VAT**. Add 9% at the checkout display layer.
- For B2C EU cross-border sales: OSS (One Stop Shop) scheme applies once combined EU sales exceed €10,000/year. Below that threshold, Dutch 9% BTW applies to all EU sales.
- **Do not apply 21% BTW to print sales** — this is the standard goods rate and does not apply here.
- Confirm with a Dutch accountant before going live. This note is not legal advice.

---

## Ecology section — content plan

The ecology section establishes Julian's professional identity as an ecologist. It is **not** a blog — it is a professional profile, parallel to the IT consulting section. Planned content:

- **Consulting** — services offered (ecological surveys, impact assessments, etc.), target clients
- **Research** — summary of research background, topics, methods
- **Publications** — list of academic/professional publications, with links where available

Accent colour: **olive** (yellow-green tones, defined in globals.css). Editorial style matching the IT section (top-rule cards, earth-900 headings).

## Dev workflow
```bash
npm run dev       # local dev server at localhost:3000
npm run build     # production build — always run before committing
npm run lint      # ESLint
```

**Node**: must use v20+. Run `nvm use 20` if needed (default is now set to 20).
**Deploy**: push to `main` → Coolify auto-deploys. No manual steps needed.
