import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SITE_URL } from "@/lib/seo";
import { brandSchema, breadcrumbSchema } from "@/lib/structured-data";
import { BRANDS, getBrand, matchBrandProducts } from "@/lib/brands";
import { getProducts } from "@/lib/woocommerce";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: "Marca no encontrada", robots: { index: false } };
  const canonical = `/marca/${brand.slug}`;
  return {
    title: brand.metaTitle,
    description: brand.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: brand.metaTitle,
      description: brand.metaDescription,
      url: `${SITE_URL}${canonical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: brand.metaTitle,
      description: brand.metaDescription,
    },
  };
}

export default async function MarcaPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const allProducts = await getProducts();
  const products = matchBrandProducts(brand, allProducts);

  // Don't serve thin pages: a brand with fewer than 2 live products is hidden.
  if (products.length < 2) notFound();

  const url = `${SITE_URL}/marca/${brand.slug}`;
  const breadcrumbs = [
    { name: "Inicio", url: `${SITE_URL}/` },
    { name: "Marcas", url: `${SITE_URL}/marca` },
    { name: brand.name, url },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          brandSchema({
            name: brand.name,
            url,
            description: brand.intro,
            foundedYear: brand.foundedYear,
            country: brand.country,
            website: brand.website,
          }),
        ]}
      />

      <section className="border-b border-ink/10 bg-ivory-100">
        <div className="container-x py-14 text-center lg:py-20">
          <nav className="mb-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-extra-wide text-ink/50">
            <Link href="/marca" className="hover:text-ink">Marcas</Link>
            <span>/</span>
            <span>{brand.name}</span>
          </nav>
          <span className="eyebrow">{brand.eyebrow}</span>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">
            {brand.name}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
            {brand.intro}
          </p>
        </div>
      </section>

      <section className="container-x py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Historia</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/75">{brand.history}</p>

          <h2 className="mt-14 font-serif text-3xl text-ink sm:text-4xl">Qué destacamos</h2>
          <ul className="mt-6 space-y-3">
            {brand.highlights.map((h, i) => (
              <li
                key={i}
                className="border-l-2 border-bosco-700 pl-5 text-base leading-relaxed text-ink/80"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-ivory-100 py-16 lg:py-24">
        <div className="container-x">
          <div className="text-center">
            <span className="eyebrow">Disponibles en Italmarket</span>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              Productos {brand.name}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
              {products.length} referencia{products.length === 1 ? "" : "s"} en stock.
              Envíos a todo el país y retiro en Barrio Norte o San Telmo.
            </p>
          </div>
          <div className="mt-12">
            <ProductGrid products={products} priorityCount={5} />
          </div>
        </div>
      </section>
    </>
  );
}
