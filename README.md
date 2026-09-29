# Portfolio Template

A dark minimalist portfolio built with React, TypeScript, Vite, and Tailwind CSS v4.

**This is the live demo of the template:** [Live Demo →](https://trtlbby.github.io/portfolio-template/)

Replace `your-repo-name` in [vite.config.ts](vite.config.ts) and [public/404.html](public/404.html) with your actual repository name before publishing this template to GitHub Pages. For this repo, the value is `portfolio-template`.

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

## Contact Form Setup

The contact form uses EmailJS, so each person using this template must create their own EmailJS account and configure their own service, template, and public key.

1. Create a free EmailJS account at https://www.emailjs.com/.
2. Add your email provider in EmailJS and create a service.
3. Create an EmailJS template that includes the form fields used by this app: `name`, `email`, `title`, and `message`.
4. Copy your EmailJS service ID, template ID, and public key into your local `.env` file as `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY`.
5. Restart the dev server after updating `.env` so Vite picks up the new values.

Without those values, the contact form will render but sending messages will fail.

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

Pushes to `master/main` auto-deploy to GitHub Pages via GitHub Actions.

If you fork or rename this template, update the GitHub Pages base path in [vite.config.ts](vite.config.ts) and the redirect target in [public/404.html](public/404.html) to match the repository name exactly.

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

