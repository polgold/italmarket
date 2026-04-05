import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPinIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Sucursales",
  description: "Visitanos en nuestras sucursales de Barrio Norte y San Telmo, Buenos Aires.",
};

const stores = [
  {
    name: "Italmarket Barrio Norte",
    address: "Av. Santa Fe 2100, CABA",
    hours: [
      { d: "Lunes a Viernes", h: "10:00 — 21:00" },
      { d: "Sábado", h: "10:00 — 20:00" },
      { d: "Domingo", h: "Cerrado" },
    ],
    phone: "+54 11 0000 0000",
    image: "/images/storefront.jpg",
    map: "https://maps.google.com/?q=Av.+Santa+Fe+2100+CABA",
  },
  {
    name: "Italmarket San Telmo",
    address: "Defensa 800, CABA",
    hours: [
      { d: "Martes a Sábado", h: "11:00 — 20:00" },
      { d: "Domingo", h: "11:00 — 18:00" },
      { d: "Lunes", h: "Cerrado" },
    ],
    phone: "+54 11 0000 0000",
    image: "/images/lifestyle-3.jpg",
    map: "https://maps.google.com/?q=Defensa+800+CABA",
  },
];

export default function SucursalesPage() {
  return (
    <>
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
        <section key={s.name} className={`py-24 ${i % 2 ? "bg-ivory-100" : ""}`}>
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
              <p className="mt-2 text-base text-ink/70">Tel. {s.phone}</p>

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
                <Link href="/contacto" className="btn-outline">Contactar</Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
