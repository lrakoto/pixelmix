# Project State — Current

Last updated: 2026-07-24

## Status
The catalog has been reorganized from 116 individual images into **19 products**, each with a main full-bleed image and multiple mockup variants shown in a carousel on the detail page.

## Completed
- [x] Grouped 116 images into 19 products based on the artwork inside the mockup frames.
- [x] Rewrote `src/data/prints.ts` with `images: string[]` schema; first image is the main, rest are mockups.
- [x] Added real product titles and short descriptions.
- [x] Updated `src/pages/prints/[slug].astro` to render a clickable thumbnail carousel + lightbox.
- [x] Updated `src/pages/gallery.astro` to use the first image of each product.
- [x] Added carousel + splash-page CSS to `src/styles/global.css`.
- [x] Added `.tmp-review/` to `.gitignore`.
- [x] Build passes (`npm run build`): 23 pages.

## Product list (19)
Goku, Rei Ayanami, Saya, Edward Elric, Super Saiyan, Templar, Rock Lee, Oracle, Mikasa, Sailor Moon, Gaara, Genos, Naruto, Genos (Alt), Vegeta, Android 18, Neo-Tokyo Hero, Darth Vader, Pixelmix Collage.

## Open follow-ups
1. **Stripe Payment Links** — `buyUrl` is `null` for all 19 products; CTAs fall back to `/contact`.
2. **Mockup thumbnail visibility** — some thumbnails look dark at 72×72 because the mockup frame includes lots of wall border; consider cropping thumbnails tighter or showing fewer/highlighting main + 3 best mockups.
3. **Homepage** — currently a splash page; decide when to switch to a full catalog grid.
4. **Leftover WP directories** — still on server, inert.

## Temporary artifacts
`.tmp-review/` contains the visual indexes and groupings used during curation. It is gitignored and can be deleted anytime.
