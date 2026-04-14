import fs from "node:fs";
import path from "node:path";
import type { Category, Product } from "./types";
import { mockCategories, mockProducts } from "./mock-data";
import { decodeEntities } from "./utils";

/**
 * Remote → local image map produced by scripts/optimize-catalog-images.mjs.
 * Read once at module load; missing file is non-fatal (falls back to remote
 * URLs, which is what the site used before the optimization step).
 *
 * Lookups are host-agnostic: we index entries by URL pathname so the map keeps
 * working after a domain migration (e.g. italmarket.com.ar → shop.italmarket.com.ar)
 * without regenerating the cache.
 */
type ImageMapEntry = { thumb: string; large: string };
let imageMap: Record<string, ImageMapEntry> = {};
let imageMapByPath: Record<string, ImageMapEntry> = {};
try {
  const p = path.join(process.cwd(), "public", "images", "catalog", "index.json");
  if (fs.existsSync(p)) {
    imageMap = JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, ImageMapEntry>;
    imageMapByPath = Object.fromEntries(
      Object.entries(imageMap).map(([url, entry]) => {
        try {
          return [new URL(url).pathname, entry] as const;
        } catch {
          return [url, entry] as const;
        }
      }),
    );
  }
} catch {
  /* ignore */
}

export function rewriteImage(src: string): string {
  if (imageMap[src]) return imageMap[src].large;
  try {
    const hit = imageMapByPath[new URL(src).pathname];
    if (hit) return hit.large;
  } catch {
    /* non-URL input — fall through */
  }
  return src;
}

/**
 * WooCommerce product catalog reader, backed by the public WC **Store API**
 * (`wc/store/v1`). The Store API is unauthenticated and exposes exactly the
 * data a storefront needs — products, categories, cart — so we don't need
 * consumer keys to render the catalog.
 *
 * Falls back to mock data only when the site is unreachable, so local dev
 * still works offline.
 */

const SITE_URL = process.env.WC_SITE_URL || "https://shop.italmarket.com.ar";
const BASE = `${SITE_URL}/wp-json/wc/store/v1`;

// ---------- Store API shapes (only the fields we actually use) ----------

interface StorePrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_minor_unit: number;
}
interface StoreImage {
  id?: number;
  src: string;
  thumbnail?: string;
  alt?: string;
}
interface StoreCategory {
  id: number;
  name: string;
  slug: string;
}
interface StoreAttribute {
  id?: number;
  name: string;
  taxonomy?: string;
  has_variations?: boolean;
  terms?: { id: number; name: string; slug: string }[];
}
interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  is_in_stock?: boolean;
  is_purchasable?: boolean;
  prices: StorePrices;
  images: StoreImage[];
  categories: StoreCategory[];
  attributes: StoreAttribute[];
}
interface StoreCategoryFull {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
  count?: number;
  image?: StoreImage | null;
}

// ---------- Helpers ----------

