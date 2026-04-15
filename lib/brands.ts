import type { Product } from "./types";

/**
 * Marcas con presencia real en el catálogo de Italmarket. Cada una se detecta
 * por un matcher sobre el nombre del producto (la Store API de WooCommerce no
 * expone un atributo "brand" en este tenant, así que trabajamos por nombre).
 *
 * La página /marca/[slug] renderiza historia editorial + grilla de productos
 * matched + Brand schema. Si una marca empieza a tener menos de 2 productos
 * en stock, la página devuelve notFound() para no ofrecer contenido vacío.
 */
export interface BrandSEO {
  slug: string;
  name: string;
  eyebrow: string;
  region: string;
  country: string;
  foundedYear?: number;
  website?: string;
  logo?: string;
  intro: string;
  history: string;
  highlights: string[];
  metaTitle: string;
  metaDescription: string;
  /** Regex que se evalúa contra `product.name` para asociar productos. */
  matcher: RegExp;
}

export const BRANDS: BrandSEO[] = [
  {
    slug: "divella",
    name: "Divella",
    eyebrow: "Dal 1890 · Rutigliano, Puglia",
    region: "Puglia",
    country: "Italia",
    foundedYear: 1890,
    website: "https://www.divella.it",
    intro:
      "Divella es una de las casas de pasta, sémola y despensa más antiguas del sur de Italia. Fundada en 1890 en Rutigliano, a pocos kilómetros de Bari, la empresa sigue en manos de la familia Divella tras cinco generaciones.",
    history:
      "Francesco Divella abrió en 1890 un molino artesanal de trigo duro en Rutigliano, corazón del área triguera del Tavoliere delle Puglie. De molino pasó a pastificio en 1950 y hoy Divella es una de las cinco marcas de pasta más vendidas de Italia. La empresa controla toda la cadena: recibe el trigo duro directamente de productores de Puglia y Basilicata, lo muele en sus propias instalaciones y lo convierte en sémola rimacinata para pasta, harinas, conservas de tomate y arroces. Mantiene el método tradicional de trafilatura al bronzo y secado lento para la línea premium, y ofrece una gama amplia que incluye pasta larga, pasta corta, pasta rellena, risotti, arroces carnaroli y arborio, harinas 00 para pizza napolitana y pomodori pelati. En Italmarket trabajamos la gama más amplia del mercado argentino: 40+ referencias Divella disponibles permanentemente.",
    highlights: [
      "Pasta de trigo duro 100% Puglia",
      "Trafilatura al bronzo en la línea premium",
      "Harinas 00 para pizza napolitana",
      "Pomodori Pelati y passata en formato familiar",
      "Arroces Carnaroli y Arborio para risotto",
    ],
    metaTitle: "Divella · Pasta, arroz y harinas italianas de Puglia",
    metaDescription:
      "Divella desde 1890 en Rutigliano, Puglia: pasta de trigo duro, arroces Carnaroli y Arborio, harinas 00 para pizza y pomodori pelati. 40+ referencias disponibles en Italmarket Buenos Aires.",
    matcher: /\bdivella\b/i,
  },

  {
    slug: "giuliano-tartufi",
    name: "Giuliano Tartufi",
    eyebrow: "Norcia · Umbria",
    region: "Umbria",
    country: "Italia",
    website: "https://www.giulianotartufi.it",
    intro:
      "Giuliano Tartufi cultiva, cosecha y transforma trufas en el corazón de Umbria, la región que junto al Piamonte concentra la mejor trufa italiana. Su planta está en Norcia, capital histórica de la tartuficultura italiana.",
    history:
      "La familia Giuliano trabaja la trufa desde hace tres generaciones en las colinas de Umbria. La casa se especializa en trufa negra (Tuber melanosporum) y scorzone (Tuber aestivum), con cosecha manual ayudada por perros trufferos entrenados durante años. Al transformar, respetan la norma italiana que exige aroma natural de trufa real y no compuestos sintéticos: las salsas llevan laminado de trufa fresca, las pastas al tartufo usan extracto acuoso de trufa y los aceites trufados incorporan shavings reales macerados en aceite de oliva extra virgen italiano. La línea que importamos incluye trufas enteras, salsas al tartufo nero y al tartufo bianco, cremas para bruschetta y tagliolini al tartufo. Es producto de nicho pero con diferencia sensorial notable respecto a los 'aromáticos' genéricos del mercado.",
    highlights: [
      "Trufa italiana auténtica de Umbria",
      "Aroma natural, sin 2,4-ditiapentano sintético",
      "Salsas al tartufo negro y blanco",
      "Trufas enteras al vacío",
    ],
    metaTitle: "Giuliano Tartufi · Trufa italiana auténtica de Umbria",
    metaDescription:
      "Giuliano Tartufi desde Norcia, Umbria: trufa negra y blanca, salsas tartufate, cremas al tartufo y aceites trufados con trufa real. Importado directo por Italmarket.",
    matcher: /\bgiuliano tartufi\b/i,
  },

  {
    slug: "daleo",
    name: "Daleo",
    eyebrow: "Pizza napoletana congelada",
    region: "Buenos Aires",
    country: "Argentina",
    intro:
      "Daleo es una de las pizzas napoletanas congeladas que mejor reproduce el método tradicional de Nápoles en formato retail. Masa de fermentación larga, ingredientes auténticos y opciones sin gluten — lista para un horno casero o eléctrico.",
    history:
      "La línea Daleo combina técnica de pizza napoletana con la conveniencia del congelado: masa madre de fermentación de 24 horas, horneada en horno rotativo para sellar la corteza y luego congelada con los toppings ya dispuestos. Al reproducir la pizza en horno casero (idealmente con piedra o acero precalentado), la masa recupera la textura soufflé del cornicione napoletano en 5–7 minutos. La línea incluye Margherita (pomodoro, mozzarella fior di latte, albahaca), Diavola con salame piccante, Prosciutto, 4 Quesos y Fugazza argentina con cebolla. Hay versiones sin gluten que son de las mejores del mercado argentino. Es nuestra opción recomendada para una noche de pizza auténtica sin amasar.",
    highlights: [
      "Masa de fermentación larga estilo napoletano",
      "Listas en 5–7 minutos en horno casero",
      "Variedades sin gluten (Margherita, Mozzarella, Fugazza)",
      "Congeladas — cadena de frío desde fábrica",
    ],
    metaTitle: "Daleo · Pizza napoletana congelada con y sin gluten",
    metaDescription:
      "Pizzas Daleo: masa napoletana de fermentación larga, congeladas, listas en 5–7 minutos. Margherita, Diavola, Prosciutto, 4 Quesos, Fugazza. Opciones sin gluten. En Italmarket Buenos Aires.",
    matcher: /\bdaleo\b/i,
  },

  {
    slug: "perugina",
    name: "Perugina",
    eyebrow: "Dal 1907 · Perugia",
    region: "Umbria",
    country: "Italia",
    foundedYear: 1907,
    website: "https://www.perugina.com",
    intro:
      "Perugina es la chocolatería clásica italiana nacida en Perugia en 1907. Creadora del Bacio Perugina —el bombón envuelto en plata y azul con el papelito del mensaje—, es sinónimo de chocolate italiano premium.",
    history:
      "Fundada en 1907 por cuatro socios en Perugia, Umbria, Perugina revolucionó el mercado italiano del chocolate en 1922 con el lanzamiento del Bacio Perugina, ideado por Luisa Spagnoli con un relleno de gianduia y una avellana entera en el corazón, envuelto en la icónica hoja plateada con estrellas azules. Cada Bacio lleva un papelito con un mensaje romántico en varios idiomas, una idea de los años 20 que sigue vigente. Hoy la casa pertenece a Nestlé pero mantiene la producción en Perugia y la misma fórmula centenaria. En Italmarket trabajamos la línea Grifo (tabletas assortite, cioccomania, fondente), Baci originales en cajas, Baci mini y piezas para gifting en formato navideño y pascual.",
    highlights: [
      "Creadores del Bacio Perugina (1922)",
      "Gianduia con avellana entera",
      "Tabletas Grifo fondente 70% y assortiti",
      "Formato gift y temporada navideña / pascua",
    ],
    metaTitle: "Perugina · Chocolates Baci y Grifo desde Italia",
    metaDescription:
      "Perugina desde 1907 en Perugia: Baci Perugina originales, tabletas Grifo (fondente, assortiti, cioccomania) y cajas para gifting. Chocolate italiano importado por Italmarket.",
    matcher: /\b(perugina|bijuo)\b/i,
  },

  {
    slug: "menabrea",
    name: "Menabrea",
    eyebrow: "Dal 1846 · Biella, Piemonte",
    region: "Piemonte",
    country: "Italia",
    foundedYear: 1846,
    website: "https://www.birramenabrea.com",
    intro:
      "Birra Menabrea es la cervecería italiana más antigua aún en actividad, fundada en 1846 en Biella, al pie de los Alpes piamonteses. Su producción se mantiene con la misma receta de malta, lúpulo y levadura desde hace más de 170 años.",
    history:
      "Giuseppe Menabrea fundó la fábrica en 1846 aprovechando el agua pura de los glaciares piamonteses y la cebada local. El estilo es lager del norte de Italia: limpia, delicada, con amargor medido. La Birra Bionda (rubia) tiene maltas claras, aroma a pan fresco y un final seco ideal para aperitivo; la Ambrata suma maltas Vienna, aporta notas de caramelo y combina con salumi y pizzas blancas. Menabrea conserva la maltería propia y el agua de manantial de Biella, algo raro incluso en Europa: muchas cervecerías históricas dependen hoy de aguas tratadas. Es la cerveza oficial de muchas trattorie clásicas del norte.",
    highlights: [
      "Cervecería italiana más antigua en actividad",
      "Agua de manantial de los Alpes de Biella",
      "Bionda (rubia lager) y Ambrata (ámbar)",
      "Premiada múltiples veces en World Beer Championships",
    ],
    metaTitle: "Menabrea · Cerveza italiana de Biella desde 1846",
    metaDescription:
      "Birra Menabrea desde 1846 en Biella, Piemonte: la cervecería italiana más antigua en actividad. Bionda y Ambrata importadas. Cerveza italiana en Italmarket Buenos Aires.",
    matcher: /\bmenabrea\b/i,
  },

];

/**
 * Returns the full Brand entry for a slug, or undefined if not found.
 */
export function getBrand(slug: string): BrandSEO | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

/**
 * Filters a product list to the ones that match this brand's name regex.
 * Used by /marca/[slug] to render the product grid.
 */
export function matchBrandProducts(brand: BrandSEO, products: Product[]): Product[] {
  return products.filter((p) => brand.matcher.test(p.name));
}
