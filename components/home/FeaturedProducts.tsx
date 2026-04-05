import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col items-end justify-between gap-6 border-b border-ink/15 pb-10 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">I nostri preferiti</span>
            <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Selección de la semana</h2>
          </div>
          <Link href="/productos" className="btn-ghost">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="mt-14">
          <ProductGrid products={products.slice(0, 8)} priorityCount={4} />
        </div>
      </div>
    </section>
  );
}
