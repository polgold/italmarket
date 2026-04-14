import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPinIcon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, STORES } from "@/lib/seo";
import { breadcrumbSchema, storeSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Sucursales en Buenos Aires — Barrio Norte y San Telmo",
  description:
    "Visitá Italmarket en Av. Santa Fe 2727 (Barrio Norte) o Defensa 863 (San Telmo). Retiro de pedidos, degustaciones y atención personalizada con productos italianos importados.",
  alternates: { canonical: "/sucursales" },
  openGraph: {
    title: "Sucursales Italmarket · Barrio Norte y San Telmo",
    description:
      "Dos tiendas físicas en Buenos Aires para descubrir Italia a través de sus sabores.",
    url: `${SITE_URL}/sucursales`,
    type: "website",
    images: ["/images/storefront.jpg"],
  },
};

const stores = [
  {
    id: "barrio-norte",
    name: "Italmarket Barrio Norte",
    address: "Av. Santa Fe 2727, CABA",
    hours: [
      { d: "Lunes a Viernes", h: "10:00 — 21:00" },
      { d: "Sábado", h: "10:00 — 20:00" },
      { d: "Domingo", h: "Cerrado" },
    ],
    phone: "+54 9 11 5136-4554",
    whatsapp: "https://wa.me/5491151364554",
    image: "/images/storefront.jpg",
    map: "https://maps.google.com/?q=Av.+Santa+Fe+2727+CABA",
  },
  {
    id: "san-telmo",
    name: "Italmarket San Telmo",
    address: "Defensa 863, CABA",
    hours: [
      { d: "Martes a Sábado", h: "11:00 — 20:00" },
      { d: "Domingo", h: "11:00 — 18:00" },
      { d: "Lunes", h: "Cerrado" },
    ],
    phone: "+54 9 11 6783-6252",
    whatsapp: "https://wa.me/5491167836252",
    image: "/images/san-telmo.jpg",
    map: "https://maps.google.com/?q=Defensa+863+CABA",
  },
];

export default function SucursalesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Inicio", url: `${SITE_URL}/` },
            { name: "Sucursales", url: `${SITE_URL}/sucursales` },
          ]),
          ...STORES.map(storeSchema),
        ]}
      />
      <section className="border-b border-ink/10 bg-ivory-100 py-20 text-center lg:py-28">
        <div className="container-x">
          <span className="eyebrow">Le nostre botteghe</span>
          <h1 className="mt-4 font-serif text-5xl text-ink sm:text-6xl lg:text-7xl">Sucursales</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            Dos espacios en Buenos Aires para descubrir Italia a través de sus sabores.
          </p>
        </div>
      </section>

      {stores.map((s, i) => (
        <section key={s.name} id={s.id} className={`scroll-mt-24 py-24 ${i % 2 ? "bg-ivory-100" : ""}`}>
          <div className={`container-x grid gap-14 lg:grid-cols-2 lg:gap-20 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={s.image} alt={s.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="eyebrow">Italmarket</span>
              <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">{s.name.replace("Italmarket ", "")}</h2>
              <p className="mt-6 flex items-center gap-2 text-base text-ink/70">
                <MapPinIcon className="h-5 w-5" /> {s.address}
              </p>
              <p className="mt-2 text-base text-ink/70">
                WhatsApp{" "}
                <a href={s.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline text-ink">
                  {s.phone}
                </a>
              </p>

              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {s.hours.map((h) => (
                  <div key={h.d} className="flex items-center justify-between py-3">
                    <dt className="text-[11px] uppercase tracking-extra-wide text-ink/60">{h.d}</dt>
                    <dd className="font-serif text-lg text-ink">{h.h}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={s.map} target="_blank" className="btn-primary">Cómo llegar</Link>
                <a href={s.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
