# Project State — Current

Last updated: 2026-08-07

## Status
The catalog now contains **17 products**, one for every standalone full-bleed print artwork in `public/prints` (excluding the non-product `hero.jpg` brand banner). Each product uses its standalone artwork as the main image and includes a thumbnail carousel only when optically verified matching mockups exist. The detail page uses a centered, capped-width two-column layout with a full-size lightbox zoom. A TinaCMS admin dashboard has been added and deployed — the admin is live at `https://pixelmix.co/admin/`, builds in CI via `tina-build`, and **login + product editing on production is verified working**. Edits made in the admin commit to `main`, which triggers the CI deploy.

## Completed
- [x] Grouped 116 images into 18 products based on the artwork inside the mockup frames.
- [x] Rewrote `src/data/prints.ts` with `images: string[]` schema; first image is the main, rest are mockups.
- [x] Added real product titles and short descriptions.
- [x] Updated `src/pages/prints/[slug].astro` to render a clickable thumbnail carousel + lightbox.
- [x] Fixed carousel click handler so thumbnail clicks swap the main image (data passed via `data-images` JSON attribute).
- [x] Updated `src/pages/gallery.astro` to use the first image of each product.
- [x] Added carousel + splash-page CSS to `src/styles/global.css`.
- [x] Removed non-product "Neo-Tokyo Hero" from the catalog.
- [x] Shrunk main detail image and added lightbox zoom so no vertical scrolling is needed; right-side details get more space.
- [x] Applied 50/50 split between image column and product info column.
- [x] Capped detail page max width and gallery column width so the image does not overwhelm on very wide viewports.
- [x] Improved carousel thumbnails: larger size, better spacing, snap scrolling.
- [x] Added `.tmp-review/` to `.gitignore`.
- [x] Converted product data from `src/data/prints.ts` to `src/data/prints.json` for CMS compatibility.
- [x] Installed TinaCMS (`tinacms`, `@tinacms/cli`) and created `tina/config.ts` with a `prints` global collection.
- [x] Configured TinaCMS media uploads to save into `public/prints`.
- [x] Added `tina-dev`, `tina-build`, and `tina-start` npm scripts.
- [x] Verified the local TinaCMS admin works: product list, form editing, image thumbnails, drag-to-reorder, delete images.
- [x] Committed and pushed all TinaCMS changes (commit `3d7c5ac`).
- [x] Set up TinaCloud project for `lrakoto/pixelmix` — Client ID and Content (Readonly) Token obtained.
- [x] Added `TINA_CLIENT_ID` and `TINA_TOKEN` as GitHub repo secrets via `gh` CLI.
- [x] Updated CI workflow (`.github/workflows/deploy.yml`) to run `npm run tina-build` with Tina secrets.
- [x] Created `.env` (gitignored) with Tina credentials for local dev.
- [x] Created `.env.example` documenting required env vars.
- [x] Fixed `tina/config.ts` to use `?? ''` fallback for clientId/token so TinaCloud can parse the config.
- [x] CI deploy succeeded — admin SPA built and deployed to `https://pixelmix.co/admin/`.
- [x] Installed `gh` CLI (v2.96.0) and authenticated as `lrakoto` with `repo`, `read:org`, `gist` scopes.
- [x] Build passes (`npm run build`): 22 pages.
- [x] Verified `https://pixelmix.co` is in the TinaCloud project's Site URLs; production admin login works and the Prints editor loads all 18 products (2026-08-04).
- [x] Deleted two duplicate TinaCloud "pixelmix" projects left over from setup; only the live project (Client ID `ab835a3f-…`) remains (2026-08-04).
- [x] Optically audited all 116 image files without relying on filenames and rebuilt product image sets (2026-08-07).
- [x] Removed all mismatched carousel images; 42 verified mockups remain assigned across 12 products (2026-08-07).
- [x] Products without matching mockups now render as single-image products with no carousel (2026-08-07).
- [x] Removed the incorrect `Pixelmix Collage` product, whose supposed main image was a room mockup rather than a full-bleed artwork (2026-08-07).
- [x] Made `src/data/prints.json` the single catalog source of truth; `prints.ts` is now only a typed compatibility export (2026-08-07).
- [x] Verified the corrected static build: 21 pages, including 17 product pages (2026-08-07).

## Product list (17)
Goku, Rei Ayanami, Saya, Edward Elric, Super Saiyan, Templar, Rock Lee, Oracle, Mikasa, Sailor Moon, Gaara, Genos, Naruto, Genos (Alt), Vegeta, Android 18, Darth Vader.

## Open follow-ups
1. **Stripe Payment Links** — `buyUrl` is `null` for all 18 products; CTAs fall back to `/contact`.
2. **Homepage** — currently a splash page; decide when to switch to a full catalog grid.
3. **Leftover WP directories** — still on server, inert.

## TinaCloud details
- **Project name**: pixelmix
- **Client ID**: stored as GitHub secret `TINA_CLIENT_ID` and in local `.env`
- **Token (Content Readonly)**: stored as GitHub secret `TINA_TOKEN` and in local `.env`
- **Admin URL**: `https://pixelmix.co/admin/` (login verified working 2026-08-04)
- **Site URLs**: `http://localhost:4321`, `https://pixelmix.co`
- **Local dev admin**: `npm run tina-dev` → `http://localhost:4321/admin/`
- **gh CLI**: on the Windows machine, installed via WinGet and authenticated as `lrakoto` (path under `C:/Users/lrakotomavonandriani/…`)

## Temporary artifacts
`.tmp-review/` contains the visual indexes and groupings used during curation. It is gitignored and can be deleted anytime. `sreenshot-pixelmix.png` and `screenshot-01.png` in the repo root are one-off feedback screenshots and are gitignored.
