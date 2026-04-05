import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartProvider } from "@/hooks/useCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getCategories } from "@/lib/woocommerce";

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
  metadataBase: new URL("https://italmarket.com.ar"),
  title: {
    default: "Italmarket · Delizie Italiane en Buenos Aires",
    template: "%s · Italmarket",
  },
  description:
    "Productos italianos de alta calidad importados directamente desde Italia. Pastas, aceites, salumi, vinos y dolci. Sucursales en Barrio Norte y San Telmo.",
  openGraph: {
    title: "Italmarket · Delizie Italiane",
    description:
      "Un viaggio di sapori. Productos italianos auténticos en Buenos Aires.",
    url: "https://italmarket.com.ar",
    siteName: "Italmarket",
    locale: "es_AR",
    type: "website",
    images: ["/images/storefront.jpg"],
  },
  icons: { icon: "/brand/emblem.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Top 4 non-empty categories, driven from WooCommerce so the header never
  // points at slugs that don't exist.
  const categories = await getCategories();
  const featuredCategories = categories.slice(0, 4).map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
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
