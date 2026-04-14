import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { ORG_CONTACT, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cómo comprar en Italmarket · Guía paso a paso",
  description:
    "Todo lo que necesitás saber para comprar en Italmarket: pagos (transferencia, tarjeta, Mercado Pago), envíos Andreani a todo el país, retiro gratis en Barrio Norte o San Telmo, y seguimiento de tu pedido.",
  alternates: { canonical: "/como-comprar" },
};

const STEPS = [
  {
    n: "01",
    t: "Elegí tus productos",
    d: "Navegá el catálogo por categorías o usá el buscador. En cada ficha vas a encontrar descripción, origen y disponibilidad. Si querés inspiración, empezá por una de nuestras recetas — cargan el carrito con los ingredientes automáticamente.",
    href: "/productos",
    cta: "Ver catálogo",
  },
  {
    n: "02",
    t: "Armá tu carrito",
    d: "Agregá los productos al carrito y ajustá cantidades. Podés seguir navegando sin perder nada: el carrito queda guardado en tu sesión.",
    href: "/carrito",
    cta: "Ver carrito",
  },
  {
    n: "03",
    t: "Elegí cómo lo recibís",
    d: "En el checkout elegís: retiro gratuito en una de nuestras sucursales (Barrio Norte o San Telmo) o envío por Andreani a todo el país.",
    href: "/sucursales",
    cta: "Ver sucursales",
  },
  {
    n: "04",
    t: "Pagá con el medio que prefieras",
    d: "Tarjeta de crédito o débito y Mercado Pago se acreditan al instante. Si pagás por transferencia bancaria, tenés que enviarnos el comprobante por WhatsApp para que liberemos el pedido.",
    href: "#pagos",
    cta: "Métodos de pago",
  },
  {
    n: "05",
    t: "Seguimos tu pedido juntos",
    d: "Recibís confirmación por email. Cuando lo despachamos, te pasamos el número de seguimiento para que lo rastrees en Andreani. Si lo retirás en sucursal, te avisamos cuando está listo.",
    href: "#envios",
    cta: "Detalles de envío",
  },
  {
    n: "06",
    t: "Disfrutá",
    d: "Apenas te llega, abrí la caja y revisá que todo esté en orden. Si hay cualquier detalle escribinos por WhatsApp — lo resolvemos ese mismo día.",
    href: "/contacto",
    cta: "Contactanos",
  },
];

const FAQS = [
  {
    q: "¿Cómo hago para comprar en Italmarket?",
    a: "Elegís los productos del catálogo, los agregás al carrito, vas al checkout, completás tus datos, elegís retiro en sucursal o envío por Andreani y pagás con tarjeta, Mercado Pago o transferencia bancaria.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Aceptamos tarjeta de crédito, tarjeta de débito, Mercado Pago y transferencia bancaria. En las sucursales físicas también aceptamos efectivo.",
  },
  {
    q: "Si pago por transferencia, ¿cuándo se despacha mi pedido?",
    a: "Cuando pagás por transferencia, tu pedido queda en estado 'pendiente de pago'. Enviános el comprobante por WhatsApp al +54 9 11 6783-6252. Una vez verificado el pago (dentro de las 24 hs hábiles) liberamos el pedido y lo preparamos para despachar o retirar.",
  },
  {
    q: "¿Cuánto tarda el envío por Andreani?",
    a: "Una vez que despachamos el pedido (dentro de las 24–48 hs hábiles después de confirmar el pago), los tiempos dependen de la red de Andreani: 48–72 hs para CABA y GBA, y 5–7 días hábiles para el resto del país. Tené en cuenta que esos tiempos los gestiona Andreani directamente.",
  },
  {
    q: "¿Puedo retirar mi pedido en la tienda?",
    a: "Sí, el retiro es gratis en cualquiera de nuestras dos sucursales: Av. Santa Fe 2727 (Barrio Norte) o Defensa 863 (San Telmo). Cuando el pedido está listo te avisamos por email o WhatsApp para que pases a buscarlo.",
  },
  {
    q: "¿Cómo hago seguimiento de mi pedido?",
    a: "Recibís un email cuando confirmamos el pedido, otro cuando lo preparamos y otro cuando lo despachamos. Ese último incluye el número de seguimiento de Andreani para que lo rastrees en su sitio. Si retirás en sucursal, te avisamos en cuanto esté listo.",
  },
  {
    q: "¿Qué hago si un producto llega dañado, vencido o no es el que pedí?",
    a: "Escribinos por WhatsApp con una foto el mismo día de la entrega. Lo resolvemos: reemplazo del producto, devolución o nota de crédito según el caso.",
  },
  {
    q: "¿Hacen envíos al interior del país?",
    a: "Sí. Despachamos por Andreani a todo Argentina. El costo y el tiempo de entrega dependen de la localidad de destino y se calculan al cargar tu código postal en el checkout.",
  },
];

