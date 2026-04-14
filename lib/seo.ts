/**
 * Canonical site metadata used by SEO surfaces: <head> tags, JSON-LD blocks,
 * the sitemap and robots routes. Centralized here so a change (new sucursal,
 * new social link, new slogan) propagates everywhere.
 */

export const SITE_URL = "https://italmarket.com.ar";

export const SITE_NAME = "Italmarket";

export const SITE_DESCRIPTION =
  "Tienda premium de productos italianos importados en Buenos Aires. Pastas, aceites de oliva, salumi, vinos, quesos, conservas, pomodoro, pesto y dolci auténticos. Comprá online con envíos a todo el país o retirá en nuestras sucursales de Barrio Norte y San Telmo.";

export const SITE_TAGLINE = "Delizie Italiane en Buenos Aires";

export const SITE_KEYWORDS = [
  "productos italianos",
  "tienda italiana",
  "delicatessen italiana",
  "comida italiana importada",
  "pastas italianas",
  "aceite de oliva italiano",
  "salumi",
  "prosciutto",
  "parmigiano reggiano",
  "vinos italianos",
  "quesos italianos",
  "pomodoro San Marzano",
  "pesto genovese",
  "salsa pomodoro",
  "tiramisú",
  "dolci italianos",
  "comprar productos italianos online",
  "importados italianos Argentina",
  "tienda italiana Buenos Aires",
  "Italmarket",
  "Barrio Norte",
  "San Telmo",
  "envíos a todo el país",
  "retiro en sucursal",
];

export const ORG_CONTACT = {
  email: "info@italmarket.com.ar",
  phoneBarrioNorte: "+54 9 11 5136-4554",
  phoneSanTelmo: "+54 9 11 6783-6252",
  whatsappBarrioNorte: "https://wa.me/5491151364554",
  whatsappSanTelmo: "https://wa.me/5491167836252",
  instagram: "https://instagram.com/italmarket.ar",
};

export interface StoreLocation {
  id: string;
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  telephone: string;
  image: string;
  url: string;
  mapUrl: string;
  hours: { days: string[]; opens: string; closes: string }[];
  geo?: { latitude: number; longitude: number };
}

export const STORES: StoreLocation[] = [
  {
    id: "barrio-norte",
    name: "Italmarket Barrio Norte",
    streetAddress: "Av. Santa Fe 2727",
    addressLocality: "Buenos Aires",
    addressRegion: "CABA",
    postalCode: "C1425",
    telephone: "+54 9 11 5136-4554",
    image: `${SITE_URL}/images/storefront.jpg`,
    url: `${SITE_URL}/sucursales#barrio-norte`,
    mapUrl: "https://maps.google.com/?q=Av.+Santa+Fe+2727+CABA",
    hours: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "21:00" },
      { days: ["Saturday"], opens: "10:00", closes: "20:00" },
    ],
  },
  {
    id: "san-telmo",
    name: "Italmarket San Telmo",
    streetAddress: "Defensa 863",
    addressLocality: "Buenos Aires",
    addressRegion: "CABA",
    postalCode: "C1065",
    telephone: "+54 9 11 6783-6252",
    image: `${SITE_URL}/images/lifestyle-3.jpg`,
    url: `${SITE_URL}/sucursales#san-telmo`,
    mapUrl: "https://maps.google.com/?q=Defensa+863+CABA",
    hours: [
      { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "11:00", closes: "20:00" },
      { days: ["Sunday"], opens: "11:00", closes: "18:00" },
    ],
  },
];

export const FAQS = [
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí. Despachamos a todo Argentina. AMBA 24–48 h y envíos nacionales en 3 a 5 días hábiles.",
  },
  {
    q: "¿Puedo retirar mi pedido en la tienda?",
    a: "Sí. Podés retirar sin costo en nuestras sucursales de Barrio Norte (Av. Santa Fe 2727) o San Telmo (Defensa 863).",
  },
  {
    q: "¿Los productos son importados directamente desde Italia?",
    a: "Sí. Seleccionamos productores artesanales italianos —muchos con certificaciones DOP, IGP y DOCG— y traemos los productos directo de origen para garantizar autenticidad.",
  },
  {
    q: "¿Dónde están ubicadas las sucursales de Italmarket?",
    a: "Tenemos dos tiendas físicas en Buenos Aires: Barrio Norte (Av. Santa Fe 2727) y San Telmo (Defensa 863).",
  },
  {
    q: "¿Qué tipo de productos italianos venden?",
    a: "Pastas secas y frescas, aceites de oliva extra virgen, salumi (prosciutto, salame, mortadella), quesos (parmigiano reggiano, pecorino), vinos, conservas (pomodoro, anchoas, aceitunas), salsas (pesto, pomodoro), cafés y dolci (panettone, tiramisú, biscotti).",
  },
  {
    q: "¿Cuáles son los métodos de pago aceptados?",
    a: "Aceptamos tarjetas de crédito y débito, Mercado Pago, transferencia bancaria y efectivo en tienda.",
  },
];
