import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { RecipeCart, type RecipeCartLineIn } from "@/components/recipe/RecipeCart";
import { HeroProduct } from "@/components/recipe/HeroProduct";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getRecipe, recipes } from "@/lib/recipes";
import { findRelatedProducts, resolveIngredients } from "@/lib/recipes/match";
import type { ResolvedIngredient } from "@/lib/recipes/types";
import { getProducts } from "@/lib/woocommerce";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: "Receta no encontrada", robots: { index: false } };
  const canonical = `/recetas/${recipe.slug}`;
  return {
    title: recipe.title,
    description: recipe.description,
    keywords: recipe.keywords,
    alternates: { canonical },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      url: `${SITE_URL}${canonical}`,
      type: "article",
      images: [{ url: recipe.image, alt: recipe.imageAlt }],
      publishedTime: recipe.publishedAt,
      modifiedTime: recipe.updatedAt ?? recipe.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description: recipe.description,
      images: [recipe.image],
    },
  };
}

function formatIngredientQuantity(i: ResolvedIngredient): string {
  if (typeof i.quantity === "number") return `${i.quantity}${i.unit ? ` ${i.unit}` : ""}`;
  return i.quantity;
}

function recipeJsonLd(
  recipe: ReturnType<typeof getRecipe> & object,
  ingredients: ResolvedIngredient[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: [recipe.image.startsWith("http") ? recipe.image : `${SITE_URL}${recipe.image}`],
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt ?? recipe.publishedAt,
    prepTime: `PT${recipe.prepTimeMin}M`,
    cookTime: `PT${recipe.cookTimeMin}M`,
    totalTime: `PT${recipe.prepTimeMin + recipe.cookTimeMin}M`,
    recipeYield: `${recipe.servings}`,
    recipeCategory: recipe.category,
    recipeCuisine: "Italiana",
    keywords: recipe.keywords.join(", "),
    inLanguage: "es-AR",
    recipeIngredient: ingredients.map(
      (i) => `${formatIngredientQuantity(i)} ${i.label}`.trim(),
    ),
    recipeInstructions: recipe.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: s,
    })),
    publisher: { "@id": `${SITE_URL}#organization` },
  };
}

