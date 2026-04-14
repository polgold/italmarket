import Link from "next/link";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/Icons";
import { getCategories } from "@/lib/woocommerce";

export async function Footer() {
  const categories = await getCategories();
  const topCategories = categories
    .filter((c) => c.parent === 0 && (c.count ?? 0) > 0)
    .slice(0, 5);

  return (
    <footer className="mt-24 border-t border-ink/10 bg-ivory-100">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-serif text-2xl tracking-[0.18em] text-ink">ITALMARKET</div>
            <p className="mt-1 text-[10px] uppercase tracking-extra-wide text-ink/60">Delizie Italiane · Buenos Aires</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/70">
              Un viaggio di sapori. Traemos lo mejor de Italia a tu mesa: pastas artesanales,
              aceites de primera presión, salumi, formaggi, vinos y dolci seleccionados con criterio.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="https://instagram.com/italmarket.ar" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ink/70 hover:text-ink">
                <InstagramIcon />
              </a>
              <a href="https://wa.me/5491167836252" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp San Telmo" className="text-ink/70 hover:text-ink">
                <WhatsappIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-5">Tienda</h4>
            <ul className="space-y-3 text-sm text-ink/75">
              <li><Link href="/productos" className="link-underline">Todas las categorías</Link></li>
              {topCategories.map((c) => (
                <li key={c.id}>
                  <Link href={`/productos?categoria=${c.slug}`} className="link-underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5">Casa</h4>
            <ul className="space-y-3 text-sm text-ink/75">
              <li><Link href="/recetas" className="link-underline">Recetas</Link></li>
              <li><Link href="/guias" className="link-underline">Guías</Link></li>
              <li><Link href="/marca" className="link-underline">Marcas</Link></li>
              <li><Link href="/nosotros" className="link-underline">Nosotros</Link></li>
              <li><Link href="/sucursales" className="link-underline">Sucursales</Link></li>
              <li><Link href="/como-comprar" className="link-underline">Cómo comprar</Link></li>
              <li><Link href="/contacto" className="link-underline">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5">Sucursales</h4>
            <div className="space-y-5 text-sm text-ink/75">
              <div>
                <div className="font-serif text-lg text-ink">Barrio Norte</div>
                <p className="mt-1 leading-relaxed">Av. Santa Fe 2727<br />CABA, Buenos Aires</p>
                <a
                  href="https://wa.me/5491151364554"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block link-underline"
                >
                  +54 9 11 5136-4554
                </a>
              </div>
              <div>
                <div className="font-serif text-lg text-ink">San Telmo</div>
                <p className="mt-1 leading-relaxed">Defensa 863<br />CABA, Buenos Aires</p>
                <a
                  href="https://wa.me/5491167836252"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block link-underline"
                >
                  +54 9 11 6783-6252
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 sm:flex-row">
          <p className="text-[11px] uppercase tracking-extra-wide text-ink/50">
            © {new Date().getFullYear()} Italmarket. Todos los derechos reservados.
          </p>
          <p className="text-[11px] uppercase tracking-extra-wide text-ink/50">
            Prodotti italiani di alta qualità
          </p>
        </div>
      </div>
    </footer>
  );
}
