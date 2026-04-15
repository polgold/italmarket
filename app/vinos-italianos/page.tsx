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
  title: "Vinos italianos en Buenos Aires · Prosecco DOCG, Grappa, Vermouth",
  description:
    "Vinos y bebidas italianas importadas en Buenos Aires: Prosecco DOCG Colvendra y Valdambra, grappa Toscana Morelli, sambuca, fernet italiano y Birra Menabrea. Envíos a todo el país.",
  alternates: { canonical: "/vinos-italianos" },
  openGraph: {
    title: "Vinos italianos · Italmarket",
    description:
      "Prosecco DOCG Colvendra y Valdambra, grappa, sambuca, limoncello y vermouth italiano seleccionados por Italmarket.",
    url: `${SITE_URL}/vinos-italianos`,
    type: "website",
  },
};

const FAQS = [
  {
    q: "¿Qué vinos italianos tienen disponibles hoy?",
    a: "En nuestro catálogo online trabajamos permanentemente Prosecco DOCG Superiore y DOC (Colvendra, Valdambra), que es el espumante italiano por excelencia. Por temporada y según importación sumamos tintos clásicos: Chianti Classico DOCG de Toscana, Barolo y Barbera del Piemonte, Valpolicella del Véneto, Primitivo di Manduria y Nero d'Avola del sur. Para confirmar existencia y pedido bajo encargo, escribinos por WhatsApp.",
  },
  {
    q: "¿Qué diferencia hay entre Prosecco DOC y Prosecco DOCG?",
    a: "Ambos se hacen con uva Glera, pero cambian zona y reglas. DOCG (Denominazione di Origine Controllata e Garantita) es el escalón más alto: solo se produce en las colinas históricas de Conegliano-Valdobbiadene (Véneto), con rendimientos más bajos por hectárea y cata de aprobación obligatoria. El DOC cubre un área más amplia del noreste italiano. En cata: el DOCG tiene más complejidad floral y mineralidad; el DOC es más frutal y directo. Los dos son excelentes aperitivos y acompañamiento de antipasti.",
  },
  {
    q: "¿Qué diferencia a la grappa italiana de un aguardiente común?",
    a: "La grappa se destila exclusivamente a partir de vinaccia (hollejos y pepitas fermentados) de uva italiana, y la ley exige que se produzca en territorio italiano. Hay grappa bianca (sin madera), invecchiata (12 m en barrica) y riserva (18 m+). La grappa Toscana Morelli que trabajamos es destilada en alambique discontinuo desde vinaccia de Sangiovese y otras cepas toscanas.",
  },
  {
    q: "¿Cómo combino vinos italianos con la cena?",
    a: "Algunas guías rápidas: pasta al pomodoro o pizza margherita → Chianti Classico joven o Sangiovese. Carbonara o amatriciana → Montepulciano d'Abruzzo o Barbera. Risotto al funghi o tartufo → Barolo (añejo) o Pinot Nero de Alto Adige. Pesto genovese → Vermentino de Liguria o Verdicchio. Pescado al forno → Greco di Tufo o Fiano di Avellino. Postres (tiramisú, panettone) → Vin Santo Toscano o Moscato d'Asti. Aperitivo → Prosecco DOCG o vermouth con naranja.",
  },
  {
    q: "¿Qué es el aperitivo italiano y cómo se prepara en casa?",
    a: "Es la tradición del sur-norte italiano de abrir el apetito antes de cenar, entre las 18 y las 21. Típicamente: Aperol Spritz (3 partes Prosecco, 2 Aperol, 1 soda, rodaja de naranja), Negroni (1 gin, 1 Campari, 1 vermouth rosso), Americano (Campari + vermouth + soda). Acompañado de aceitunas taggiasche, grissini, papas rústicas, tarallini o tramezzini. Italmarket importa vermouth, grappa, sambuca y todo lo que necesita la mesa del aperitivo.",
  },
  {
    q: "¿Hacen envíos de vinos y bebidas a todo el país?",
    a: "Sí. Todo nuestro catálogo de bebidas se despacha con embalaje térmico en verano y doble protección para botellas. AMBA 24–48 h; al interior coordinamos 3–5 días hábiles. Para volumen corporativo o regalo empresarial, escribinos por WhatsApp con cantidad y destino y armamos cotización dedicada.",
  },
];

