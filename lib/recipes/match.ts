import type { Product } from "@/lib/types";
import type { RecipeIngredient, ResolvedIngredient } from "./types";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Matches a recipe ingredient against the live WooCommerce catalog. First
 * in-stock product whose name or slug includes any keyword (accent-insensitive,
 * case-insensitive) wins — skipping any candidate whose haystack includes a
 * negativeKeyword. Returns the ingredient unchanged when no keyword list is
 * provided or no candidate matches — the UI renders those as plain text so
 * pantry staples (water, salt, onion) don't try to sell anything.
 */
export function resolveIngredient(
  ingredient: RecipeIngredient,
  products: Product[],
): ResolvedIngredient {
  if (!ingredient.keywords || ingredient.keywords.length === 0) return { ...ingredient };

  const needles = ingredient.keywords.map(norm);
  const blockers = (ingredient.negativeKeywords ?? []).map(norm);

  // Priority-ordered: the first keyword that matches any eligible product wins,
  // regardless of product order. Ensures "mascarpone" beats "ricotta" even if
  // the ricotta product happens to come first in the catalog payload.
  const pick = (() => {
    for (const n of needles) {
      const hit = products.find((p) => {
        if (p.stock_status === "outofstock") return false;
        const hay = norm(`${p.name} ${p.slug}`);
        if (blockers.some((b) => hay.includes(b))) return false;
        return hay.includes(n);
      });
      if (hit) return hit;
    }
    return undefined;
  })();

  if (!pick) return { ...ingredient };

  const priceNum = parseFloat(pick.price);
  return {
    ...ingredient,
    matchedProduct: {
      id: pick.id,
      name: pick.name,
      slug: pick.slug,
      image: pick.images[0]?.src ?? "/images/storefront.jpg",
      price: Number.isFinite(priceNum) ? priceNum : 0,
      inStock: true,
    },
  };
}

export function resolveIngredients(
  ingredients: RecipeIngredient[],
  products: Product[],
): ResolvedIngredient[] {
  return ingredients.map((i) => resolveIngredient(i, products));
}

/**
 * Picks up to `limit` in-stock products for a list of pairing keywords,
 * aiming for variety: at most one match per keyword (first in-stock hit).
 * Falls back to sequential matching if keyword-diverse picks run short.
 * Optional `exclude` filters out products whose haystack contains any term.
 */
export function findRelatedProducts(
  keywords: string[],
  products: Product[],
  limit = 4,
  exclude: string[] = [],
): Product[] {
  const blockers = exclude.map(norm);
  const inStock = products.filter(
    (p) =>
      p.stock_status !== "outofstock" &&
      !blockers.some((b) => norm(`${p.name} ${p.slug}`).includes(b)),
  );

  const picked: Product[] = [];
  const seen = new Set<number>();
  for (const kw of keywords) {
    if (picked.length >= limit) break;
    const n = norm(kw);
    const hit = inStock.find(
      (p) => !seen.has(p.id) && norm(`${p.name} ${p.slug}`).includes(n),
    );
    if (hit) {
      picked.push(hit);
      seen.add(hit.id);
    }
  }

  return picked;
}
