# Project context — julianruizburgos-web

## What this is
Personal website for Julian Ruiz Burgos. Two equal primary goals:
- Showcase and sell prints of amateur landscape and wildlife photography
- Advertise IT freelancing services

Secondary sections: Ecology (professional identity — consulting, research, publications), a general personal blog, and an About page.

## Stack
- **Framework**: Next.js 15, App Router, TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown files in `/content` (no CMS — see content strategy below)
- **Version control**: GitHub/GitLab
- **Hosting**: Hetzner VPS (pending — awaiting response from current host GreenNet)
- **Deployment**: Coolify (Git-based auto-deploy, to be set up once VPS is ready)
- **Payments**: Stripe (for print shop, not yet implemented)

## Visual direction
Clean and minimal with a natural/earthy feel. Lots of whitespace, muted earth tones, good typography, photos doing the heavy lifting. Define the earthy colour palette in `tailwind.config.ts`.

## Site architecture

```
Homepage
├── Photography & prints      (amber — combined gallery + shop)
│   ├── Galleries             (landscape, wildlife, series)
│   ├── Browse prints
│   └── Checkout              (Stripe)
├── IT freelancing            (purple)
│   ├── Services
│   └── Contact
├── Ecology                   (green — full ecology identity, not just freelancing)
│   ├── Consulting            (freelance ecology work)
│   ├── Research              (projects)
│   └── Publications          (papers & writing)
├── Blog                      (gray — general, multi-topic, not ecology-specific)
│   ├── All posts
│   └── Categories / [category]
└── About                     (footer-level, not main nav)
```

## Folder structure

```
src/
  app/                        # Next.js App Router routes
    layout.tsx                # root layout — nav, footer
    page.tsx                  # homepage
    photography/
      page.tsx                # gallery landing
      [slug]/                 # individual photo or series
      shop/
        page.tsx              # browse prints
        checkout/             # Stripe checkout flow
    it/
      page.tsx                # services overview
      contact/                # contact form
    ecology/
      page.tsx                # ecology landing
      consulting/
      research/
      publications/
    blog/
      page.tsx                # post list, all categories
      [slug]/                 # individual post
      categories/[category]/  # filter by topic
    about/
  components/
    ui/                       # shared: nav, footer, buttons, cards
    photography/              # gallery grid, lightbox, print card
    blog/                     # post card, category pill
    ecology/                  # publication entry, project card
  lib/
    posts.ts                  # read & parse blog markdown
    photos.ts                 # photo metadata helpers
    publications.ts           # ecology content helpers

content/                      # markdown files — the Obsidian bridge point
  blog/                       # .md files, one per post
  ecology/
    publications/             # .md per publication
    research/                 # .md per project

public/
  images/                     # web-optimised photos
```

## Content strategy
Blog posts and ecology content are plain markdown files in `/content`. Julian writes in Obsidian (markdown-based knowledge base) and manually copies finished pieces into the relevant `/content` subfolder when ready to publish. No CMS needed for now.

**Upgrade path**: When ready, an Obsidian Git sync + selective pull script can automate this. The `/content` folder is the only thing that changes — page components are decoupled from the content source via helper functions in `/lib`.

Key principle: page components never read markdown directly. They call functions from `/lib` (e.g. `getAllPosts()`, `getPublicationsByYear()`). This means swapping the content source later only requires touching `/lib`, not the pages.

## Separate repos
- `julianruizburgos-web` — this repo (public-facing website)
- Obsidian vault repo (private, separate) — version control for Julian's notes, no coupling to this repo

## Hosting plan (pending)
Currently waiting for GreenNet UK to respond about downgrading from dedicated WordPress to Domain Service only (email + DNS). Once confirmed:
1. Spin up Hetzner VPS (~€4–6/month)
2. Install Coolify
3. Connect this repo to Coolify for auto-deploy on push to main
4. Point DNS to Hetzner

## Current status
- [x] Next.js 15 scaffolded with TypeScript, Tailwind, App Router
- [x] Folder structure created
- [ ] Root layout with nav and footer
- [ ] Homepage
- [ ] Photography gallery
- [ ] Print shop + Stripe integration
- [ ] IT freelancing page
- [ ] Ecology section
- [ ] Blog with markdown rendering
- [ ] About page
- [ ] Hetzner VPS + Coolify setup
- [ ] DNS configuration

## Dev workflow
```bash
npm run dev       # local dev server at localhost:3000
npm run build     # production build
npm run lint      # ESLint
```
