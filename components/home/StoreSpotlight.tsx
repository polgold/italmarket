import Image from "next/image";
import Link from "next/link";

export function StoreSpotlight() {
  return (
    <section className="bg-ivory-100 py-24 lg:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src="/images/storefront.jpg"
            alt="Sucursal Italmarket"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="eyebrow">Dal 2015 a Buenos Aires</span>
          <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[56px]">
            Una bottega italiana en el corazón porteño.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70">
            Italmarket nació del deseo de acercar la tradición italiana auténtica a Buenos Aires.
            Cada producto de nuestra tienda es fruto de viajes, catas y largas conversaciones con
            productores que mantienen vivas las recetas de sus familias.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Más que una tienda, somos un punto de encuentro para quienes aman la buena mesa.
            Te esperamos en nuestras sucursales de Barrio Norte y San Telmo.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/nosotros" className="btn-primary">
              Nuestra historia
            </Link>
            <Link href="/sucursales" className="btn-outline">
              Visitá las sucursales
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            <div>
              <dt className="eyebrow">Etiquetas</dt>
              <dd className="mt-1 font-serif text-3xl text-ink">+600</dd>
            </div>
            <div>
              <dt className="eyebrow">Productores</dt>
              <dd className="mt-1 font-serif text-3xl text-ink">80</dd>
            </div>
            <div>
              <dt className="eyebrow">Regiones</dt>
              <dd className="mt-1 font-serif text-3xl text-ink">14</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