export default async function RecetaPage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const products = await getProducts();
  const ingredients = resolveIngredients(recipe.ingredients, products);
  const hero = ingredients.find((i) => i.hero && i.matchedProduct);

  const cartLines: RecipeCartLineIn[] = ingredients
    .filter((i) => i.matchedProduct)
    .map((i) => ({
      productId: i.matchedProduct!.id,
      productName: i.matchedProduct!.name,
      productSlug: i.matchedProduct!.slug,
      image: i.matchedProduct!.image,
      unitPrice: i.matchedProduct!.price,
      suggestedUnits: i.suggestedUnits ?? 1,
      recipeLabel: formatIngredientQuantity(i) + " " + i.label,
    }));

  // Pairings: complementary products (wines, cheeses, pasta, dolci) that
  // combine with the dish without being ingredients. Skip any that are
  // already in the ingredient cart.
  const ingredientIds = new Set(cartLines.map((l) => l.productId));
  const pairingLines: RecipeCartLineIn[] = recipe.pairingKeywords
    ? findRelatedProducts(recipe.pairingKeywords, products, 8)
        .filter((p) => !ingredientIds.has(p.id))
        .slice(0, 4)
        .map((p) => ({
          productId: p.id,
          productName: p.name,
          productSlug: p.slug,
          image: p.images[0]?.src ?? "/images/storefront.jpg",
          unitPrice: parseFloat(p.price) || 0,
          suggestedUnits: 1,
          recipeLabel: "",
        }))
    : [];

  const breadcrumbs = [
    { name: "Inicio", url: `${SITE_URL}/` },
    { name: "Recetas", url: `${SITE_URL}/recetas` },
    { name: recipe.title, url: `${SITE_URL}/recetas/${recipe.slug}` },
  ];

  return (
    <>
      <JsonLd data={[recipeJsonLd(recipe, ingredients), breadcrumbSchema(breadcrumbs)]} />

      <section className="border-b border-ink/10 bg-ivory-100">
        <div className="container-x py-16 text-center lg:py-24">
          <nav className="mb-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-extra-wide text-ink/50">
            <Link href="/recetas" className="hover:text-ink">Recetas</Link>
            <span>/</span>
            <span>{recipe.region ?? recipe.category}</span>
          </nav>
          {recipe.italianTitle && (
            <span className="eyebrow">{recipe.italianTitle}</span>
          )}
          <h1 className="mt-3 font-serif text-5xl leading-tight text-ink sm:text-6xl lg:text-7xl">
            {recipe.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
            {recipe.summary}
          </p>
          <dl className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-y-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="eyebrow">Prep</dt>
              <dd className="mt-1 font-serif text-xl text-ink">{recipe.prepTimeMin} min</dd>
            </div>
            <div>
              <dt className="eyebrow">Cocción</dt>
              <dd className="mt-1 font-serif text-xl text-ink">{recipe.cookTimeMin} min</dd>
            </div>
            <div>
              <dt className="eyebrow">Porciones</dt>
              <dd className="mt-1 font-serif text-xl text-ink">{recipe.servings}</dd>
            </div>
            <div>
              <dt className="eyebrow">Dificultad</dt>
              <dd className="mt-1 font-serif text-xl text-ink capitalize">{recipe.difficulty}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-ink">
        <Image
          src={recipe.image}
          alt={recipe.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </section>

      <section className="container-x py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          {recipe.intro.map((p, i) => (
            <p key={i} className="mt-4 text-lg leading-relaxed text-ink/75 first:mt-0">
              {p}
            </p>
          ))}

          {hero && <HeroProduct ingredient={hero} />}

          <h2 className="mt-16 font-serif text-3xl text-ink sm:text-4xl">Ingredientes</h2>
          <p className="mt-2 text-sm text-ink/60">Para {recipe.servings} porciones</p>
          <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {ingredients.map((i, idx) => (
              <li key={idx} className="flex items-baseline justify-between gap-4 py-3">
                <div className="flex-1">
                  {i.matchedProduct ? (
                    <Link
                      href={`/productos/${i.matchedProduct.slug}`}
                      className="font-serif text-lg text-ink link-underline"
                    >
                      {i.label}
                    </Link>
                  ) : (
                    <span className="font-serif text-lg text-ink">{i.label}</span>
                  )}
                  {i.note && (
                    <p className="mt-1 text-xs leading-relaxed text-ink/50">{i.note}</p>
                  )}
                </div>
                <span className="text-sm text-ink/70 whitespace-nowrap">
                  {formatIngredientQuantity(i)}
                </span>
              </li>
            ))}
          </ul>

          <h2 className="mt-16 font-serif text-3xl text-ink sm:text-4xl">Preparación</h2>
          <ol className="mt-6 space-y-6">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-5">
                <span className="font-serif text-3xl leading-none text-ink/30">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-base leading-relaxed text-ink/80">{step}</p>
              </li>
            ))}
          </ol>

          {recipe.tips && recipe.tips.length > 0 && (
            <>
              <h2 className="mt-16 font-serif text-3xl text-ink sm:text-4xl">Tips de la nonna</h2>
              <ul className="mt-6 space-y-3">
                {recipe.tips.map((t, idx) => (
                  <li
                    key={idx}
                    className="border-l-2 border-bosco-700 pl-5 text-base leading-relaxed text-ink/75"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}

          {recipe.history && (
            <>
              <h2 className="mt-16 font-serif text-3xl text-ink sm:text-4xl">
                Un poco de historia
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink/75">{recipe.history}</p>
            </>
          )}
        </div>
      </section>

      <RecipeCart lines={cartLines} pairingLines={pairingLines} recipeTitle={recipe.title} />
    </>
  );
}