export default function ComoComprarPage() {
  const pageUrl = `${SITE_URL}/como-comprar`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "Italmarket", url: `${SITE_URL}/` },
      { name: "Cómo comprar", url: pageUrl },
    ]),
    faqSchema(FAQS),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="bg-ivory-100 py-20 lg:py-28">
        <div className="container-x max-w-3xl">
          <span className="eyebrow">Guida all&apos;acquisto</span>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-ink sm:text-6xl">
            Cómo comprar en Italmarket
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
            Seis pasos claros, tres medios de pago y dos formas de recibirlo. Acá te
            contamos todo el recorrido, desde que elegís el producto hasta que lo
            abrís en tu cocina.
          </p>
        </div>
      </section>

      <section className="container-x py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16">
          {STEPS.map((step) => (
            <article key={step.n} className="border-t border-ink/15 pt-8">
              <div className="eyebrow text-ink/50">{step.n}</div>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">{step.t}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">{step.d}</p>
              <Link href={step.href} className="link-underline mt-6 inline-block text-sm uppercase tracking-extra-wide text-ink">
                {step.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="pagos" className="bg-ivory-100 py-20 lg:py-24 scroll-mt-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <span className="eyebrow">Pagamenti</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Métodos de pago
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Elegí el que te quede más cómodo. Todos son seguros y tus datos quedan
              protegidos por los proveedores de pago.
            </p>
          </div>
          <div className="space-y-8">
            <div className="border-t border-ink/15 pt-6">
              <h3 className="font-serif text-2xl text-ink">Tarjeta de crédito o débito</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Procesado por Mercado Pago. Acreditación inmediata — en cuanto pagás,
                tu pedido entra en preparación. Hasta 3 cuotas sin interés en compras
                seleccionadas.
              </p>
            </div>
            <div className="border-t border-ink/15 pt-6">
              <h3 className="font-serif text-2xl text-ink">Mercado Pago</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Pagás con tu saldo, tarjeta o medios habilitados de MP. También se
                acredita al instante.
              </p>
            </div>
            <div className="border-t border-ink/15 pt-6">
              <h3 className="font-serif text-2xl text-ink">Transferencia bancaria</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Al finalizar la compra te mostramos los datos bancarios. Es importante
                que nos envíes el <strong className="text-ink">comprobante por WhatsApp</strong>{" "}
                para que podamos verificar el pago. Una vez verificado (dentro de las 24 hs
                hábiles) liberamos el pedido.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
                <a
                  href={ORG_CONTACT.whatsappSanTelmo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm uppercase tracking-extra-wide text-ink"
                >
                  WhatsApp San Telmo →
                </a>
                <a
                  href={ORG_CONTACT.whatsappBarrioNorte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm uppercase tracking-extra-wide text-ink"
                >
                  WhatsApp Barrio Norte →
                </a>
              </div>
            </div>
            <div className="border-t border-ink/15 pt-6">
              <h3 className="font-serif text-2xl text-ink">Efectivo en tienda</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Si retirás el pedido en sucursal, también podés abonar en efectivo
                al pasar a buscarlo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="envios" className="container-x py-20 lg:py-24 scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <span className="eyebrow">Spedizioni</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Envíos y retiro
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Tenés dos opciones. Retiro gratuito en cualquiera de nuestras sucursales,
              o envío a domicilio por Andreani a todo el país.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-ink">Retiro en sucursal</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Sin costo. Elegís la sucursal en el checkout y cuando tu pedido
                  está listo te avisamos por email o WhatsApp para que pases a
                  buscarlo en el horario que prefieras.
                </p>
                <ul className="mt-4 space-y-1 text-sm text-ink/70">
                  <li><strong className="text-ink">Barrio Norte</strong> · Av. Santa Fe 2727</li>
                  <li><strong className="text-ink">San Telmo</strong> · Defensa 863</li>
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-ink">Envío por Andreani</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Despachamos dentro de las 24–48 hs hábiles después de confirmar
                  tu pago. A partir de ahí, los tiempos los gestiona la red de
                  Andreani y dependen del destino.
                </p>
              </div>
            </div>
          </div>

          <aside className="self-start rounded-sm border border-ink/15 bg-ivory-100 p-8">
            <h3 className="eyebrow">Tiempos estimados de Andreani</h3>
            <ul className="mt-6 space-y-4 text-sm text-ink/80">
              <li className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
                <span>CABA y GBA</span>
                <span className="font-serif text-lg text-ink">48 a 72 hs</span>
              </li>
              <li className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
                <span>Provincia de Buenos Aires</span>
                <span className="font-serif text-lg text-ink">3 a 5 días</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span>Resto del país</span>
                <span className="font-serif text-lg text-ink">5 a 7 días</span>
              </li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-ink/60">
              Tiempos hábiles aproximados gestionados por Andreani a partir del
              despacho. El costo exacto se calcula al ingresar tu código postal
              en el checkout.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-ivory-100 py-20 lg:py-24">
        <div className="container-x max-w-3xl">
          <span className="eyebrow">Domande frequenti</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Preguntas frecuentes
          </h2>

          <div className="mt-12 divide-y divide-ink/10 border-t border-ink/15">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer items-start justify-between gap-6 font-serif text-xl text-ink">
                  {faq.q}
                  <span className="mt-1 text-ink/40 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bosco-800 py-20 text-center text-ivory-50">
        <div className="container-x">
          <h2 className="font-serif text-4xl sm:text-5xl">¿Dudas antes de comprar?</h2>
          <p className="mx-auto mt-4 max-w-lg text-ivory-50/70">
            Escribinos por WhatsApp y te respondemos en el día. También podés
            pasar por cualquiera de nuestras dos sucursales.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={ORG_CONTACT.whatsappSanTelmo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-ivory-50 text-ink hover:bg-ivory-100"
            >
              WhatsApp San Telmo
            </a>
            <a
              href={ORG_CONTACT.whatsappBarrioNorte}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-ivory-50 text-ink hover:bg-ivory-100"
            >
              WhatsApp Barrio Norte
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
