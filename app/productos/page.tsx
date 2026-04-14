import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/woocommerce";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { SeeAlso, type SeeAlsoItem } from "@/components/seo/SeeAlso";
import { SITE_URL } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { getCategorySeo } from "@/lib/seo-categories";
import { stripHtml } from "@/lib/utils";
import { findRecipesForCategory, findRelatedGuides } from "@/lib/related";

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
  const seo = getCategorySeo(current.slug);
  const title =
    seo?.metaTitle ?? `${current.name} italianos · Tienda online`;
  const description =
    seo?.metaDescription ??
    (current.description
      ? stripHtml(current.description).slice(0, 200)
      : `Comprá ${current.name.toLowerCase()} italianos auténticos en Italmarket. Productos importados directamente desde Italia con envíos a todo el país.`);
  return {
    title,
    description,
    alternates: { canonical: `/productos?categoria=${current.slug}` },
    openGraph: {
      title,
      description,
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
  const seo = getCategorySeo(current.slug);

  const relatedRecipes = findRecipesForCategory(current.slug, 3);
  const relatedGuides = findRelatedGuides([current.slug, current.name], 2);
  const seeAlsoItems: SeeAlsoItem[] = [
    ...relatedRecipes.map((r) => ({
      href: `/recetas/${r.slug}`,
      label: r.title,
      eyebrow: "Receta",
      description: r.summary,
    })),
    ...relatedGuides.map((g) => ({
      href: `/guias/${g.slug}`,
      label: g.title,
      eyebrow: "Guía",
      description: g.summary,
    })),
  ];

  const schemas: object[] = [
    breadcrumbSchema([
      { name: "Inicio", url: `${SITE_URL}/` },
      { name: "Tienda", url: `${SITE_URL}/productos` },
      { name: current.name, url: `${SITE_URL}/productos?categoria=${current.slug}` },
    ]),
  ];
  if (seo) schemas.push(faqSchema(seo.faqs));

  return (
    <>
      <JsonLd data={schemas} />
      <section className="border-b border-ink/10 bg-ivory-100">
        <div className="container-x py-12 text-center lg:py-16">
          <nav className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-extra-wide text-ink/50">
            <Link href="/productos" className="hover:text-ink">
              Tienda
            </Link>
            <span>/</span>
            <span className="text-ink/80">{current.name}</span>
          </nav>
          {seo && <span className="eyebrow">{seo.eyebrow}</span>}
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">
            {seo?.h1 ?? current.name}
          </h1>
          {seo ? (
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-ink/70">
              {seo.intro}
            </p>
          ) : (
            current.description && (
              <p
                className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink/60"
                dangerouslySetInnerHTML={{ __html: current.description }}
              />
            )
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

      {seo && (
        <section className="border-t border-ink/10 bg-ivory-100 py-16 lg:py-20">
          <div className="container-x mx-auto max-w-3xl">
            <div className="text-center">
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                Sobre {current.name.toLowerCase()}
              </h2>
            </div>
            <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {seo.faqs.map((f, i) => (
                <div key={i} className="py-6">
                  <dt className="font-serif text-xl text-ink">{f.q}</dt>
                  <dd className="mt-3 text-base leading-relaxed text-ink/75">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <SeeAlso
        heading={`Recetas y guías con ${current.name.toLowerCase()}`}
        eyebrow="Ver también"
        items={seeAlsoItems}
      />
    </>
  );
}
