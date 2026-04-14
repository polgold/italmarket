import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { guides } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Guías de productos italianos",
  description:
    "Guías para elegir productos italianos: aceite de oliva extra virgen, DOP e IGP, pasta seca y fresca, quesos y más. Todo lo que necesitás saber antes de comprar.",
  alternates: { canonical: "/guias" },
  openGraph: {
    title: "Guías de productos italianos · Italmarket",
    description:
      "Aprende a elegir productos italianos auténticos con nuestras guías de compra.",
    url: `${SITE_URL}/guias`,
    type: "website",
  },
};

export default function GuiasIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/` },
          { name: "Guías", url: `${SITE_URL}/guias` },
        ])}
      />

      <section className="border-b border-ink/10 bg-ivory-100 py-20 text-center lg:py-28">
        <div className="container-x">
          <span className="eyebrow">Le nostre guide</span>
          <h1 className="mt-4 font-serif text-5xl text-ink sm:text-6xl lg:text-7xl">
            Guías
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            Todo lo que tenés que saber para elegir productos italianos auténticos: categorías,
            certificaciones, métodos de producción y cómo leer una etiqueta.
          </p>
        </div>
      </section>

      <section className="container-x py-16 lg:py-24">
        <div className="grid gap-10 sm:grid-cols-2">
          {guides.map((g) => (
            <Link key={g.slug} href={`/guias/${g.slug}`} className="group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden bg-ivory-100">
                <Image
                  src={g.image}
                  alt={g.imageAlt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <span className="eyebrow">{g.readTimeMin} min de lectura</span>
                <h2 className="mt-2 font-serif text-2xl text-ink group-hover:underline sm:text-3xl">
                  {g.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{g.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
