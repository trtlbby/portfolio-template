# Portfolio Template

A dark minimalist portfolio built with React, TypeScript, Vite, and Tailwind CSS v4.

**[Live Demo →](https://your-username.github.io/your-repo-name/)**

## Features

- Glassmorphism design with 60-30-10 monochrome palette
- Fully typed data layer with JSON content store
- Dev-only admin panel with full CRUD, reorder, and PIN-gated access
- Scroll-reveal animations via IntersectionObserver
- Accessible: skip-to-content, aria-labels, focus-visible, semantic HTML
- SEO meta tags and Open Graph support
- Responsive sidebar navigation (desktop + mobile slide-in)
- Code-split admin bundle — zero impact on production payload
- Project detail pages support demo videos via embedded URLs or local MP4 files

## Tech Stack

- **Framework:** React 19 + TypeScript 6
- **Styling:** Tailwind CSS v4 (CSS-first) + glassmorphism
- **Build:** Vite 8
- **Routing:** react-router-dom 7
- **Icons:** lucide-react
- **Fonts:** Inter, JetBrains Mono

## Development

```bash
npm install
npm run dev
```

Admin panel is available at `/admin` in development mode only. Default PIN: `1234` (set via `VITE_ADMIN_PIN` in `.env`).

## Build & Preview

```bash
npm run build
npm run preview
```

## Performance Workflow

### Regenerate Optimized Project Images

Project screenshots use responsive WebP variants under `public/images/optimized` for Lighthouse image audits.

```bash
npm run images:optimize
```

Run this whenever you replace any project screenshot source in `public/images`.

### Repeat-Visit Caching on GitHub Pages

This project uses a service worker (`public/sw.js`) to improve repeat-visit performance on GitHub Pages where server cache headers are limited.

- App shell routes use network-first with cache fallback.
- Static assets use cache-first.
- Cache version is controlled by `CACHE_VERSION` in `public/sw.js`.

When you deploy breaking asset changes and want to force cache refresh, bump `CACHE_VERSION`.

## Deployment

Pushes to `master` auto-deploy to GitHub Pages via GitHub Actions.

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Root layout (single-page home)
│   ├── admin/               # Dev-only admin panel
│   │   ├── AdminLayout.tsx  # PIN gate
│   │   ├── AdminDashboard.tsx
│   │   ├── components/      # Admin UI primitives
│   │   └── editors/         # Section editors (CRUD)
│   ├── blog/                # Blog list + post routed pages
│   ├── projects/            # Projects list + detail routed pages
│   ├── context/             # Theme context
│   └── components/
│       └── sections/        # Page sections (home, projects, blog, contact)
├── data/                    # Portfolio + blog content (JSON + typed loaders)
├── lib/                     # Shared small utilities/constants
├── types/                   # TypeScript interfaces
└── styles/                  # CSS (fonts, theme, tailwind, animations)
```

## Recent Update

- Added a local project demo video at `public/videos/localCMSDemo.mp4`
- Updated `Local Portfolio CMS` project data to use `videoFileUrl` for in-page demo playback
