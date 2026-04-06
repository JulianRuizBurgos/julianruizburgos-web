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
```

- `--sync` copies the JSON(s) into the Nextcloud Shop folder so the live site picks them up without redeploying.
- The enrich script skips photos that already have a title — safe to re-run.
- Filename convention after enrichment: `<category>_<location>_<title>.jpg` (e.g. `landscape_norway_glacier_descending_through_autumn_valley.jpg`)
- The generate-collections script merges with existing collections (preserves descriptions, badges, coverPhoto).

### Nextcloud env vars (set in Coolify)
- `NEXTCLOUD_WEBDAV_URL`: `https://221015zlatrl2k5kune.nextcloud.hosting.zone/remote.php/dav/files/JulianRuizBurgos`
- `NEXTCLOUD_USER`: `JulianRuizBurgos`
- `NEXTCLOUD_APP_PASSWORD`: (app password — not login password)
- `NEXTCLOUD_PHOTOS_PATH`: `Photography/Workspace/03_Exports/Shop`

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
- Available print sizes are computed at runtime in `lib/shop.ts` from `widthPx`/`heightPx` and `aspectRatio`
- Logic: filter the master size list to those whose long edge fits within the photo's resolution at a minimum print DPI (e.g. 200 DPI); then filter to sizes whose aspect ratio matches the photo's aspect ratio within a tolerance (e.g. ±5%)
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
- `PrintSize` valid values: `"A4"` `"A3"` `"A2"` `"A1"` `"A0"` `"30×30 cm"` `"40×40 cm"` `"50×50 cm"` `"20×25 cm"` `"20×30 cm"` `"30×40 cm"` `"30×45 cm"` `"40×60 cm"` `"50×75 cm"` — postcards are always `"A6"` (10×15 cm), not in this list
- Local dev images live in `public/photography/dev/` — served via the proxy route at `/photography/images/[filename]`, not directly from `public/`.
- **Never import `lib/photography.ts` from a client component** — it uses `fs/promises`. Only `import type` is safe across the boundary.

## Infrastructure
- Hetzner CX23 VPS at 204.168.183.129 (Helsinki), Ubuntu 24.04
- Docker + Coolify, Traefik on ports 80/443
- Site live at https://julianruizburgos.net
- Auto-deploy on push to `main` — build happens on the server
- SSL via Let's Encrypt
- GreenNet managing DNS and email (@julianruizburgos.net)

## Current status (2026-04-06)
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

## Roadmap

### In progress / next
1. **Print shop go-live** — end-to-end tested with Mollie test mode (2026-04-04). **Blocked on**:
   - [x] PostgreSQL on Hetzner VPS — live
   - [x] `DATABASE_URL` set in Coolify
   - [x] `MOLLIE_API_KEY` set (test key — swap to live key when ready)
   - [x] `NEXT_PUBLIC_BASE_URL` set
   - [x] `ADMIN_SECRET` set
   - [x] End-to-end test with Mollie test mode — passed
   - [ ] Mollie onboarding complete (business activity, ID doc, bank account — in progress)
   - [ ] Swap `MOLLIE_API_KEY` to live key
   - [ ] `RESEND_API_KEY` set (Resend domain verification needed)
   - [ ] Validate and set real prices + paper types in `lib/shop.ts`

### Planned
4. **Automated translation** — serve the site in multiple languages. Decision needed: static (build-time, e.g. next-intl with translated markdown files) vs. dynamic (runtime machine translation API). Content-heavy so quality matters; ecology and IT writing should not sound like raw MT output.

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

## Print shop — built and tested (2026-04-04), not yet live

### Payment
- **Mollie** — EU-based payment processor (migrated from Stripe 2026-04-03). Supports iDEAL, cards, and all major EU payment methods natively.
- Keys needed: `MOLLIE_API_KEY`, `NEXT_PUBLIC_MOLLIE_PROFILE_ID`, `MOLLIE_WEBHOOK_SECRET`

### Product types

**Photo prints** — standard wall prints. Customer picks size + paper type.

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
- **Paper types**: Glossy (€25–€130), Matte (€28–€155), Fine Art Cotton (€45–€220)
- **Postcard price**: €5 flat rate
- **Minimum print DPI**: 200 DPI
- **Shipping**: NL €4.50 / EU €7.50 / Worldwide €12.00
- **Database**: PostgreSQL on Hetzner VPS (schema auto-initialises on first use)

### Architecture overview

```
Cart (client state)
  └── React context + localStorage for persistence across pages

Product catalogue
  └── photos.json × paper/size price matrix + postcard price in lib/shop.ts

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
- `lib/shop.ts` — paper types, price matrix, print size availability logic (min 200 DPI, ±7% aspect ratio tolerance)
- `lib/cart.tsx` — React context + localStorage cart state
- `lib/db.ts` — PostgreSQL schema + connection pool (tables: `orders`, `order_items`, `postcard_details`)
- `lib/email.ts` — Resend email templates (customer confirmation, Julian notification, dispatch)
- `components/PrintLightbox.tsx` — unified lightbox: image + size/paper selector or postcard form
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
- **Prints**: prints on own photo printer, packages, ships with tracking
- **Postcards**: prints A6 postcard, handwrites or prints the message side, stamps, mails directly to recipient address

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
