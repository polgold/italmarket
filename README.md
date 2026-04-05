# Italmarket — Next.js Storefront

Premium headless storefront para **italmarket.com.ar** — Delizie Italiane · Buenos Aires.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** con paleta editorial de marca
- Fuentes: `Cormorant Garamond` (serif) + `Inter` (sans)
- WooCommerce REST API (headless) con fallback a mock data
- Carrito client-side persistido en localStorage (React Context)

## Estructura

```
app/                  Routes (App Router)
  page.tsx            Homepage (hero video, categorías, featured, sucursales)
  productos/          Listado + detalle (ISR 5 min)
  nosotros/           Historia + método
  sucursales/         Barrio Norte & San Telmo
  contacto/           Form de contacto
  carrito/            Cart page
components/
  layout/             Header, Footer, AnnouncementBar
  home/               Hero, ValueStrip, CategoryShowcase, FeaturedProducts, Quote, StoreSpotlight, Sucursales, Newsletter
  product/            ProductCard, ProductGrid, AddToCartButton
  cart/               CartDrawer
  ui/                 Logo, Icons
hooks/                useCart (Context + localStorage)
lib/                  woocommerce.ts, mock-data.ts, types.ts, utils.ts
public/
  brand/              Logos extraídos del manual de marca
  images/             Lifestyle + storefront
  video/              hero.mp4
```

## Setup

```bash
npm install
cp .env.local.example .env.local   # configurar WC_* keys
npm run dev
```

Sin credenciales el sitio funciona con catálogo mock (18 productos, 6 categorías).

## Con WooCommerce real

1. En WP admin → WooCommerce → Settings → Advanced → REST API → generar credenciales read-only.
2. Completar `.env.local` con `WC_API_URL`, `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET`.
3. El cliente `lib/woocommerce.ts` detecta las credenciales y consume la API real automáticamente.

## Deploy (Hostinger Node.js)

```bash
npm run build
npm start
```

Apuntar NIC.ar → Hostinger, activar SSL. WooCommerce corre como backend PHP en el mismo hosting.

## Diseño

- Paleta: ivory / ink / bosco (verde italiano) / rosso / oro
- Estilo editorial premium, tipografía serif generosa
- Mobile-first, animaciones sobrias, imágenes grandes
- Target Lighthouse 90+
