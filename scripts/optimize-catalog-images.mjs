#!/usr/bin/env node
/**
 * Downloads every product image from the WooCommerce Store API, resizes it
 * into thumb (1200px, q60) and large (2560px, q70) JPGs using ImageMagick 7,
 * and writes an index mapping remote URL → local paths that lib/woocommerce.ts
 * consumes to rewrite product image URLs at render time.
 *
 * Idempotent: skips downloads + conversions whose outputs already exist.
 * Run with:  node scripts/optimize-catalog-images.mjs
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_ROOT = path.join(ROOT, "public", "images", "catalog");
const THUMB_DIR = path.join(OUT_ROOT, "thumb");
const LARGE_DIR = path.join(OUT_ROOT, "large");
const ORIG_DIR = path.join(OUT_ROOT, ".originals");
const INDEX_PATH = path.join(OUT_ROOT, "index.json");

const SITE = process.env.WC_SITE_URL || "https://shop.italmarket.com.ar";
const PER_PAGE = 100;
const CONCURRENCY = 4;

for (const dir of [THUMB_DIR, LARGE_DIR, ORIG_DIR]) fs.mkdirSync(dir, { recursive: true });

function hashUrl(url) {
  return crypto.createHash("sha1").update(url).digest("hex").slice(0, 12);
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp"].includes(ext) ? ext : ".jpg";
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return { data: await res.json(), headers: res.headers };
}

async function collectImageUrls() {
  const urls = new Set();

  // Products
  let page = 1;
  while (true) {
    const { data, headers } = await fetchJson(
      `${SITE}/wp-json/wc/store/v1/products?per_page=${PER_PAGE}&page=${page}&stock_status=instock&catalog_visibility=visible`,
    );
    for (const p of data) {
      for (const img of p.images || []) {
        if (img?.src) urls.add(img.src);
      }
    }
    const totalPages = Number(headers.get("x-wp-totalpages") ?? "1") || 1;
    if (page >= totalPages) break;
    page++;
  }

  // Categories
  const { data: cats } = await fetchJson(
    `${SITE}/wp-json/wc/store/v1/products/categories?per_page=${PER_PAGE}&hide_empty=1`,
  );
  for (const c of cats) {
    if (c?.image?.src) urls.add(c.image.src);
  }

  return [...urls];
}

async function downloadIfMissing(url) {
  const ext = extFromUrl(url);
  const target = path.join(ORIG_DIR, `${hashUrl(url)}${ext}`);
  if (fs.existsSync(target) && fs.statSync(target).size > 0) return target;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(target, buf);
  return target;
}

function magick(args) {
  return new Promise((resolve, reject) => {
    const p = spawn("magick", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(stderr || `magick exit ${code}`))));
  });
}

async function convertOne(url) {
  const id = hashUrl(url);
  const orig = await downloadIfMissing(url);
  const thumb = path.join(THUMB_DIR, `${id}.jpg`);
  const large = path.join(LARGE_DIR, `${id}.jpg`);

  if (!fs.existsSync(thumb)) {
    await magick([
      orig,
      "-resize", "1200x1200>",
      "-strip",
      "-interlace", "Plane",
      "-sampling-factor", "4:2:0",
      "-quality", "60",
      thumb,
    ]);
  }
  if (!fs.existsSync(large)) {
    await magick([
      orig,
      "-resize", "2560x2560>",
      "-strip",
      "-interlace", "Plane",
      "-sampling-factor", "4:2:0",
      "-quality", "70",
      large,
    ]);
  }

  return {
    url,
    thumb: `/images/catalog/thumb/${id}.jpg`,
    large: `/images/catalog/large/${id}.jpg`,
    sizes: {
      orig: fs.statSync(orig).size,
      thumb: fs.statSync(thumb).size,
      large: fs.statSync(large).size,
    },
  };
}

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      try {
        results[idx] = await worker(items[idx], idx);
      } catch (e) {
        results[idx] = { error: e.message, url: items[idx] };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log(`→ Fetching product + category images from ${SITE}`);
  const urls = await collectImageUrls();
  console.log(`  ${urls.length} unique images`);

  let totalOrig = 0;
  let totalThumb = 0;
  let totalLarge = 0;
  let done = 0;

  const mapping = {};
  const results = await pool(urls, CONCURRENCY, async (url) => {
    const r = await convertOne(url);
    done++;
    if (done % 10 === 0 || done === urls.length) {
      process.stdout.write(`  ${done}/${urls.length}\r`);
    }
    return r;
  });

  for (const r of results) {
    if (r.error) {
      console.warn(`! ${r.url}: ${r.error}`);
      continue;
    }
    mapping[r.url] = { thumb: r.thumb, large: r.large };
    totalOrig += r.sizes.orig;
    totalThumb += r.sizes.thumb;
    totalLarge += r.sizes.large;
  }

  fs.writeFileSync(INDEX_PATH, JSON.stringify(mapping, null, 2));
  console.log(`\n✓ Wrote ${INDEX_PATH} (${Object.keys(mapping).length} entries)`);
  const mb = (b) => (b / 1024 / 1024).toFixed(1) + " MB";
  console.log(`  originals: ${mb(totalOrig)}`);
  console.log(`  thumb:     ${mb(totalThumb)}`);
  console.log(`  large:     ${mb(totalLarge)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
