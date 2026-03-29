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
- **Content**: Markdown files in `/content` (no CMS — see content strategy below)
- **Version control**: GitHub
- **Hosting**: Hetzner CX23 VPS (Helsinki) — live at https://julianruizburgos.net
- **Deployment**: Coolify — auto-deploy on push to `main`, active
- **Payments**: Stripe (for print shop, not yet implemented)
- **Node**: v20+ required (v18 will fail the build)

## Design system (established 2026-03-29)

### Typography
- **Display/serif**: Playfair Display (`font-serif`) — headings, section titles, editorial voice
- **Body/sans**: Inter (`font-sans`) — body text, UI labels

### Colour palette (defined in `app/globals.css` via `@theme`)
- **Base**: `earth-50` (#faf8f5) — warm off-white, page background
- **Text**: `earth-900` (#241c16) — near-black, body text
- **Accent**: `terracotta-*` — rust/terracotta, used sparingly for CTAs and hover states
- **Section colours**: sage (ecology), amber (photography), plum (IT), stone (blog)

### Layout principles
- Photography leads — UI is minimal, images carry visual weight
- Generous negative space throughout
- No white cards with shadows — editorial top-rule style (`border-t-2`) instead
- Section cards: thin colour rule at top, serif heading, terracotta "Explore →" on hover

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
│   └── Checkout              (Stripe)
├── IT freelancing            (plum)
│   ├── Services + case studies
│   └── Contact
├── Ecology                   (sage — full ecology identity)
│   ├── Consulting
│   ├── Research
│   └── Publications
├── Blog                      (stone — general, multi-topic)
│   ├── All posts
│   └── Categories / [category]
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
  photography/page.tsx        # placeholder
  ecology/page.tsx            # placeholder
  blog/page.tsx               # placeholder
  about/page.tsx              # placeholder
  globals.css                 # Tailwind v4 config + custom palette + keyframes

components/
  ui/                         # Nav.tsx, Footer.tsx + shadcn/ui components

lib/
  it.ts                       # IT services & projects data
  utils.ts                    # cn() helper (shadcn)

content/                      # markdown files (Obsidian bridge)
  blog/
  ecology/
    publications/
    research/

public/
  images/                     # hero images (21:9 ultrawide crop in use)
  videos/                     # video backgrounds (watermarked Runway ML clip — not in use)

components.json               # shadcn/ui config
```

## Content strategy
Blog posts and ecology content are plain markdown files in `/content`. Julian writes in Obsidian and manually copies finished pieces into the relevant `/content` subfolder when ready to publish.

Key principle: page components never read markdown directly. They call functions from `/lib`. Swapping content source later only requires touching `/lib`.

**Design references**: stored in Obsidian at `02_Projects/Website/` — two markdown files and a folder of inspiration screenshots.

## Infrastructure
- Hetzner CX23 VPS at 204.168.183.129 (Helsinki), Ubuntu 24.04
- Docker + Coolify, Traefik on ports 80/443
- Site live at https://julianruizburgos.net
- Auto-deploy on push to `main` — build happens on the server
- SSL via Let's Encrypt
- GreenNet managing DNS and email (@julianruizburgos.net)

## Current status (2026-03-29)
- [x] Next.js 16.1.6 + TypeScript + Tailwind v4 + App Router
- [x] shadcn/ui components installed (button, card, dialog, sheet, badge, separator, aspect-ratio)
- [x] Design system established (palette, typography, layout principles)
- [x] Homepage: full-screen hero + Ken Burns animation + editorial section cards
- [x] Navigation: floating HOME + MENU, dark slide-in sidebar
- [x] IT Consulting page: services + case studies (editorial style)
- [x] IT case study detail page (/it/[slug])
- [x] Hetzner VPS + Coolify + auto-deploy
- [ ] Homepage section cards redesign (sketch pending from Julian)
- [ ] Photography gallery
- [ ] Print shop + Stripe integration
- [ ] Ecology section
- [ ] Blog with markdown rendering
- [ ] About page
- [ ] Configure health check in Coolify
- [ ] Video hero background (clean, watermark-free source needed)

## Dev workflow
```bash
npm run dev       # local dev server at localhost:3000
npm run build     # production build — always run before committing
npm run lint      # ESLint
```

**Node**: must use v20+. Run `nvm use 20` if needed (default is now set to 20).
**Deploy**: push to `main` → Coolify auto-deploys. No manual steps needed.
