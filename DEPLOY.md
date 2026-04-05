# Deploy — italmarket Next.js site

This is a Next.js 14 App Router project that renders the italmarket.com.ar
storefront by reading the public **WooCommerce Store API** (`wc/store/v1`) on
that same WordPress site. No consumer keys, no DB, no extra backend.

## Env vars

Only one variable matters in production. See [.env.example](.env.example).

| Var | Default | Where it's used |
|---|---|---|
| `WC_SITE_URL` | `https://italmarket.com.ar` | Base URL of the WooCommerce host. All Store API calls hit `${WC_SITE_URL}/wp-json/wc/store/v1`. |
| `PORT` | _set by host_ | Port Next.js listens on. |
| `NODE_ENV` | `production` | Set by build pipeline. |

The default value already points at production italmarket.com.ar, so a fresh
deploy with no env file will work out of the box.

## Build & start

Standard Next.js commands — already wired in `package.json`:

```bash
npm install
npm run build   # produces .next/
npm start       # serves on $PORT (default 3000)
```

Node **18+** required (tested on Node 20 and 24).

## Hostinger (Node.js hosting / temporary site)

In Hostinger's **hPanel → Websites → Node.js**:

1. **Repository**: `https://github.com/polgold/italmarket.git`, branch `main`.
2. **Application root**: `/` (the repo root).
3. **Node.js version**: `20.x` or newer.
4. **Application startup file**: leave blank — Hostinger runs `npm start`
   from `package.json` scripts. If it asks for one explicitly, use
   `node_modules/next/dist/bin/next` with arg `start`.
5. **Build command**: `npm install && npm run build`.
6. **Run command**: `npm start`.
7. **Environment variables**: add `WC_SITE_URL=https://italmarket.com.ar`
   (optional — it's the default).
8. Deploy. The temporary site URL from Hostinger should serve the storefront
   within ~60s of the first build finishing.

### Expected build time
~60–90 s for `next build`. The heaviest piece is the catalog image set under
`public/images/catalog/large/` (~18 MB). Those files are committed so the
deploy doesn't need to reach out to WooCommerce for images at build time.

### When product images look stale
The site caches Store API responses for 5 minutes (`next: { revalidate: 300 }`
in `lib/woocommerce.ts`) and reads image URLs from a pre-built index at
`public/images/catalog/index.json`.

If the Woo admin uploads new products or swaps photos, two things need to
happen to see them in production:
1. The 5-minute revalidation window passes → new products show up automatically
   but still point at their remote URLs.
2. To re-optimize images into `public/images/catalog/`, run locally:
   ```bash
   node scripts/optimize-catalog-images.mjs
   git add public/images/catalog
   git commit -m "Refresh catalog images"
   git push
   ```
   Hostinger rebuilds on push.

## Vercel / Netlify / other PaaS

It's a stock Next.js 14 app — Vercel/Netlify deploys work with zero config.
Same env var (`WC_SITE_URL`, optional) applies.

## The MCP server

`mcp-server/` contains a local MCP server that exposes Woo cart tools to
Claude Code. **Do not deploy it** — it's a dev tool that runs on your laptop
over stdio. See `mcp-server/README.md` (if present) or the main project
history for registration instructions.
