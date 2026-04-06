# julianruizburgos.net

Personal website for Julian Ruiz Burgos — photographer, ecologist, and IT consultant.

Live at **https://julianruizburgos.net**

---

## What this is

Two equal primary goals:
1. Showcase and sell fine art prints of landscape and wildlife photography
2. Advertise IT freelancing services

Secondary sections: Ecology (consulting, research, publications), Blog, About.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 — App Router, TypeScript |
| Styling | Tailwind CSS v4 — config via `@theme` in `app/globals.css` |
| Components | shadcn/ui, Lucide React, Radix UI |
| Content | Markdown in `content/blog/` (blog posts) |
| Photography | JPEGs served from Nextcloud WebDAV via proxy route |
| Payments | Mollie (EU payment processor — iDEAL, cards, all EU methods) |
| Database | PostgreSQL — orders, order items, postcard details |
| Hosting | Hetzner CX23 VPS (Helsinki) — Docker + Coolify |
| Email | Resend (transactional — order confirmations) |
| Node | v20+ required |

---

## Local development

```bash
nvm use 20        # Node 20+ required
npm install
npm run dev       # localhost:3000
npm run build     # production build — always run before committing
npm run lint      # ESLint
```

Environment variables needed locally (copy from Coolify for Nextcloud access):

```
NEXTCLOUD_WEBDAV_URL=
NEXTCLOUD_USER=
NEXTCLOUD_APP_PASSWORD=
NEXTCLOUD_PHOTOS_PATH=Photography/Workspace/03_Exports/Shop
```

Without these, the photo proxy falls back to `public/photography/dev/` for local placeholder images.

---

## Deployment

- **Push to `main` auto-deploys** via Coolify — no manual steps needed
- SSL via Let's Encrypt, DNS via GreenNet
- Persistent volume for Next.js image cache at `/app/.next/cache/images`

---

## Project structure

```
app/                          # Next.js App Router routes
  layout.tsx                  # Root layout — Nav + Footer
  page.tsx                    # Homepage
  about-printing/page.tsx     # Print sizes, paper types, bordered/borderless guide
  photography/
    page.tsx                  # Gallery — masonry grid, tag filter, lightbox
    collections/              # Collections index + detail pages
    images/[filename]/route.ts # Image proxy → Nextcloud WebDAV
  blog/page.tsx               # Blog reader
  it/page.tsx                 # IT consulting
  ecology/page.tsx            # Ecology (placeholder)
  cart/page.tsx               # Shopping cart
  checkout/page.tsx           # Checkout — shipping form → Mollie
  checkout/success/           # Order confirmation
  admin/orders/               # Order management (Basic Auth protected)
  api/
    checkout/route.ts         # Create Mollie payment, compute shipping server-side
    webhooks/mollie/route.ts  # payment.paid → save order → send emails
    revalidate/route.ts       # On-demand cache bust (POST with ADMIN_SECRET)

components/
  PrintLightbox.tsx           # Lightbox: photo detail + print/postcard ordering
  PhotographyGallery.tsx      # Gallery UI (client)
  CollectionView.tsx          # Collection detail (client)
  BlogReader.tsx              # Blog reader (client)
  ui/                         # Nav, Footer, NowListening + shadcn/ui

lib/
  shop.ts                     # Pricing, sizes, availability, shipping zones
  photography.ts              # Photo/Collection types + Nextcloud data fetching
  cart.tsx                    # Cart state (React context + localStorage)
  db.ts                       # PostgreSQL schema + query helpers
  email.ts                    # Resend email templates
  blog.ts                     # Blog post reader (filesystem)
  it.ts                       # IT services data

content/
  blog/<slug>/index.md        # Blog posts (folder-per-post, co-located assets)
  photography/photos.json     # Photo manifest (EXIF + metadata, synced from Nextcloud)
  photography/collections.json

scripts/
  generate-photos-json.sh     # Scan Shop folder → update photos.json via ExifTool
  enrich-photo-metadata.mjs   # Claude vision → titles, descriptions, rename files
  generate-collections.mjs    # Auto-generate collections from filename prefixes
  sync-tags-to-exif.mjs       # Write edited tags back to EXIF
  warm-cache.sh               # Pre-warm Next.js image cache after sync

docs/
  photography-workflow.md     # Full photo-to-live-site workflow reference
```

---

## Photography pipeline

Photos live on Nextcloud and are served via a proxy route. The site never reads EXIF at request time — all metadata is cached in `photos.json`.

Full workflow: **digiKam (cull/tag) → Darktable (edit/export) → scripts → git push → cache revalidate**

See [docs/photography-workflow.md](docs/photography-workflow.md) for the complete step-by-step guide.

---

## Print shop

Fully built, end-to-end tested with Mollie test mode. Not yet live — blocked on Mollie onboarding.

- 10 fixed print sizes + panoramic roll prints (variable-length, ratio > 1.375)
- 3 paper types: Premium Matte, Fine Art Cotton, Baryta
- Bordered (default) and borderless presentation styles
- Prices computed from production costs × markup (change `MARKUP` in `lib/shop.ts` to reprice all)
- Zone-based PostNL shipping (7 zones × 3 package categories, PostNL Jan 2026 tariffs)
- Postcards: any photo, A6, handwritten or printed, mailed directly to recipient
- 9% BTW (Dutch reduced artwork rate) applied at checkout

---

## Design system

Editorial, photography-forward. Full spec in `CLAUDE.md`.

- **Typography**: Playfair Display (serif) + Inter (sans)
- **Palette**: earth tones (`earth-*`), terracotta accent, stone blue (photography), navy (IT), olive (ecology)
- **Nav**: floating HOME (top-left) + MENU (top-right), dark slide-in sidebar
- **No sticky nav, no white cards with shadows**
