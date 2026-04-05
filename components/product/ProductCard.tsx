import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { QuickAddButton } from "./QuickAddButton";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const image = product.images[0]?.src || "/images/storefront.jpg";
  const category = product.categories[0]?.name;
  const isSale = product.on_sale && product.regular_price;

  return (
    <div className="group flex flex-col">
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-ivory-100"
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        {isSale && (
          <span className="absolute left-2 top-2 bg-rosso-500 px-2 py-0.5 text-[9px] uppercase tracking-extra-wide text-ivory-50">
            Offerta
          </span>
        )}
      </Link>
      <div className="mt-2 flex flex-1 flex-col items-center text-center">
        {category && <span className="eyebrow text-[9px]">{category}</span>}
        <Link href={`/productos/${product.slug}`} className="mt-0.5">
          <h3 className="font-serif text-sm leading-snug text-ink hover:underline sm:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          {isSale && product.regular_price && (
            <span className="text-[11px] text-ink/40 line-through">{formatPrice(product.regular_price)}</span>
          )}
          <span className="font-serif text-sm text-ink">{formatPrice(product.price)}</span>
        </div>
        <div className="mt-2 w-full">
          <QuickAddButton productId={product.id} productName={product.name} />
        </div>
      </div>
    </div>
  );
}
