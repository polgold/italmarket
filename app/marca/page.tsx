import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { BRANDS, matchBrandProducts } from "@/lib/brands";
import { getProducts } from "@/lib/woocommerce";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Marcas italianas que trabajamos",
  description:
    "Productores italianos que importamos directo a Buenos Aires: Divella, Perugina, Menabrea, Giuliano Tartufi, Bijuo y más. Historia, región y productos disponibles de cada casa.",
  alternates: { canonical: "/marca" },
  openGraph: {
    title: "Marcas italianas · Italmarket",
    description:
      "Productores italianos que importamos directo: Divella, Perugina, Menabrea, Giuliano Tartufi, Bijuo y más.",
    url: `${SITE_URL}/marca`,
    type: "website",
  },
};

export default async function MarcasIndexPage() {
  const allProducts = await getProducts();
  const entries = BRANDS.map((b) => ({
    brand: b,
    count: matchBrandProducts(b, allProducts).length,
  }))
    .filter((e) => e.count >= 2)
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/` },
          { name: "Marcas", url: `${SITE_URL}/marca` },
        ])}
      />

      <section className="border-b border-ink/10 bg-ivory-100">
        <div className="container-x py-14 text-center lg:py-20">
          <span className="eyebrow">I nostri produttori</span>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">
            Marcas italianas
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
            Los productores que traemos directo de Italia. Cada marca con su historia,
            su región y los productos disponibles hoy en Italmarket.
          </p>
        </div>
      </section>

      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ brand, count }) => (
            <Link
              key={brand.slug}
              href={`/marca/${brand.slug}`}
              className="group block border border-ink/10 p-8 transition-colors hover:border-bosco-700"
            >
              <span className="eyebrow">{brand.eyebrow}</span>
              <h2 className="mt-3 font-serif text-3xl text-ink group-hover:text-bosco-700">
                {brand.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">{brand.intro}</p>
              <p className="mt-6 text-[11px] uppercase tracking-extra-wide text-ink/50">
                {count} productos en stock →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
