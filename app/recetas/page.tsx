import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { recipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recetas italianas auténticas",
  description:
    "Recetas italianas clásicas explicadas paso a paso: carbonara, pomodoro, pesto alla genovese, cacio e pepe, tiramisú y más. Con los ingredientes listos para pedir en Italmarket.",
  alternates: { canonical: "/recetas" },
  openGraph: {
    title: "Recetas italianas · Italmarket",
    description:
      "Aprende a cocinar los clásicos italianos con las recetas tradicionales y los ingredientes importados.",
    url: `${SITE_URL}/recetas`,
    type: "website",
  },
};

export default function RecetasIndex() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Inicio", url: `${SITE_URL}/` },
            { name: "Recetas", url: `${SITE_URL}/recetas` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Recetas italianas auténticas",
            url: `${SITE_URL}/recetas`,
            description:
              "Colección de recetas italianas tradicionales: pastas, salsas, postres y platos regionales.",
            inLanguage: "es-AR",
            hasPart: recipes.map((r) => ({
              "@type": "Recipe",
              name: r.title,
              url: `${SITE_URL}/recetas/${r.slug}`,
            })),
          },
        ]}
      />

      <section className="border-b border-ink/10 bg-ivory-100 py-20 text-center lg:py-28">
        <div className="container-x">
          <span className="eyebrow">Le nostre ricette</span>
          <h1 className="mt-4 font-serif text-5xl text-ink sm:text-6xl lg:text-7xl">
            Recetas italianas
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            Los clásicos de la cocina italiana, explicados como los haría una nonna. Cada receta
            viene con los ingredientes de nuestro catálogo, listos para pedir con un click.
          </p>
        </div>
      </section>

      <section className="container-x py-16 lg:py-24">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <Link
              key={r.slug}
              href={`/recetas/${r.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100">
                <Image
                  src={r.image}
                  alt={r.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <span className="eyebrow">{r.region ?? r.category}</span>
                <h2 className="mt-2 font-serif text-2xl text-ink group-hover:underline sm:text-3xl">
                  {r.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{r.summary}</p>
                <p className="mt-3 text-[11px] uppercase tracking-extra-wide text-ink/50">
                  {r.prepTimeMin + r.cookTimeMin} min · {r.servings} porciones · {r.difficulty}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
