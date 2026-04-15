import type { Metadata } from "next";
import { InstagramIcon, WhatsappIcon, MapPinIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contacto · WhatsApp, email y sucursales",
  description:
    "Contactá a Italmarket por WhatsApp (+54 11 4446-9610), email info@italmarket.com.ar o visitá nuestras sucursales en Barrio Norte y San Telmo. Consultas, pedidos mayoristas y eventos privados.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <span className="eyebrow">Scrivici</span>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-ink sm:text-6xl">Contacto</h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
            ¿Tenés una consulta, querés organizar una degustación privada o sumar Italmarket a tu
            evento? Escribinos y te respondemos a la brevedad.
          </p>

          <div className="mt-10 space-y-6 border-t border-ink/10 pt-10">
            <div>
              <h3 className="eyebrow">Email</h3>
              <a href="mailto:info@italmarket.com.ar" className="mt-1 block font-serif text-2xl text-ink hover:underline">
                info@italmarket.com.ar
              </a>
            </div>
            <div>
              <h3 className="eyebrow">WhatsApp</h3>
              <a
                href="https://wa.me/541144469610"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-serif text-2xl text-ink hover:underline"
              >
                +54 11 4446-9610
              </a>
            </div>
            <div>
              <h3 className="eyebrow">Sucursales</h3>
              <p className="mt-1 flex items-center gap-2 text-ink/70">
                <MapPinIcon className="h-4 w-4" /> Av. Santa Fe 2727 · Barrio Norte
              </p>
              <p className="mt-1 flex items-center gap-2 text-ink/70">
                <MapPinIcon className="h-4 w-4" /> Defensa 863 · San Telmo
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://instagram.com/italmarket.ar" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ink/70 hover:text-ink">
                <InstagramIcon />
              </a>
              <a href="https://wa.me/541144469610" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-ink/70 hover:text-ink">
                <WhatsappIcon />
              </a>
            </div>
          </div>
        </div>

        <form className="bg-ivory-100 p-10 lg:p-14">
          <div className="grid gap-6">
            <div>
              <label className="eyebrow block">Nombre</label>
              <input type="text" required className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-base focus:border-ink focus:outline-none" />
            </div>
            <div>
              <label className="eyebrow block">Email</label>
              <input type="email" required className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-base focus:border-ink focus:outline-none" />
            </div>
            <div>
              <label className="eyebrow block">Asunto</label>
              <input type="text" className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-base focus:border-ink focus:outline-none" />
            </div>
            <div>
              <label className="eyebrow block">Mensaje</label>
              <textarea rows={5} required className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-base focus:border-ink focus:outline-none" />
            </div>
            <button type="submit" className="btn-primary mt-4 w-full">Enviar mensaje</button>
          </div>
        </form>
      </div>
    </section>
  );
}
