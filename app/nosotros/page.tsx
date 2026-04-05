import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Italmarket es una tienda italiana en Buenos Aires. Conocé nuestra historia, nuestro método de selección y la pasión detrás de cada producto.",
};

export default function NosotrosPage() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[440px] w-full overflow-hidden bg-ink">
        <Image
          src="/images/lifestyle-3.jpg"
          alt="Italmarket"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 to-ink/60" />
        <div className="container-x relative z-10 flex h-full flex-col items-center justify-center text-center text-ivory-50">
          <span className="eyebrow text-ivory-50/80">La nostra storia</span>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl">Un viaggio di sapori</h1>
        </div>
      </section>

      <section className="container-x py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-2xl leading-relaxed text-ink sm:text-3xl lg:text-4xl">
            Italmarket nació del deseo de acercar la tradición italiana auténtica al corazón de Buenos Aires.
            Cada producto es fruto de viajes, catas y largas conversaciones con productores que mantienen
            vivas las recetas de sus familias.
          </p>
        </div>
      </section>

      <section className="bg-ivory-100 py-24">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/lifestyle-1.jpg" alt="Pastas italianas" fill className="object-cover" />
          </div>
          <div>
            <span className="eyebrow">Il metodo</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Seleccionamos, no importamos.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Cada año recorremos Italia buscando los mejores productores artesanales. Visitamos sus
              talleres, conocemos a sus familias y probamos cada producto antes de incorporarlo a nuestro
              catálogo. Sólo así podemos garantizarte calidad real.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Trabajamos con pequeñas producciones, muchas con certificaciones DOP, IGP y DOCG, que
              respetan los métodos tradicionales y la geografía de cada región.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { t: "Autenticidad", d: "Productos genuinos, respetando la tradición de cada región italiana." },
            { t: "Curaduría", d: "Menos es más: seleccionamos los mejores exponentes de cada categoría." },
            { t: "Cercanía", d: "Atención personalizada en tienda, maridajes y recomendaciones." },
          ].map((v) => (
            <div key={v.t} className="border-t border-ink/15 pt-8">
              <h3 className="font-serif text-3xl text-ink">{v.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bosco-800 py-20 text-center text-ivory-50">
        <div className="container-x">
          <h2 className="font-serif text-4xl sm:text-5xl">Te esperamos en nuestras sucursales</h2>
          <p className="mx-auto mt-4 max-w-md text-ivory-50/70">Barrio Norte &middot; San Telmo</p>
          <Link href="/sucursales" className="btn-primary mt-8 bg-ivory-50 text-ink hover:bg-ivory-100">
            Conocer sucursales
          </Link>
        </div>
      </section>
    </>
  );
}
