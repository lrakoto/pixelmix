# Pixelmix

A small Astro static site for [pixelmix.co](https://pixelmix.co) — an anime
prints shop. Replaces an old WordPress + WooCommerce site that lived on the
same cPanel account.

**Live status:** splash page (single-screen "Coming soon"). Direct links to
`/gallery`, `/prints/<slug>`, `/about`, `/contact` still work and show the
in-progress catalog. See `docs/HANDOFF.md` for what's intentionally not done
yet and `docs/ARCHITECTURE.md` for how the pieces fit.

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # dev server with HMR at http://localhost:4321
npm run build      # static build to dist/
npm run preview    # serve the built dist/ locally
```

## Deploy

Push to `main` → GitHub Actions builds and deploys `dist/` to the cPanel FTP
root via `lftp`. The deploy script is in
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). Three GitHub
Secrets are required (set in repo Settings → Secrets and variables →
Actions):

| Secret    | Value                  |
| --------- | ---------------------- |
| `FTP_HOST` | `107.180.115.245`     |
| `FTP_USER` | `hermes@pixelmix.co`  |
| `FTP_PASS` | cPanel password        |

Manual deploy: `python deploy.py` (the file is in `.gitignore`; see
`docs/HANDOFF.md` for how to recreate it).

## Critical preservation rule

The cPanel account also hosts an **addon domain**:
[`threeohfivestudios.com`](https://threeohfivestudios.com) — a separate
WordPress install that is the owner's portfolio. It is a **sibling site**,
not a subdirectory. It must never be deleted, modified, or uploaded over.

The deploy workflow and the legacy manual `deploy.py` script both preserve
it by *omission* — every destructive operation lists specific paths to
remove, and `threeohfivestudios.com/` is never in that list. The
`.htaccess` at the site root also has a hard early-exit for requests
under `/threeohfivestudios.com/`.

If you are tempted to "tidy up by deleting what looks like cruft", do
**not** run `rm -rf` blindly. The old WordPress install's top-level
directories (`wp-admin/`, `wp-content/`, `wp-includes/`, `index.php`,
`wp-config.php`, etc.) are safe to remove; everything else is not.

## Repo layout

```
.
├── .github/workflows/deploy.yml   CI: build + FTP deploy
├── public/
│   ├── .htaccess                  Apache rules (pretty URLs, caching, gzip)
│   ├── favicon.svg
│   └── prints/                    116 product images (committed)
├── src/
│   ├── components/                Header.astro, Footer.astro
│   ├── data/prints.ts             The catalog (see ARCHITECTURE.md)
│   ├── layouts/Layout.astro       Shared layout (head, header, footer)
│   ├── pages/
│   │   ├── index.astro            Homepage (currently a splash)
│   │   ├── gallery.astro          /gallery
│   │   ├── about.astro            /about
│   │   ├── contact.astro          /contact
│   │   └── prints/[slug].astro    /prints/<slug> — one page per print
│   └── styles/global.css          All styles, single file
├── docs/
│   ├── HANDOFF.md                 What's done, what's not, why
│   └── ARCHITECTURE.md            How the data model and routing work
└── package.json
```

## Open follow-ups

In rough priority order:

1. **Print titles** — every print in `src/data/prints.ts` currently has a
   placeholder title derived from its old WordPress filename
   (`Artboard 1 1`, `Artboard 3`, etc.). They need real names based on
   what the image shows.
2. **Stripe Payment Links** — the `buyUrl` field is in the `Print`
   interface but `null` for every print. When payment links are created
   in the Stripe dashboard, populate `buyUrl` per print and the
   detail-page CTA switches from "Order this print" to "Buy — $X".
3. **Tidy leftover WP dirs** — the first deploy didn't fully clean the
   old `wp-content/`, `wp-includes/`, `wp-content/uploads/` from the FTP
   root. They are inert (no `.htaccess` rule points to them; the new
   site lives next to them), but they're ~100MB of dead weight. Safest
   cleanup is via cPanel File Manager.
4. **Carousel / variants** — the old WordPress site had each product
   with one main image and 3 gallery images in a carousel. The current
   `Print` interface only has a single `image` string. Extending to a
   `images: string[]` (or a `variants` array) and updating
   `[slug].astro` and the home/gallery cards to use a carousel is a
   self-contained follow-up.

## License

Private project. All rights reserved by the site owner.
