/**
 * Data contract for recipes + guides. Each recipe lives as a single TS file
 * under `content/recetas/` and is imported by `lib/recipes/index.ts`. Keeping
 * them as data (not MDX) lets the recipe cart match ingredients to real
 * WooCommerce products at render time without a content build step.
 */

export type Difficulty = "fácil" | "media" | "difícil";
export type RecipeCategory =
  | "pasta"
  | "salsa"
  | "pizza"
  | "risotto"
  | "plato principal"
  | "postre"
  | "entrada";

export interface RecipeIngredient {
  /** Display label, e.g. "Guanciale". */
  label: string;
  /** Numeric quantity (150) or text ("al gusto"). */
  quantity: number | string;
  /** Unit, e.g. "g", "ml", "unidad". Omit when quantity is textual. */
  unit?: string;
  /**
   * Catalog match keywords. The first product whose name or slug matches any
   * keyword (case-insensitive) wins. Leave empty to render as plain text
   * (used for basics like water, salt, onion that we don't sell).
   */
  keywords?: string[];
  /**
   * Substrings that disqualify a product even if keywords match — e.g. exclude
   * "pizza" when matching cured meats so a frozen prosciutto pizza doesn't
   * get picked as guanciale substitute.
   */
  negativeKeywords?: string[];
  /** Short note shown in muted text, e.g. "podés reemplazar por pancetta". */
  note?: string;
  /**
   * Optional display annotation: how many units of the matched product to
   * suggest in the pre-filled cart. Defaults to 1.
   */
  suggestedUnits?: number;
  /**
   * If true, this ingredient is featured in the "producto estrella" block
   * above the recipe cart. Only one ingredient per recipe should set this.
   */
  hero?: boolean;
}

export interface Recipe {
  slug: string;
  title: string;
  /** Italian name (if any), shown as a subheading. */
  italianTitle?: string;
  /** One-liner shown below the title — also used as meta description fallback. */
  summary: string;
  /** Long-form SEO description (150–300 chars ideal). */
  description: string;
  /** Hero image under /public/images/recipes/ or any public path. */
  image: string;
  imageAlt: string;
  region?: string;
  prepTimeMin: number;
  cookTimeMin: number;
  servings: number;
  difficulty: Difficulty;
  category: RecipeCategory;
  /** SEO keywords for Metadata + JSON-LD Recipe.keywords. */
  keywords: string[];
  /** Short intro paragraph(s) — shown above ingredients. */
  intro: string[];
  ingredients: RecipeIngredient[];
  steps: string[];
  tips?: string[];
  /** Optional history/cultural note — shown at the bottom, ~150 words. */
  history?: string;
  /**
   * Complementary product keywords — things that pair with the dish but are
   * NOT ingredients (a wine for carbonara, an extra cheese for pomodoro).
   * Resolved the same way as ingredient keywords; shown in a "completá el
   * plato" block next to the recipe cart, unchecked by default.
   */
  pairingKeywords?: string[];
  /** ISO date. Used for Recipe.datePublished. */
  publishedAt: string;
  updatedAt?: string;
}

export interface GuideSection {
  heading: string;
  body: string[];
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  readTimeMin: number;
  keywords: string[];
  sections: GuideSection[];
  /** Keywords used to surface related catalog products at the bottom. */
  relatedProductKeywords?: string[];
  publishedAt: string;
  updatedAt?: string;
}

export interface ResolvedIngredient extends RecipeIngredient {
  matchedProduct?: {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    inStock: boolean;
  };
}
