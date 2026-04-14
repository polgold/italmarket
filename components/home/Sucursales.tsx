import Image from "next/image";
import Link from "next/link";
import { MapPinIcon } from "@/components/ui/Icons";

const stores = [
  {
    name: "Barrio Norte",
    address: "Av. Santa Fe 2727, CABA",
    hours: "Lun a Sáb · 10 a 21 h",
    image: "/images/storefront.jpg",
    map: "https://maps.google.com/?q=Av.+Santa+Fe+2727+CABA",
  },
  {
    name: "San Telmo",
    address: "Defensa 863, CABA",
    hours: "Mar a Dom · 11 a 20 h",
    image: "/images/san-telmo.jpg",
    map: "https://maps.google.com/?q=Defensa+863+CABA",
  },
];

export function Sucursales() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">Le nostre botteghe</span>
          <h2 className="mt-4 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">Sucursales</h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/60 sm:text-base">
            Dos espacios para descubrir Italia a través de sus sabores. Catas, degustaciones y la
            mejor atención en el corazón de Buenos Aires.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {stores.map((s) => (
            <article key={s.name} className="group flex flex-col bg-ivory-100">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col items-start gap-4 p-8 sm:p-10">
                <span className="eyebrow">Italmarket</span>
                <h3 className="font-serif text-4xl text-ink">{s.name}</h3>
                <p className="flex items-center gap-2 text-sm text-ink/70">
                  <MapPinIcon className="h-4 w-4" /> {s.address}
                </p>
                <p className="text-sm text-ink/70">{s.hours}</p>
                <Link href={s.map} target="_blank" className="btn-outline mt-3">
                  Cómo llegar
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
