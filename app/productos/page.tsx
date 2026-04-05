import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/woocommerce";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import { ProductGrid } from "@/components/product/ProductGrid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Tienda online de Italmarket: productos italianos importados, organizados por categoría tal como en nuestra tienda física.",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string }>;
}

/**
 * Tienda landing. Mirrors italmarket.com.ar/shop-2/: top-level categories as a
 * grid first, then product list once a category is selected via `?categoria=`.
 * All data comes from the WooCommerce Store API — nothing here is hardcoded.
 */
export default async function ProductosPage({ searchParams }: PageProps) {
  const { categoria } = await searchParams;
  const categories = await getCategories();
  const topLevel = categories.filter((c) => c.parent === 0 && (c.count ?? 0) > 0);

  // Landing mode: no category selected → show the 16 top-level category tiles.
  if (!categoria) {
    return (
      <>
        <section className="border-b border-ink/10 bg-ivory-100">
          <div className="container-x py-10 text-center lg:py-14">
            <span className="eyebrow">Tienda</span>
            <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">
              Nuestras categorías
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
              Explorá el catálogo organizado tal como en la tienda física. Elegí una categoría
              para ver los productos disponibles.
            </p>
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="container-x">
            <CategoryGrid categories={topLevel} />
          </div>
        </section>
      </>
    );
  }

  // Detail mode: a category is selected → fetch that category's products.
  const current = categories.find((c) => c.slug === categoria);
  if (!current) {
    return (
      <section className="container-x py-24 text-center">
        <p className="font-serif text-3xl text-ink">Categoría no encontrada</p>
        <Link
          href="/productos"
          className="mt-6 inline-block text-[11px] uppercase tracking-extra-wide text-ink/60 hover:text-ink"
        >
          ← Volver a la tienda
        </Link>
      </section>
    );
  }

  const products = await getProducts({ category: current.id });

  return (
    <>
      <section className="border-b border-ink/10 bg-ivory-100">
        <div className="container-x py-10 text-center lg:py-14">
          <nav className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-extra-wide text-ink/50">
            <Link href="/productos" className="hover:text-ink">
              Tienda
            </Link>
            <span>/</span>
            <span className="text-ink/80">{current.name}</span>
          </nav>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">{current.name}</h1>
          {current.description && (
            <p
              className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink/60"
              dangerouslySetInnerHTML={{ __html: current.description }}
            />
          )}
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="container-x">
          {products.length > 0 ? (
            <>
              <div className="mb-6 flex items-baseline justify-between border-b border-ink/10 pb-4">
                <p className="text-[11px] uppercase tracking-extra-wide text-ink/50">
                  {products.length} producto{products.length === 1 ? "" : "s"}
                </p>
                <Link
                  href="/productos"
                  className="text-[11px] uppercase tracking-extra-wide text-ink/50 hover:text-ink"
                >
                  ← Todas las categorías
                </Link>
              </div>
              <ProductGrid products={products} priorityCount={5} />
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-ink">Sin productos disponibles en esta categoría</p>
              <Link
                href="/productos"
                className="mt-6 inline-block text-[11px] uppercase tracking-extra-wide text-ink/60 hover:text-ink"
              >
                ← Volver a la tienda
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
