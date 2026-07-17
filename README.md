# pixelmix

Anime prints. Static site, Astro + plain HTML/CSS/JS. Deploys to GoDaddy via GitHub Actions.

## Develop

    npm install
    npm run dev          # local dev server with hot reload

## Build

    npm run build        # outputs static site to ./dist

## Deploy

Push to `main` on GitHub. The workflow in `.github/workflows/deploy.yml`
builds the site and uploads `dist/` to the GoDaddy cPanel document root
over FTP using credentials stored as GitHub repository secrets.

To add a new deployable secret later, see `.github/workflows/deploy.yml`.
