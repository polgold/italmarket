import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SITE_URL } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { getProducts } from "@/lib/woocommerce";
import type { Product } from "@/lib/types";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Quesos italianos en Buenos Aires · Burrata, Mascarpone, Ricotta",
  description:
    "Quesos italianos importados y frescos en Buenos Aires: burrata, mascarpone, ricotta, caciocavallo, bocconcino y treccia ahumada. Cadena de frío, retiro en Barrio Norte y San Telmo, envíos a todo el país.",
  alternates: { canonical: "/quesos-italianos" },
  openGraph: {
    title: "Quesos italianos · Italmarket",
    description:
      "Burrata, mascarpone, ricotta, caciocavallo, bocconcino y la mejor selección de quesos italianos frescos en Buenos Aires.",
    url: `${SITE_URL}/quesos-italianos`,
    type: "website",
  },
};

const FAQS = [
  {
    q: "¿Qué quesos italianos venden en Italmarket?",
    a: "Trabajamos quesos italianos frescos importados y de productores con técnica italiana en Argentina: burrata, mascarpone, ricotta, caciocavallo, bocconcino, treccia ahumada y provolone. Por temporada incluimos parmigiano reggiano DOP, pecorino romano DOP y gorgonzola DOP en bloque o porción. Si buscás un queso específico, escribinos por WhatsApp y te confirmamos disponibilidad.",
  },
  {
    q: "¿Cuál es la diferencia entre burrata y mozzarella?",
    a: "La mozzarella es una pasta filata sólida; la burrata, también pasta filata, lleva en su interior un relleno cremoso de stracciatella (hilachas de mozzarella mezcladas con crema). Por eso al cortarla, la burrata se desarma y libera la crema. Es un queso joven, se consume dentro de las 48–72 h de elaborada idealmente. Combina con pomodorini frescos, hojas de albahaca, AOVE y pan tostado.",
  },
  {
    q: "¿El parmigiano reggiano y el grana padano son lo mismo?",
    a: "No. Ambos son quesos duros de leche cruda, pero pertenecen a DOP distintas. El Parmigiano Reggiano DOP se elabora solo en Parma, Reggio Emilia, Modena, Bologna oeste del Reno y Mantova al sur del Po; tiene maduración mínima de 12 meses (24 m, 36 m, 48 m son los más codiciados) y aroma más intenso. El Grana Padano DOP cubre una zona más amplia del Valle del Po, permite vacas con dieta de ensilado y madura desde 9 meses; es más suave y económico. Ambos excelentes para rallar y comer en lascas.",
  },
  {
    q: "¿Cómo conservo un queso italiano fresco?",
    a: "Burrata, bocconcino y mozzarella: en su líquido original, en heladera (4 °C), consumir dentro de los 5 días desde compra. Mascarpone y ricotta: cerrados en su envase original hasta la fecha de vencimiento; una vez abiertos, 3–4 días. Caciocavallo, provolone y quesos duros: envueltos en papel manteca o film alimentario, hasta 2 semanas. Nunca al lado del freezer: frío excesivo arruina la textura.",
  },
  {
    q: "¿Cómo armo una tabla de quesos italiana?",
    a: "Una buena tabla combina texturas y maduraciones: un fresco (burrata o stracciatella), un semi-duro (caciocavallo o provolone), un azul (gorgonzola) y un duro (parmigiano en lascas con cuchillo de almendra). Acompañá con grissini, focaccia, mostarda di Cremona, miel de acacia, peras o uvas frescas, y nueces. Para vino: Chianti Classico o Prosecco DOCG.",
  },
  {
    q: "¿Hacen envíos de quesos a todo el país?",
    a: "Sí. En CABA y AMBA usamos logística refrigerada (moto térmica o camión refrigerado según volumen). Al interior coordinamos con transporte refrigerado y avisamos los días de despacho por WhatsApp. Para retiro sin costo: Barrio Norte (Av. Santa Fe 2727) o San Telmo (Defensa 863).",
  },
];