async function storeFetch<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<{ data: T; totalPages: number }> {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Store API ${path} failed: ${res.status}`);
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? "1") || 1;
  return { data: (await res.json()) as T, totalPages };
}

/**
 * Fetches every page of a paginated Store API endpoint. Caps at `maxPages`
 * (5 × 100 = 500 products) as a safety net — the catalog sits around 210
 * today so this is generous.
 */
async function storeFetchAll<T>(
  path: string,
  params: Record<string, string | number> = {},
  maxPages = 5,
): Promise<T[]> {
  const perPage = Number(params.per_page ?? 100);
  const first = await storeFetch<T[]>(path, { ...params, per_page: perPage, page: 1 });
  const all: T[] = [...first.data];
  const lastPage = Math.min(first.totalPages, maxPages);
  for (let page = 2; page <= lastPage; page++) {
    const next = await storeFetch<T[]>(path, { ...params, per_page: perPage, page });
    all.push(...next.data);
  }
  return all;
}

/**
 * Store API returns prices as integer strings in the currency's minor unit
 * (e.g. `"5300"` with `currency_minor_unit: 0` for ARS → 5300 pesos; or
 * `"1299"` with minor 2 for USD → $12.99). The rest of the app expects a
 * plain numeric string in the major unit, so we normalize here.
 */
function toMajorUnit(value: string, minor: number): string {
  if (!value) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return (n / Math.pow(10, minor)).toString();
}

function mapProduct(p: StoreProduct): Product {
  const minor = p.prices.currency_minor_unit;
  return {
    id: p.id,
    name: decodeEntities(p.name),
    slug: p.slug,
    price: toMajorUnit(p.prices.price, minor),
    regular_price: toMajorUnit(p.prices.regular_price, minor),
    sale_price: toMajorUnit(p.prices.sale_price, minor),
    on_sale: p.on_sale,
    short_description: decodeEntities(p.short_description),
    description: decodeEntities(p.description),
    images: p.images.map((img) => ({
      id: img.id,
      src: rewriteImage(img.src),
      alt: img.alt ? decodeEntities(img.alt) : img.alt,
    })),
    categories: p.categories.map((c) => ({
      id: c.id,
      name: decodeEntities(c.name),
      slug: c.slug,
    })),
    stock_status: p.is_in_stock === false ? "outofstock" : "instock",
    attributes: p.attributes.map((a) => ({
      name: decodeEntities(a.name),
      options: (a.terms ?? []).map((t) => decodeEntities(t.name)),
    })),
  };
}

function mapCategory(c: StoreCategoryFull): Category {
  return {
    id: c.id,
    name: decodeEntities(c.name),
    slug: c.slug,
    parent: c.parent,
    description: c.description ? decodeEntities(c.description) : c.description,
    image: c.image
      ? {
          id: c.image.id,
          src: rewriteImage(c.image.src),
          alt: c.image.alt ? decodeEntities(c.image.alt) : c.image.alt,
        }
      : null,
    count: c.count,
  };
}

// ---------- Public API (unchanged signatures) ----------

/**
 * Returns the full in-stock catalog. Products with `catalog_visibility=hidden`
 * are already excluded by the Store API; we additionally filter out anything
 * that isn't in stock so the storefront never shows dead SKUs.
 */
function warnFallback(endpoint: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(
    `[woocommerce] ${endpoint} failed against ${SITE_URL} — falling back to mock data. ${msg}`,
  );
}

export async function getProducts(params: Record<string, string | number> = {}): Promise<Product[]> {
  try {
    const list = await storeFetchAll<StoreProduct>("/products", {
      stock_status: "instock",
      catalog_visibility: "visible",
      ...params,
    });
    return list
      .filter((p) => p.is_in_stock !== false && p.is_purchasable !== false)
      .map(mapProduct);
  } catch (err) {
    warnFallback("getProducts", err);
    return mockProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await storeFetch<StoreProduct[]>("/products", { slug });
    return data[0] ? mapProduct(data[0]) : null;
  } catch (err) {
    warnFallback("getProductBySlug", err);
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await storeFetch<StoreCategoryFull[]>("/products/categories", {
      per_page: 100,
      hide_empty: 1,
      orderby: "count",
      order: "desc",
    });
    return data
      .filter((c) => (c.count ?? 0) > 0)
      .map(mapCategory);
  } catch (err) {
    warnFallback("getCategories", err);
    return mockCategories;
  }
}

/**
 * Featured products, falling back to the first in-stock products if Woo has
 * none marked as featured (currently the case on italmarket.com.ar).
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const { data } = await storeFetch<StoreProduct[]>("/products", {
      featured: "true",
      stock_status: "instock",
      per_page: limit,
    });
    if (data.length > 0) return data.map(mapProduct);
  } catch {
    /* fall through to in-stock fallback */
  }
  // Fallback: newest in-stock products.
  try {
    const { data } = await storeFetch<StoreProduct[]>("/products", {
      stock_status: "instock",
      catalog_visibility: "visible",
      per_page: limit,
      orderby: "date",
      order: "desc",
    });
    return data
      .filter((p) => p.is_in_stock !== false && p.is_purchasable !== false)
      .map(mapProduct);
  } catch {
    return mockProducts.slice(0, limit);
  }
}
