import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartProvider } from "@/hooks/useCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategories } from "@/lib/woocommerce";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "food",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} · Delizie Italiane`,
    description:
      "Un viaggio di sapori. Tienda premium de productos italianos importados en Buenos Aires. Pastas, aceites, salumi, vinos, quesos y dolci. Envíos a todo el país y retiro en Barrio Norte o San Telmo.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/images/storefront.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Delizie Italiane`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description:
      "Tienda premium de productos italianos importados. Envíos a todo el país y sucursales en Barrio Norte y San Telmo.",
    images: ["/images/storefront.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/brand/emblem.png",
    apple: "/brand/emblem.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Top 4 non-empty categories, driven from WooCommerce so the header never
  // points at slugs that don't exist.
  const categories = await getCategories();
  const featuredCategories = categories.slice(0, 4).map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <CartProvider>
          <AnnouncementBar />
          <Header featuredCategories={featuredCategories} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
