export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-bosco-800 text-ivory-50">
      <div className="container-x py-24 text-center lg:py-28">
        <span className="eyebrow text-ivory-200/70">— Rimani in contatto</span>
        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
          Recibí novedades, recetas y catas privadas
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ivory-50/70 sm:text-base">
          Suscribite y sé el primero en conocer nuevas importaciones y eventos exclusivos en nuestras sucursales.
        </p>
        <form className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="tu@email.com"
            className="flex-1 border border-ivory-50/30 bg-transparent px-5 py-4 text-sm text-ivory-50 placeholder:text-ivory-50/50 focus:border-ivory-50 focus:outline-none"
          />
          <button type="submit" className="btn-primary bg-ivory-50 text-ink hover:bg-ivory-100">
            Suscribirme
          </button>
        </form>
        <p className="mt-4 text-[11px] uppercase tracking-extra-wide text-ivory-50/40">
          Sin spam. Solo sabores italianos.
        </p>
      </div>
    </section>
  );
}
