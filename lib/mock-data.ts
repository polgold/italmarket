import type { Product, Category } from "./types";

/**
 * Placeholder catalog used until WooCommerce credentials are configured.
 */

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Pastas",
    slug: "pastas",
    description: "Pastas secas artesanales elaboradas al bronce, desde Gragnano hasta Puglia.",
    image: { src: "/images/still-life-pasta.jpg" },
    count: 24,
    parent: 0,
  },
  {
    id: 2,
    name: "Aceites & Vinagres",
    slug: "aceites-vinagres",
    description: "Aceites extra virgen de primera presión y vinagres balsámicos de Módena.",
    image: { src: "/images/olio-oliva.jpg" },
    count: 18,
    parent: 0,
  },
  {
    id: 3,
    name: "Salumi & Formaggi",
    slug: "salumi-formaggi",
    description: "Prosciutto di Parma, mortadella, pecorino, parmigiano y más.",
    image: { src: "/images/recipes/pappardelle-al-ragu.jpg" },
    count: 32,
    parent: 0,
  },
  {
    id: 4,
    name: "Conservas",
    slug: "conservas",
    description: "Tomate San Marzano, alcaparras de Pantelleria y antipasti italianos.",
    image: { src: "/images/recipes/salsa-pomodoro.jpg" },
    count: 21,
    parent: 0,
  },
  {
    id: 5,
    name: "Vinos & Espumantes",
    slug: "vinos",
    description: "Una bodega curada: Barolo, Chianti, Prosecco y vinos del sur.",
    image: { src: "/images/prosecco.jpg" },
    count: 40,
    parent: 0,
  },
  {
    id: 6,
    name: "Dolci & Caffè",
    slug: "dolci-caffe",
    description: "Panettone, cantuccini, café napolitano y los dolci más queridos.",
    image: { src: "/images/recipes/tiramisu.jpg" },
    count: 27,
    parent: 0,
  },
];

function p(
  id: number,
  name: string,
  slug: string,
  price: number,
  img: string,
  short: string,
  category: { id: number; name: string; slug: string },
  origin: string,
  onSale = false,
): Product {
  return {
    id,
    name,
    slug,
    price: String(price),
    regular_price: String(onSale ? Math.round(price * 1.2) : price),
    sale_price: onSale ? String(price) : undefined,
    on_sale: onSale,
    short_description: short,
    description: `<p>${short}</p><p>Seleccionado por Italmarket entre los mejores productores italianos, este producto llega directamente desde ${origin} para ofrecerte una experiencia auténtica de sabores italianos en tu mesa.</p>`,
    images: [{ src: img, alt: name }],
    categories: [category],
    stock_status: "instock",
    origin,
  };
}

const cat = mockCategories;

export const mockProducts: Product[] = [
  p(101, "Spaghetti di Gragnano IGP", "spaghetti-gragnano-igp", 4800, "/images/still-life-pasta.jpg", "Pasta trafilata al bronzo, 500g.", cat[0], "Gragnano, Campania"),
  p(102, "Rigatoni al Bronzo", "rigatoni-al-bronzo", 4500, "/images/still-life-pasta.jpg", "Rigatoni artesanales, textura rústica, 500g.", cat[0], "Puglia"),
  p(103, "Tagliatelle all'uovo", "tagliatelle-alluovo", 5200, "/images/still-life-pasta.jpg", "Tagliatelle al huevo, estilo emiliano, 250g.", cat[0], "Emilia-Romagna", true),
  p(104, "Olio Extra Vergine Toscano", "olio-extra-vergine-toscano", 18900, "/images/olio-oliva.jpg", "Aceite extra virgen de oliva, primera presión en frío, 500ml.", cat[1], "Toscana"),
  p(105, "Aceto Balsamico di Modena DOP", "aceto-balsamico-modena-dop", 22500, "/images/olio-oliva.jpg", "Vinagre balsámico añejado 12 años, 250ml.", cat[1], "Módena"),
  p(106, "Olio Ligure Taggiasca", "olio-ligure-taggiasca", 16800, "/images/olio-oliva.jpg", "Aceite de oliva monovarietal Taggiasca, 500ml.", cat[1], "Liguria"),
  p(107, "Prosciutto di Parma 18 meses", "prosciutto-di-parma-18-meses", 14200, "/images/recipes/pappardelle-al-ragu.jpg", "Prosciutto di Parma DOP, loncheado, 100g.", cat[2], "Parma"),
  p(108, "Parmigiano Reggiano 24 meses", "parmigiano-reggiano-24-meses", 9800, "/images/recipes/pappardelle-al-ragu.jpg", "Parmigiano Reggiano DOP añejado 24 meses, cuña 250g.", cat[2], "Emilia-Romagna"),
  p(109, "Mortadella di Bologna", "mortadella-di-bologna", 7600, "/images/recipes/pappardelle-al-ragu.jpg", "Mortadella clásica con pistachos, 200g.", cat[2], "Bologna", true),
  p(110, "Pomodoro San Marzano DOP", "pomodoro-san-marzano-dop", 3900, "/images/recipes/salsa-pomodoro.jpg", "Tomate San Marzano pelado DOP, 400g.", cat[3], "Campania"),
  p(111, "Pesto Genovese", "pesto-genovese", 5400, "/images/recipes/salsa-pomodoro.jpg", "Pesto Genovese DOP con albahaca fresca, 180g.", cat[3], "Liguria"),
  p(112, "Alcaparras de Pantelleria", "alcaparras-pantelleria", 6200, "/images/recipes/salsa-pomodoro.jpg", "Alcaparras en sal marina, 100g.", cat[3], "Sicilia"),
  p(113, "Chianti Classico DOCG", "chianti-classico-docg", 32500, "/images/prosecco.jpg", "Vino tinto Sangiovese, 750ml.", cat[4], "Toscana"),
  p(114, "Prosecco di Valdobbiadene", "prosecco-valdobbiadene", 28900, "/images/prosecco.jpg", "Espumante seco Glera, 750ml.", cat[4], "Veneto"),
  p(115, "Barolo DOCG", "barolo-docg", 68000, "/images/prosecco.jpg", "Nebbiolo de las colinas de Langhe, 750ml.", cat[4], "Piemonte"),
  p(116, "Panettone Milanese Artesanal", "panettone-milanese", 15900, "/images/recipes/tiramisu.jpg", "Panettone de masa madre con pasas y cítricos, 750g.", cat[5], "Milán"),
  p(117, "Cantuccini alle Mandorle", "cantuccini-mandorle", 6800, "/images/recipes/tiramisu.jpg", "Bizcochos toscanos con almendras, 200g.", cat[5], "Toscana"),
  p(118, "Caffè Napoletano en grano", "caffe-napoletano", 8400, "/images/recipes/tiramisu.jpg", "Café en grano de tueste napolitano, 250g.", cat[5], "Nápoles", true),
];
