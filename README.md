# julianruizburgos.net

Personal website for Julian Ruiz Burgos — photographer, ecologist, and IT consultant.

Live at **https://julianruizburgos.net**

## What this is

Two equal primary goals:
1. Showcase and sell fine art prints of landscape and wildlife photography
2. Advertise IT freelancing services

Secondary sections: Ecology (consulting, research, publications), Blog, About.

## Stack

- **Next.js 16.1.6** — App Router, TypeScript
- **Tailwind CSS v4** — config via `@theme` in `app/globals.css`
- **shadcn/ui** — component library (button, card, dialog, sheet, badge, separator, aspect-ratio)
- **Lucide React** — icons
- Content: markdown files in `/content/` (no CMS)

## Local development

Requires **Node.js v20+**.

```bash
npm install
npm run dev       # localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

## Deployment

Hosted on a Hetzner CX23 VPS (Helsinki) via Coolify.
**Push to `main` auto-deploys.** No manual steps needed.

## Project structure

```
app/              # Next.js App Router pages
components/ui/    # Nav, Footer, shadcn/ui components
lib/              # Data helpers (it.ts, utils.ts)
content/          # Markdown content (blog, ecology)
public/
  images/         # Hero and section images
  videos/         # Video backgrounds
```

## Design

Editorial, photography-forward aesthetic. Playfair Display (serif) + Inter (sans). Warm earth tones with terracotta accent. Full design direction documented in `CLAUDE.md`.
