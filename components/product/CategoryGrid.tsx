import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

/**
 * Landing grid that mirrors italmarket.com.ar/shop-2/: one tile per top-level
 * category, using the image and name the shop admin configured in WooCommerce.
 * No fallbacks invented — if Woo has no image for a category we just leave the
 * image slot blank rather than substituting a placeholder.
 */
export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/productos?categoria=${cat.slug}`}
          className="group flex flex-col"
        >
          <div className="relative aspect-square overflow-hidden bg-ivory-100">
            {cat.image?.src ? (
              <Image
                src={cat.image.src}
                alt={cat.image.alt || cat.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
            ) : null}
          </div>
          <div className="mt-3 flex flex-col items-center text-center">
            <h3 className="font-serif text-base text-ink sm:text-lg">{cat.name}</h3>
            {typeof cat.count === "number" && (
              <span className="mt-1 text-[11px] uppercase tracking-extra-wide text-ink/50">
                {cat.count} producto{cat.count === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