const REGIONI = [
  {
    region: "Véneto",
    vinos: "Prosecco DOCG, Prosecco DOC, Valpolicella, Amarone, Soave",
    nota: "Las colinas de Conegliano-Valdobbiadene hacen el Prosecco DOCG, el espumante italiano más famoso del mundo.",
  },
  {
    region: "Piemonte",
    vinos: "Barolo DOCG, Barbaresco DOCG, Barbera, Dolcetto, Moscato d'Asti",
    nota: "Tierra del Nebbiolo: el Barolo es el 'rey de los vinos' italiano. Ideal para carnes largas y quesos duros.",
  },
  {
    region: "Toscana",
    vinos: "Chianti Classico DOCG, Brunello di Montalcino DOCG, Super Tuscans, Vernaccia",
    nota: "Sangiovese en todas sus expresiones. Desde los tintos diarios hasta los gran vinos de guarda.",
  },
  {
    region: "Sur · Puglia · Sicilia · Campania",
    vinos: "Primitivo di Manduria, Nero d'Avola, Aglianico, Greco di Tufo, Fiano, Falanghina",
    nota: "Vinos intensos, soleados, con frutos maduros. Excelente relación precio-calidad.",
  },
  {
    region: "Emilia-Romagna",
    vinos: "Lambrusco, Sangiovese di Romagna, Albana",
    nota: "Lambrusco frizzante para acompañar salumi, pasta al ragú y tablas grasas.",
  },
  {
    region: "Friuli · Trentino · Alto Adige",
    vinos: "Pinot Grigio, Gewürztraminer, Pinot Nero, Ribolla Gialla",
    nota: "Vinos blancos minerales y tintos frescos de montaña. Perfectos con pescados, risottos y speck.",
  },
];

