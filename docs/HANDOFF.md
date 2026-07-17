# Handoff

This document is the narrative side of the project. It records what was
done, in what order, what was decided and why, and what's intentionally
left undone. The README is the 30-second orientation; this is the
behind-the-scenes.

## Context

The previous site was a WordPress + WooCommerce shop on the same GoDaddy
cPanel account. It was outdated, hard to update, and getting in the way
of the owner's actual goal: a small, curated catalog of anime prints
with a clean checkout.

The cPanel account also hosts a separate WordPress install at
`threeohfivestudios.com` — that's the owner's portfolio (a different
business) and must not be touched. It sits at the FTP root as a
subdirectory named `threeohfivestudios.com/`, and Apache routes the
`threeohfivestudios.com` hostname to it as an addon domain. The
deploys preserve it by *omission* — every destructive operation
explicitly lists what to remove, and `threeohfivestudios.com/` is never
in the list.

The live domain is **pixelmix.co** (not `.com`).

## What got built

Roughly in order:

1. **Astro scaffold + v1 design** (commits `d15f407`, `7f93cfc`). Plain
   dark editorial look: a homepage with a featured image hero, a
   `Picked this season` row, and a "How it works" section. Pages:
   `/`, `/gallery`, `/about`, `/contact`, `/prints/<slug>`. Never
   deployed.

2. **Replaced placeholder content with the real catalog** (commit
   `6a16a05`). 116 product images came from the old WordPress
   `uploads/` folder. `src/data/prints.ts` was expanded to map each
   image to a slug, title, artist, price, size, paper, edition, and
   an empty description. A `buyUrl?: string` field was added to the
   `Print` interface for future Stripe Payment Links (null for now).
   A `public/.htaccess` was added for pretty URLs, gzip, and static
   asset caching. The deploy was done manually over FTP because the
   first fine-grained PAT didn't have the `workflow` scope needed to
   push a GitHub Actions file.

3. **CI deploy** (commit `72574a8`). Added
   `.github/workflows/deploy.yml`. The workflow builds with Node 22,
   installs `lftp`, mirrors `dist/` to the FTP root, and `rm`s an
   explicit list of WordPress files. Required three GitHub Secrets
   (`FTP_HOST`, `FTP_USER`, `FTP_PASS`) and the user had to add the
   `workflow` scope to the PAT. From this point, `git push origin main`
   deploys automatically.

4. **Homepage with the full collection + Load more**
   (commit `9148468`). Replaced `Picked this season` with the entire
   116-print grid, the first 12 visible and a button revealing 12 at a
   time. The button is progressive enhancement: without JS, the first
   12 still render and the button is a no-op. After all 116 are shown,
   the button hides itself.

5. **Coming-soon splash** (commit `906d4c8`). The previous step made the
   site look "in progress" — placeholder titles like `Artboard 1 1`
   and `Artboard 3` were visible to anyone hitting the homepage.
   Replaced `index.astro` with a single-screen splash: brand
   wordmark, "Coming soon" eyebrow, h1, subhead, "Get in touch" CTA
   to `/contact`, and a "Sneak peek the gallery →" secondary link for
   anyone who really wants to see the in-progress work. The
   `/gallery`, `/prints/<slug>`, `/about`, and `/contact` pages are
   unchanged and still reachable by direct URL.

## What's intentionally not done

- **Print titles are placeholders.** They came from the old
  WordPress filenames (`Artboard 1 1`, `Artboard 3`, `Oracle`, `Lee`,
  etc.) and need to be renamed based on what the image actually
  shows. This is the biggest visual-quality issue. 116 prints is a
  lot — easiest in batches of ~20 with the owner scrolling the
  gallery and dictating titles.

- **Stripe Payment Links.** The `buyUrl` field exists in the `Print`
  interface and the detail page reads it. When a print has a
  `buyUrl`, the CTA flips from "Order this print →" (a `/contact`
  link) to "Buy — $X →" linking out. All 116 prints currently have
  `null` for `buyUrl`. Wiring this up is just: create a Payment Link
  per print in the Stripe dashboard, paste the URLs to me, and I
  populate `buyUrl` in `prints.ts`.

- **The WordPress site was not fully removed from the FTP root.**
  The first deploy cleaned up the top-level WP files (`index.php`,
  `wp-config.php`, `wp-login.php`, `wp-*.php`, etc.) and removed
  `wp-admin/`. But `wp-content/`, `wp-includes/`, and the old
  `graphic-design-portfolio/` directory were partially cleaned and
  the FTP connection timed out before completion. These directories
  are inert — no rule in the new `.htaccess` references them, and
  the new `index.html` wins the `DirectoryIndex` for `/`. They sit on
  disk taking ~100MB. Safest cleanup is via cPanel File Manager:
  browse to `/wp-content/`, `/wp-includes/`, `/graphic-design-portfolio/`,
  delete the directories. **Do not run `rm -rf`** — the user already
  accidentally typed something scary at one point.

