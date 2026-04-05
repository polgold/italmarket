import { NextRequest, NextResponse } from "next/server";
import { decodeEntities } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = process.env.WC_SITE_URL || "https://italmarket.com.ar";

interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  prices: { price: string; currency_minor_unit: number };
  images: { src: string }[];
  is_in_stock?: boolean;
}

/**
 * GET /api/search?q=term
 *
 * Thin proxy to the WC Store API product search. Returns just the fields
 * the typeahead needs, with image URLs rewritten to the local optimized
 * copies (same map the catalog reads).
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ items: [] });

  try {
    const url = new URL(`${SITE}/wp-json/wc/store/v1/products`);
    url.searchParams.set("search", q);
    url.searchParams.set("per_page", "8");
    url.searchParams.set("stock_status", "instock");
    url.searchParams.set("catalog_visibility", "visible");

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Store API search → ${res.status}`);
    const data = (await res.json()) as StoreProduct[];

    // Lazy import so the image map lives in a single place.
    const { rewriteImage } = await import("@/lib/woocommerce");

    const items = data.map((p) => {
      const minor = p.prices.currency_minor_unit;
      const priceNum = Number(p.prices.price) / Math.pow(10, minor);
      return {
        id: p.id,
        name: decodeEntities(p.name),
        slug: p.slug,
        price: priceNum,
        image: p.images[0]?.src ? rewriteImage(p.images[0].src) : null,
      };
    });
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ items: [], error: (e as Error).message }, { status: 500 });
  }
}
