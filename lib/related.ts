import type { Product } from "./types";
import type { Guide, Recipe, RecipeCategory } from "./recipes/types";
import { guides, recipes } from "./recipes";
import { BRANDS, type BrandSEO } from "./brands";

/**
 * Cross-entity linking helpers used by the "Ver también" blocks on PDPs,
 * category pages and recipe pages. Pure functions over in-memory data; no
 * network calls. Scoring is intentionally simple — a PR later can swap in a
 * stronger match (e.g. tf-idf over titles) without touching callers.
 */

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Heuristic mapping WC category slug → recipe categories that are likely to
 * feature products from that category. Used on /productos?categoria= to
 * surface recipes that make sense for the browsed category.
 */
const CATEGORY_TO_RECIPE_CATEGORIES: Record<string, RecipeCategory[]> = {
  pasta: ["pasta"],
  "pasta-premium": ["pasta"],
  "productos-frescos": ["postre", "entrada", "pasta", "pizza"],
  tomate: ["salsa", "pizza", "pasta"],
  salsas: ["salsa", "pasta"],
  aceites: ["salsa", "pasta", "entrada"],
  dolci: ["postre"],
  "trufa-y-hongos": ["pasta", "risotto"],
  cafe: ["postre"],
  conservas: ["salsa", "pizza"],
  harina: ["pizza"],
  arroces: ["risotto"],
  bebidas: [],
  aceitunas: ["entrada", "pizza"],
  galletitas: ["postre"],
  condimentos: ["pasta", "salsa"],
};

function productMatchesRecipe(product: Product, r: Recipe): boolean {
  const hay = norm(`${product.name} ${product.slug}`);
  for (const ing of r.ingredients) {
    if (!ing.keywords) continue;
    if (ing.keywords.some((kw) => hay.includes(norm(kw)))) return true;
  }
  if (r.pairingKeywords?.some((kw) => hay.includes(norm(kw)))) return true;
  return false;
}

/**
 * Recipes whose ingredients or pairings match this product. Used to surface
 * "Recetas con este ingrediente" on the PDP.
 */
export function findRecipesForProduct(product: Product, limit = 3): Recipe[] {
  return recipes.filter((r) => productMatchesRecipe(product, r)).slice(0, limit);
}

/**
 * Recipes likely to feature products from a given WC category slug.
 */
export function findRecipesForCategory(categorySlug: string, limit = 4): Recipe[] {
  const cats = CATEGORY_TO_RECIPE_CATEGORIES[categorySlug];
  if (!cats || cats.length === 0) return [];
  return recipes.filter((r) => cats.includes(r.category)).slice(0, limit);
}

/**
 * Other recipes related to a given recipe. Prefers same region, then same
 * category, then anything else — so the recommendations look coherent instead
 * of random.
 */
export function findSimilarRecipes(current: Recipe, limit = 3): Recipe[] {
  const others = recipes.filter((r) => r.slug !== current.slug);
  const sameRegion = others.filter((r) => r.region && r.region === current.region);
  const sameCategory = others.filter(
    (r) => r.category === current.category && !sameRegion.includes(r),
  );
  const rest = others.filter(
    (r) => !sameRegion.includes(r) && !sameCategory.includes(r),
  );
  return [...sameRegion, ...sameCategory, ...rest].slice(0, limit);
}

/**
 * Guides relevant to a set of keywords (product names, recipe keywords,
 * category slug, etc.).
 */
export function findRelatedGuides(keywords: string[], limit = 2): Guide[] {
  if (!keywords.length) return [];
  const needles = keywords.map(norm).filter((n) => n.length >= 3);
  return guides
    .filter((g) => {
      const hay = norm(
        `${g.title} ${g.summary} ${g.keywords.join(" ")} ${(g.relatedProductKeywords ?? []).join(" ")}`,
      );
      return needles.some((n) => hay.includes(n));
    })
    .slice(0, limit);
}

/**
 * Brand page that matches this product (by name regex). Used to offer a
 * "Ver más de [Brand]" link on the PDP.
 */
export function findBrandForProduct(product: Product): BrandSEO | undefined {
  return BRANDS.find((b) => b.matcher.test(product.name));
}