const NAME_MATCH = /\b(vino|prosecco|chianti|barolo|barbaresco|barbera|lambrusco|valpolicella|amarone|brunello|montepulciano|primitivo|nero\s+d['’]?avola|sangiovese|vermentino|soave|pinot|nebbiolo|fiano|greco|falanghina|vermouth|grappa|sambuca|limoncello|fernet|amaretto|aperol|campari|birra|menabrea|moretti|peroni|morelli)\b/i;

function matchWines(products: Product[]): Product[] {
  return products.filter((p) => NAME_MATCH.test(p.name));
}

export default async function VinosItalianosPage() {
  const all = await getProducts();
  const wines = matchWines(all);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Inicio", url: `${SITE_URL}/` },
            { name: "Vinos italianos", url: `${SITE_URL}/vinos-italianos` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Vinos italianos en Italmarket",
            url: `${SITE_URL}/vinos-italianos`,
            description:
              "Selección de vinos, espumantes y destilados italianos en Italmarket: Prosecco DOCG, grappa, sambuca, vermouth, Chianti Classico, Barolo y más.",
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
            <span className="text-ink/80">Vinos italianos</span>
          </nav>
          <span className="eyebrow">Vini e bevande italiane</span>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">
            Vinos italianos en Buenos Aires
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-ink/70">
            Italia produce vino en cada una de sus 20 regiones y tiene 332 DOC/DOCG reconocidas: más que
            ningún otro país del mundo. En Italmarket trabajamos Prosecco DOCG Colvendra y Valdambra de
            Conegliano-Valdobbiadene, grappa Toscana Morelli, sambuca, fernet italiano, Birra Menabrea y una
            selección rotativa de tintos clásicos (Chianti, Barolo, Primitivo). Envíos a todo el país con
            embalaje térmico.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-extra-wide">
            <Link
              href="/productos?categoria=bebidas"
              className="border border-ink px-5 py-3 text-ink hover:bg-ink hover:text-ivory-50"
            >
              Ver categoría bebidas
            </Link>
            <Link
              href="https://wa.me/541144469610"
              className="border border-ink/40 px-5 py-3 text-ink/70 hover:border-ink hover:text-ink"
              target="_blank"
              rel="noopener"
            >
              Consultar por vinos bajo pedido
            </Link>
          </div>
        </div>
      </section>

      {wines.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="container-x">
            <div className="mb-6 flex items-baseline justify-between border-b border-ink/10 pb-4">
              <p className="text-[11px] uppercase tracking-extra-wide text-ink/50">
                {wines.length} vino{wines.length === 1 ? "" : "s"} y destilado{wines.length === 1 ? "" : "s"} disponible{wines.length === 1 ? "" : "s"}
              </p>
              <Link
                href="/productos?categoria=bebidas"
                className="text-[11px] uppercase tracking-extra-wide text-ink/50 hover:text-ink"
              >
                Ver toda la categoría →
              </Link>
            </div>
            <ProductGrid products={wines} priorityCount={5} />
          </div>
        </section>
      )}

      <section className="border-y border-ink/10 bg-ivory-100 py-16 lg:py-20">
        <div className="container-x">
          <div className="text-center">
            <span className="eyebrow">Mappa del vino</span>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              Vinos italianos por región
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
              Cada región italiana tiene cepas, clima y tradición propia. Esta es la mirada rápida a las seis
              zonas que concentran la mayor parte de los vinos que llegan a Argentina.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REGIONI.map((r) => (
              <article key={r.region} className="border border-ink/10 bg-ivory-50 p-6">
                <span className="eyebrow text-[10px]">{r.region}</span>
                <h3 className="mt-2 font-serif text-xl text-ink">{r.vinos}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{r.nota}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x mx-auto max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">Cómo leer una etiqueta</span>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              DOC, DOCG, IGT: qué significan las denominaciones
            </h2>
          </div>
          <div className="mt-10 space-y-8 text-base leading-relaxed text-ink/75">
            <div>
              <h3 className="font-serif text-xl text-ink">DOCG · Denominazione di Origine Controllata e Garantita</h3>
              <p className="mt-2">
                La categoría más alta del sistema italiano (desde 1963). Implica zona geográfica estricta,
                cepas autorizadas, rendimientos máximos, crianza mínima y cata de aprobación por un panel
                oficial. El sello de garantía va en el cuello de la botella, numerado. Son DOCG, entre otros:
                Barolo, Barbaresco, Brunello di Montalcino, Chianti Classico, Prosecco di Conegliano-Valdobbiadene,
                Vermentino di Gallura.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink">DOC · Denominazione di Origine Controllata</h3>
              <p className="mt-2">
                Categoría histórica y más amplia: define zona, cepas y método pero con controles menos
                exigentes que la DOCG. Cubre la mayoría de los vinos regionales reconocidos: Chianti,
                Valpolicella, Soave, Dolcetto, Nero d'Avola, entre cientos más.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink">IGT · Indicazione Geografica Tipica</h3>
              <p className="mt-2">
                Creada en 1992 para dar marco a vinos de gran calidad que quedaban fuera de las DOC tradicionales
                (muchos Super Tuscan como Sassicaia o Tignanello nacieron como IGT). Define solo origen
                geográfico — da libertad de cepas y métodos. Es una categoría heterogénea: hay IGT mediocres y
                otros excelentes. Leer al productor.
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
              Sobre vinos italianos
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
            Recetas, marcas y productos relacionados
          </h2>
          <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <li>
              <Link
                href="/quesos-italianos"
                className="block border border-ink/15 px-4 py-4 text-ink/80 hover:border-ink hover:text-ink"
              >
                Quesos italianos para maridar →
              </Link>
            </li>
            <li>
              <Link
                href="/marca/menabrea"
                className="block border border-ink/15 px-4 py-4 text-ink/80 hover:border-ink hover:text-ink"
              >
                Birra Menabrea desde 1846 →
              </Link>
            </li>
            <li>
              <Link
                href="/productos?categoria=bebidas"
                className="block border border-ink/15 px-4 py-4 text-ink/80 hover:border-ink hover:text-ink"
              >
                Toda la categoría bebidas →
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
