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
          <span className="eyebrow text-ivory-50/80">— Delizie Italiane · Buenos Aires</span>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-[84px]">
            Un viaggio<br />
            <em className="italic text-ivory-50/90">di sapori</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory-50/80 sm:text-lg">
            Productos italianos seleccionados uno por uno. Pastas artesanales, aceites de primera
            presión, salumi, formaggi y vinos, directo desde Italia a tu mesa.
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
        Est. 2015 · Barrio Norte & San Telmo
      </div>
    </section>
  );
}
