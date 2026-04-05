import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="eyebrow">Errore 404</span>
      <h1 className="mt-4 font-serif text-6xl text-ink sm:text-7xl">Pagina non trovata</h1>
      <p className="mt-6 max-w-md text-ink/60">
        La página que buscás no existe o fue movida. Volvé al inicio para seguir explorando Italmarket.
      </p>
      <Link href="/" className="btn-primary mt-10">Volver al inicio</Link>
    </section>
  );
}