- **Carousel / variants.** The old WP product pages had one main
  image and three gallery images. The current `Print` interface
  only stores a single `image: string`. The schema change is small
  but the homepage and detail-page UI need real thought before
  building. Defer until titles and Stripe are done.

## Decision rationale

- **Astro over Next.js.** Static output, no server runtime to keep
  alive, fast to deploy, fits the project size. The user wanted
  something they could maintain themselves.

- **GitHub Actions over a hosted CI.** Already paying for GitHub;
  the workflow file is committed and reviewable. Avoids signing up
  for another service.

- **`lftp` over `SamKirkland/FTP-Deploy-Action` or a curl script.**
  `lftp` is in `apt` on the `ubuntu-latest` runner, supports
  recursive mirrors and the kind of selective delete we need, and
  the `mirror --reverse` operation is well-understood. The
  `SamKirkland` action does a full mirror with deletes, which is
  dangerous when we have a sibling site at the FTP root that we
  cannot touch.

- **Explicit `rm` list, not `--delete` mirror.** The two-phase
  deploy — first `mirror --reverse` (no delete), then `rm` a
  specific list — is auditable. Every path that gets removed is
  visible in the workflow file. If the sibling site (`threeohfivestudios.com`)
  is not in the list, it cannot be removed. This is much safer
  than `--delete` with `--exclude` patterns, where a typo in the
  exclude pattern could nuke the wrong subtree.

- **Plain FTP, not FTPS.** The cPanel server accepts plain FTP on
  port 21; the credentials in `ftp_creds.txt` on the desktop
  describe the account as `FTP & explicit FTPS port: 21`, but the
  deploy was set up for plain FTP first and hasn't been switched
  over. Worth tightening to FTPS at some point — the FTP password
  is currently a plain-text secret in GitHub Secrets.

- **No CMS, no DB.** Everything that varies (the catalog) lives in
  a TypeScript file. The catalog is 116 entries and changes by
  hand-editing `prints.ts`. A CMS would be overkill for a catalog
  this size that changes maybe a few times a year.

- **Splash over a "Site is broken" page.** The catalog has real
  images and works fine via direct URLs, so hiding it entirely
  would be wasted work. The splash lets curious visitors hit
  `/gallery` to see the work, while the front door is a brand
  statement.

## Things that surprised me and might surprise you

- The old WordPress install was still at the FTP root when v2
  deployed. The deploy was designed to remove the specific files
  that would interfere with the new site (WP `index.php`,
  `wp-config.php`, etc.) but left a lot of WP core files. That's
  mostly fine because the new site's `index.html` wins
  `DirectoryIndex`, but it does mean the FTP root is bigger than
  it should be.

- `ftp.pixelmix.co` doesn't have DNS. The cPanel server is reached
  by IP (`107.180.115.245`). A `dig ftp.pixelmix.co` returns NXDOMAIN.
  The deploy workflow connects to the IP, not the hostname.

- The first deploy with the buggy `LIST -laR` parser (commit `6a16a05`)
  uploaded everything successfully — upload was Phase 1 and used a
  different code path. The bug was only in Phase 2 (cleanup), which
  is why the site came up live but the WP files weren't fully
  removed. The bug was fixed in the second manual run; the CI
  workflow uses `lftp` and never had the bug.

- `dist/` is not committed. It's in `.gitignore` because it's
  build output. The CI workflow builds from source on every push.

- The old `deploy.py` and `cleanup.py` are in `.gitignore`. They
  were one-shot tools for the WP-to-static transition. The
  canonical deploy is now the GitHub Actions workflow. If you ever
  need to re-run a manual deploy, recreate them from the workflow
  file's `lftp` script — they are essentially a thin Python
  wrapper around the same commands.

## What I'd do next, if I were picking this up cold

1. Read `README.md` (orientation) and `docs/ARCHITECTURE.md` (data
   model and routing).
2. Read `src/data/prints.ts` to see the current catalog shape.
3. Run `npm install && npm run dev` and click through
   `localhost:4321` — start with `/`, then `/gallery`, then
   `/prints/oracle` (one of the prints with a real name).
4. Pick a follow-up from the README. The natural starting point
   is the print-titling pass: open `prints.ts`, open the gallery
   in a browser side-by-side, and rename titles in batches.
5. Don't touch `threeohfivestudios.com/` on the server. Don't run
   `rm -rf` on the FTP root. Both are easy mistakes that are hard
   to recover from.
