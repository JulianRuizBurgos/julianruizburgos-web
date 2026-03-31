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
- **Payments**: Stripe (for print shop, not yet implemented)
- **Node**: v20+ required (v18 will fail the build)

## Design system

### Typography
- **Display/serif**: Playfair Display (`font-serif`) — headings, section titles, editorial voice
- **Body/sans**: Inter (`font-sans`) — body text, UI labels

### Colour palette (defined in `app/globals.css` via `@theme`)
- **Page background**: `earth-50` (#faf8f5) — warm off-white
- **Body text**: `earth-900` (#241c16) — near-black
- **Headings on light bg**: `forest-900` (#1b2d1f) — dark woodland green
- **Muted text on light bg**: `earth-600` — minimum for secondary/caption text
- **Muted text on dark bg**: `earth-300` or `earth-400`
- **Accent**: `terracotta-*` — rust/terracotta, used sparingly for CTAs and hover states
- **Section colours**: sage (ecology), amber (photography), plum (IT)
- **Do not use `earth-500` for text** — fails contrast on both light and dark backgrounds

### Layout principles
- Photography leads — UI is minimal, images carry visual weight
- Generous negative space throughout
- No white cards with shadows — editorial top-rule style (`border-t-2`) on inner pages
- Homepage section cards: full-height photo cards (80vh on desktop), grayscale→colour on hover, vertical serif label, dark overlay lifts on hover, terracotta "Explore →" fades up, thin accent line grows from left at bottom

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
  photography/page.tsx        # placeholder
  ecology/page.tsx            # placeholder
  about/page.tsx              # placeholder
  globals.css                 # Tailwind v4 config + custom palette + keyframes + prose-content CSS

components/
  BlogReader.tsx              # "use client" — interactive blog UI (filters, article view)
  ui/                         # Nav.tsx, Footer.tsx, NowListening.tsx + shadcn/ui components

lib/
  blog.ts                     # reads content/blog/ from filesystem (gray-matter + marked)
  it.ts                       # IT services & projects data
  utils.ts                    # cn() helper (shadcn)

content/
  blog/
    <slug>/
      index.md                # post content + frontmatter
      *.png / *.pdf / ...     # co-located assets (served via /blog/assets/<slug>/*)
    _template/
      index.md                # copy this when writing a new post

public/
  images/                     # hero images (21:9 ultrawide crop in use)

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

## Infrastructure
- Hetzner CX23 VPS at 204.168.183.129 (Helsinki), Ubuntu 24.04
- Docker + Coolify, Traefik on ports 80/443
- Site live at https://julianruizburgos.net
- Auto-deploy on push to `main` — build happens on the server
- SSL via Let's Encrypt
- GreenNet managing DNS and email (@julianruizburgos.net)

## Current status (2026-03-31)
- [x] Next.js 16.1.6 + TypeScript + Tailwind v4 + App Router
- [x] shadcn/ui components installed
- [x] Design system: forest-900 headings, earth-900 body text, terracotta accent
- [x] Homepage: full-screen hero + Ken Burns animation + section cards
- [x] Navigation: floating HOME + MENU, dark slide-in sidebar
- [x] IT Consulting page: services + case studies (editorial style)
- [x] IT case study detail page (`/it/[slug]`)
- [x] Blog: three-panel reader (desktop) + full-screen article (mobile). Reads from `content/blog/` via filesystem. Topic + tag filtering. Folder-per-post with co-located assets. PDF embed support. Footnotes work in all browsers.
- [x] "Now Listening" widget: fixed pill (bottom-centre), animated bars. Update via `lib/listening.ts`.
- [x] Hetzner VPS + Coolify + auto-deploy

## Roadmap

### In progress / next
1. **Nextcloud photo integration** — photography gallery reads from `Photography/Web-ready/` + `photos.json` manifest on Nextcloud. **Blocked on**: photography editing workflow decision (see global CLAUDE.md TODO).
2. **Print shop + Stripe** — product catalogue, checkout, order confirmation. No user accounts needed to launch.
3. **Admin interface** — manage content and orders without touching the repo.

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
- Ecology section
- Configure health check in Coolify
- Video hero background (clean, watermark-free source needed)

## Dev workflow
```bash
npm run dev       # local dev server at localhost:3000
npm run build     # production build — always run before committing
npm run lint      # ESLint
```

**Node**: must use v20+. Run `nvm use 20` if needed (default is now set to 20).
**Deploy**: push to `main` → Coolify auto-deploys. No manual steps needed.
