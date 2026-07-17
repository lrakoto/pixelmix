# Architecture

How the project fits together. The README tells you what's running;
this tells you how the pieces work and why.

## Big picture

```
       ┌──────────────────────────┐
       │  src/data/prints.ts      │   Single source of truth for the
       │  (the catalog, 116)      │   catalog. Hand-edited, no CMS.
       └──────────┬───────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │  src/pages/*.astro       │   Astro components that read
       │  (home, gallery,         │   from prints.ts and render
       │   about, contact,        │   pages. The data is bound at
       │   prints/[slug].astro)   │   build time.
       └──────────┬───────────────┘
                  │ astro build
                  ▼
       ┌──────────────────────────┐
       │  dist/                   │   Static HTML + assets. Not
       │  (the build output)      │   committed; built in CI.
       └──────────┬───────────────┘
                  │ lftp mirror
                  ▼
       ┌──────────────────────────┐
       │  cPanel FTP root         │   Served by Apache as
       │  107.180.115.245         │   pixelmix.co.
       └──────────────────────────┘
```

## The data model

`src/data/prints.ts` exports a `Print` interface and a `prints: Print[]`
array of 116 entries. The interface is the contract; new fields are
additive (old code that doesn't read them still works).

```ts
interface Print {
  slug: string;            // URL segment; also the directory name under
                           // /prints/<slug>/index.html
  title: string;           // Display name. Currently placeholders.
  artist: string;
  price: number;           // USD
  size: string;            // e.g. "A2 (16.5 x 23.4 in)"
  paper: string;
  edition: string;         // e.g. "Open edition" or "Limited, 50"
  image: string;           // Single image path. Resolves under /public/,
                           // e.g. "/prints/Artboard-1-1.jpg"
  description: string;     // Free text. Currently empty.
  buyUrl?: string;         // Stripe Payment Link. If set, the detail
                           // page CTA flips to "Buy — $X" linking here.
                           // If unset, falls back to /contact.
  featured?: boolean;      // Used for the hero on the catalog-grid
                           // version of the homepage. Currently
                           // unused (splash homepage).
}
```

The catalog is hand-edited. To add a print: drop the image under
`public/prints/`, add an entry to the array. To remove: delete the
image and remove the entry. To rename: change `title`; `slug` is the
URL key so don't change that lightly (it would break inbound links).

## Pages and routing

Astro file-based routing. Every file under `src/pages/` becomes a
route at build time.

| File                          | Route               | What it does                                            |
| ----------------------------- | ------------------- | ------------------------------------------------------- |
| `pages/index.astro`           | `/`                 | Currently a splash. See git history for the catalog grid. |
| `pages/gallery.astro`         | `/gallery`          | The full 116-print grid, all visible, no load-more.     |
| `pages/about.astro`           | `/about`            | "About Pixelmix" marketing page.                        |
| `pages/contact.astro`         | `/contact`          | A `mailto:` form. No backend; opens the user's mail client. |
| `pages/prints/[slug].astro`   | `/prints/<slug>`    | Detail page for one print. `getStaticPaths()` enumerates one HTML file per print in the catalog. |

The print detail page has a small piece of logic worth understanding
because it controls what the user sees when they try to buy:

```astro
{p.buyUrl ? (
  <a class="btn btn-primary" href={p.buyUrl} target="_blank" rel="noopener">
    Buy — ${p.price} →
  </a>
) : (
  <a class="btn btn-primary" href="/contact">Order this print →</a>
)}
```

This is the only place `buyUrl` is read. The behavior is: if Stripe
Payment Link is set, take the user to Stripe. If not, send them to
`/contact` (which opens their mail client with `hello@pixelmix.co`).

## Layouts and components

- `src/layouts/Layout.astro` — every page wraps itself in `<Layout>`.
  This gives them the `<head>`, the `<Header>`, the `<Footer>`, and
  the global stylesheet. Two props: `title` and optional `description`.
- `src/components/Header.astro` — sticky transparent nav. Always
  present, links to `/`, `/gallery`, `/about`, `/contact`.
- `src/components/Footer.astro` — small footer with the contact
  email and a copyright.
- `src/styles/global.css` — every style in the project, in one file.
  Plain CSS (no preprocessor, no Tailwind, no PostCSS plugins). Uses
  CSS custom properties for color and type tokens at the top of the
  file.

## The `.htaccess`

Lives in `public/.htaccess` and is copied to `dist/.htaccess` on
every build. Four jobs:

1. **Default index** — `DirectoryIndex index.html` makes Apache
   serve `index.html` when a request hits a directory. The
   `/prints/artboard-1/` route works because there's an
   `index.html` in that directory.

2. **Pretty URLs** — Astro's trailing-slash default is "ignore" in
   some configurations, "always" in others. The rewrite rule turns
   `/prints/artboard-1` (no slash) into a 301 to `/prints/artboard-1/`
   (with slash) when the path doesn't already have a file extension
   and doesn't already exist as a file or directory. This is what
   makes the URLs work consistently.

3. **Sibling-site exemption** — the very first rewrite rule is a
   hard `[L]` early-exit for `/threeohfivestudios.com/`,
   `/.well-known/`, and `/cgi-bin/`. Without this, every other rule
   in this file would cascade into those directories when Apache
   matches a request to a subpath. The `threeohfivestudios.com`
   exemption is the **single most important line in this file**.

4. **Performance** — `mod_expires` adds 1-year caching for
   fingerprinted assets (everything in `/_astro/`), 1-hour for
   HTML, and `mod_deflate` gzips text-y responses. The
   `<FilesMatch "^\.">` block prevents dotfiles from being served
   over HTTP (defense in depth; the FTP layer doesn't depend on
   this).

## The deploy

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `actions/checkout@v4` — clone the repo.
2. `actions/setup-node@v4` — Node 22 with npm cache.
3. `npm ci` — clean install of dependencies.
4. `npm run build` — `astro build`, output to `dist/`.
5. `apt install lftp` — install the deploy tool.
6. `lftp` script:
   a. **Phase 1**: `mirror --reverse ./dist/ /` — upload the
      build to the FTP root. Files that already exist with the
      same content are skipped by default.
   b. **Phase 2**: `rm` a specific list of WordPress files. The
      list is in the workflow file and is auditable. Anything not
      in the list — including `threeohfivestudios.com/`,
      `.well-known/`, `cgi-bin/`, `.ftpquota` — is never touched.

The 3 GitHub Secrets are read in the workflow's `env` block and
passed to `lftp` as `FTP_USER` and `FTP_PASS`. `FTP_HOST` is read
directly. None of these are echoed to the build log.

## What lives where on the server

```
FTP root (/)                       What's there now
├── .htaccess                      ← the rules above
├── index.html                     ← splash homepage
├── favicon.svg
├── _astro/                        ← Astro-bundled CSS / JS
├── about/                         ← /about/
├── contact/                       ← /contact/
├── gallery/                       ← /gallery/
├── prints/                        ← /prints/<slug>/ and the 116 images
│   ├── *.jpg                      ← the catalog images
│   └── <slug>/index.html          ← the 116 detail pages
├── threeohfivestudios.com/        ← **DO NOT TOUCH**, separate site
├── cgi-bin/                       ← system, leave alone
├── .well-known/                   ← system, leave alone
├── .ftpquota                      ← system, leave alone
├── wp-content/                    ← leftover from WP, see HANDOFF.md
├── wp-includes/                   ← leftover from WP, see HANDOFF.md
└── graphic-design-portfolio/      ← leftover from WP, see HANDOFF.md
```

The three "leftover WP" directories at the bottom are inert — no
`.htaccess` rule references them, and the new `index.html` wins the
`DirectoryIndex` for `/`. They take ~100MB of disk and are safe to
delete via cPanel File Manager.
