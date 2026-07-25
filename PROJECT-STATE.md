# Project State — Current

Last updated: 2026-07-25

## Status
The catalog has been reorganized from 116 individual images into **18 products**, each with a main full-bleed image and multiple mockup variants shown in a clickable thumbnail carousel on the detail page. The detail page now uses a centered, capped-width two-column layout (image left, info right) with a full-size lightbox zoom. A TinaCMS admin dashboard has been added for browser-based editing of products and images.

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
- [x] Build passes (`npm run build`): 22 pages.

## Product list (18)
Goku, Rei Ayanami, Saya, Edward Elric, Super Saiyan, Templar, Rock Lee, Oracle, Mikasa, Sailor Moon, Gaara, Genos, Naruto, Genos (Alt), Vegeta, Pixelmix Collage, Android 18, Darth Vader.

## Open follow-ups
1. **Commit & push TinaCMS changes** — uncommitted changes include `package.json`, `package-lock.json`, `src/data/prints.json`, `src/pages/gallery.astro`, `src/pages/prints/[slug].astro`, `tina/config.ts`, generated `public/admin/`, and `tina/__generated__/`. The `sreenshot-pixelmix.png` file should not be committed.
2. **Set up TinaCloud** — create a free project at https://tina.io, connect the `lrakoto/pixelmix` repo, and add the generated `TINA_CLIENT_ID` and `TINA_TOKEN` to `tina/config.ts` so the admin is accessible from any browser.
3. **Stripe Payment Links** — `buyUrl` is `null` for all 18 products; CTAs fall back to `/contact`.
4. **Homepage** — currently a splash page; decide when to switch to a full catalog grid.
5. **Leftover WP directories** — still on server, inert.

## Temporary artifacts
`.tmp-review/` contains the visual indexes and groupings used during curation. It is gitignored and can be deleted anytime. The `sreenshot-pixelmix.png` in the repo root is a one-off feedback screenshot and should not be committed.
