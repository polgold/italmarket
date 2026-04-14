import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/woocommerce";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { stripHtml } from "@/lib/utils";

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { categoria } = await searchParams;
  if (!categoria) {
    return {
      title: "Tienda online de productos italianos",
      description:
        "Tienda online de Italmarket: productos italianos importados directamente desde Italia. Pastas, aceites de oliva, salumi, quesos, vinos, salsas y dolci. Envíos a todo el país y retiro en Barrio Norte o San Telmo.",
      alternates: { canonical: "/productos" },
    };
  }
  const categories = await getCategories();
  const current = categories.find((c) => c.slug === categoria);
  if (!current) {
    return { title: "Categoría no encontrada", robots: { index: false } };
  }
  const desc = current.description
    ? stripHtml(current.description).slice(0, 200)
    : `Comprá ${current.name.toLowerCase()} italianos auténticos en Italmarket. Productos importados directamente desde Italia con envíos a todo el país.`;
  return {
    title: `${current.name} italianos · Tienda online`,
    description: desc,
    alternates: { canonical: `/productos?categoria=${current.slug}` },
    openGraph: {
      title: `${current.name} italianos · Italmarket`,
      description: desc,
      url: `${SITE_URL}/productos?categoria=${current.slug}`,
      type: "website",
    },
  };
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
        <JsonLd
          data={breadcrumbSchema([
            { name: "Inicio", url: `${SITE_URL}/` },
            { name: "Tienda", url: `${SITE_URL}/productos` },
          ])}
        />
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
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/` },
          { name: "Tienda", url: `${SITE_URL}/productos` },
          { name: current.name, url: `${SITE_URL}/productos?categoria=${current.slug}` },
        ])}
      />
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
