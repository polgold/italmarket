import Image from "next/image";
import Link from "next/link";
import type { ResolvedIngredient } from "@/lib/recipes/types";
import { formatPrice } from "@/lib/utils";

/**
 * Visual callout for the "producto estrella" of a recipe: the most emblematic
 * ingredient the visitor is likely to buy on-site. Rendered above the recipe
 * cart so it doubles as a teaser into the catalog.
 */
export function HeroProduct({ ingredient }: { ingredient: ResolvedIngredient }) {
  const product = ingredient.matchedProduct;
  if (!product) return null;
  return (
    <aside className="my-12 grid gap-8 border border-ink/10 bg-ivory-50 p-8 sm:grid-cols-[1fr_2fr] lg:p-10">
      <Link
        href={`/productos/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-ivory-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-col justify-center">
        <span className="eyebrow">Ingrediente estrella</span>
        <h3 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {product.name}
        </h3>
        {ingredient.note && (
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{ingredient.note}</p>
        )}
        <p className="mt-4 font-serif text-2xl text-ink">{formatPrice(product.price)}</p>
        <Link
          href={`/productos/${product.slug}`}
          className="btn-primary mt-6 self-start"
        >
          Ver producto
        </Link>
      </div>
    </aside>
  );
}