const REGIONI = [
  {
    region: "Campania",
    quesos: "Mozzarella di Bufala Campana DOP, Fior di Latte, Provolone del Monaco DOP",
    nota: "Cuna de la pasta filata. Mozzarella de búfala con sello DOP solo de cinco provincias del sur.",
  },
  {
    region: "Emilia-Romagna",
    quesos: "Parmigiano Reggiano DOP, Squacquerone di Romagna DOP",
    nota: "El rey de los duros: Parmigiano de leche cruda con maduración mínima 12 m, ideal hasta 36 m.",
  },
  {
    region: "Puglia",
    quesos: "Burrata di Andria IGP, Stracciatella, Caciocavallo Silano DOP",
    nota: "Andria es el origen de la burrata (década del 30). Hoy hay producción artesanal en todo el sur.",
  },
  {
    region: "Lazio · Sardegna",
    quesos: "Pecorino Romano DOP, Pecorino Sardo DOP",
    nota: "Quesos de oveja, salados y tánicos. Indispensables para cacio e pepe y pesto genovese auténtico.",
  },
  {
    region: "Lombardia",
    quesos: "Gorgonzola DOP, Taleggio DOP, Mascarpone, Grana Padano DOP",
    nota: "Quesos azules y cremosos del norte. El mascarpone es la base del tiramisú.",
  },
  {
    region: "Piemonte · Valle d'Aosta",
    quesos: "Robiola di Roccaverano DOP, Fontina DOP, Bra DOP",
    nota: "Quesos alpinos de pasta semicocida y maduración media. Perfectos para fonduta.",
  },
];

const NAME_MATCH = /\b(burrata|mascarpone|ricotta|caciocavallo|bocconcino|treccia|mozzar(?:ella)?|fior\s+di\s+latte|provolone|parmigiano|pecorino|grana\s+padano|gorgonzola|taleggio|asiago|fontina|stracciatella|robiola|scamorza|gran\s+queso)\b/i;
const NAME_EXCLUDE = /\b(pizza|girasoli|ravioli|tortelloni|tortellini|cappelleti|cappelletti|lasagna|cannelloni|pasta)\b/i;

function matchCheeses(products: Product[]): Product[] {
  return products.filter((p) => NAME_MATCH.test(p.name) && !NAME_EXCLUDE.test(p.name));
}

