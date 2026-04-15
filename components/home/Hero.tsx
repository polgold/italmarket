import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden bg-ink">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-poster.png"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/70" />

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-16 text-ivory-50 sm:justify-center sm:pb-0">
        <div className="max-w-2xl animate-fade-up">
          <span className="eyebrow text-ivory-50/80">— Un viaggio di sapori · Dal 2015</span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-[72px]">
            Productos italianos importados<br />
            <em className="italic text-ivory-50/90">en Buenos Aires</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory-50/80 sm:text-lg">
            Pastas artesanales, aceites de oliva extra virgen, salumi, quesos, vinos y dolci
            importados directo desde Italia. Sucursales en Barrio Norte y San Telmo, envíos a
            todo el país.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/productos" className="btn-primary bg-ivory-50 text-ink hover:bg-ivory-100">
              Explorar la tienda <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/nosotros" className="btn-ghost text-ivory-50/90 hover:text-ivory-50">
              Nuestra historia
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 hidden text-[10px] uppercase tracking-extra-wide text-ivory-50/60 sm:block">
        Barrio Norte & San Telmo
      </div>
    </section>
  );
}