export default async function QuesosItalianosPage() {
  const all = await getProducts();
  const cheeses = matchCheeses(all);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Inicio", url: `${SITE_URL}/` },
            { name: "Quesos italianos", url: `${SITE_URL}/quesos-italianos` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Quesos italianos en Italmarket",
            url: `${SITE_URL}/quesos-italianos`,
            description:
              "Selección de quesos italianos frescos y curados en Italmarket: burrata, mascarpone, ricotta, caciocavallo, parmigiano, pecorino y más.",
            inLanguage: "es-AR",
          },
          faqSchema(FAQS),
        ]}
      />

      <section className="border-b border-ink/10 bg-ivory-100">
        <div className="container-x py-12 text-center lg:py-16">
          <nav className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-extra-wide text-ink/50">
            <Link href="/" className="hover:text-ink">Inicio</Link>
            <span>/</span>
            <span className="text-ink/80">Quesos italianos</span>
          </nav>
          <span className="eyebrow">Formaggi italiani</span>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">
            Quesos italianos en Buenos Aires
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-ink/70">
            Italia produce más de 450 quesos distintos y 50 con sello DOP — más que ningún otro país del mundo.
            En Italmarket trabajamos los frescos del sur (burrata di Andria, mascarpone, ricotta, bocconcino,
            caciocavallo) con cadena de frío permanente, y por temporada incorporamos parmigiano reggiano DOP,
            pecorino romano DOP y gorgonzola DOP. Comprá online con envío refrigerado o retirá en Barrio Norte
            o San Telmo.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-extra-wide">
            <Link
              href="/productos?categoria=productos-frescos"
              className="border border-ink px-5 py-3 text-ink hover:bg-ink hover:text-ivory-50"
            >
              Ver categoría frescos
            </Link>
            <Link
              href="https://wa.me/5491151364554"
              className="border border-ink/40 px-5 py-3 text-ink/70 hover:border-ink hover:text-ink"
              target="_blank"
              rel="noopener"
            >
              Consultar disponibilidad
            </Link>
          </div>
        </div>
      </section>

      {cheeses.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="container-x">
            <div className="mb-6 flex items-baseline justify-between border-b border-ink/10 pb-4">
              <p className="text-[11px] uppercase tracking-extra-wide text-ink/50">
                {cheeses.length} queso{cheeses.length === 1 ? "" : "s"} disponible{cheeses.length === 1 ? "" : "s"}
              </p>
              <Link
                href="/productos?categoria=productos-frescos"
                className="text-[11px] uppercase tracking-extra-wide text-ink/50 hover:text-ink"
              >
                Ver toda la categoría →
              </Link>
            </div>
            <ProductGrid products={cheeses} priorityCount={5} />
          </div>
        </section>
      )}

      <section className="border-y border-ink/10 bg-ivory-100 py-16 lg:py-20">
        <div className="container-x">
          <div className="text-center">
            <span className="eyebrow">Mappa dei formaggi</span>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              Quesos italianos por región
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
              Cada región italiana tiene su firma quesera, definida por su clima, sus razas de ganado y sus
              tradiciones. Estas son las más relevantes en nuestro catálogo.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REGIONI.map((r) => (
              <article key={r.region} className="border border-ink/10 bg-ivory-50 p-6">
                <span className="eyebrow text-[10px]">{r.region}</span>
                <h3 className="mt-2 font-serif text-xl text-ink">{r.quesos}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{r.nota}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x mx-auto max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">Cómo elegir</span>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              Frescos, semicurados y duros: tres familias para entender el catálogo
            </h2>
          </div>
          <div className="mt-10 space-y-8 text-base leading-relaxed text-ink/75">
            <div>
              <h3 className="font-serif text-xl text-ink">Frescos (latticini)</h3>
              <p className="mt-2">
                Burrata, mozzarella, fior di latte, bocconcino, ricotta, mascarpone. Maduración cero o muy
                corta. Se consumen jóvenes, conservan agua y por eso son delicados de transportar. Perfectos
                para ensaladas (caprese), pasta fresca (ravioli ricotta-spinaci), antipasti y postres
                (tiramisú con mascarpone).
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink">Semicurados (pasta filata e a pasta semicotta)</h3>
              <p className="mt-2">
                Caciocavallo, scamorza, provolone, treccia ahumada. Pasta hilada estirada y madurada algunas
                semanas o meses; toma cuerpo y aroma sin perder cremosidad. Excelentes para tablas, gratinados
                de pasta al horno, sandwiches y pizza alta.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink">Duros (formaggi a pasta dura)</h3>
              <p className="mt-2">
                Parmigiano Reggiano DOP, Pecorino Romano DOP, Grana Padano DOP, Asiago. Maduración mínima de
                9 a 12 meses; pierden agua y concentran umami. Se rallan sobre pasta, se comen en lascas con
                aceto balsamico tradizionale o solos como aperitivo. El parmigiano de 36 meses es uno de los
                grandes placeres gastronómicos del mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-ivory-100 py-16 lg:py-20">
        <div className="container-x mx-auto max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              Sobre quesos italianos
            </h2>
          </div>
          <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {FAQS.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="font-serif text-xl text-ink">{f.q}</dt>
                <dd className="mt-3 text-base leading-relaxed text-ink/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-x mx-auto max-w-3xl text-center">
          <span className="eyebrow">Ver también</span>
          <h2 className="mt-3 font-serif text-2xl text-ink sm:text-3xl">
            Recetas y guías relacionadas
          </h2>
          <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <li>
              <Link
                href="/recetas/tiramisu"
                className="block border border-ink/15 px-4 py-4 text-ink/80 hover:border-ink hover:text-ink"
              >
                Tiramisú con mascarpone →
              </Link>
            </li>
            <li>
              <Link
                href="/productos?categoria=productos-frescos"
                className="block border border-ink/15 px-4 py-4 text-ink/80 hover:border-ink hover:text-ink"
              >
                Categoría productos frescos →
              </Link>
            </li>
            <li>
              <Link
                href="/vinos-italianos"
                className="block border border-ink/15 px-4 py-4 text-ink/80 hover:border-ink hover:text-ink"
              >
                Vinos italianos para acompañar →
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
