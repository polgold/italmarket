import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ValueStrip } from "@/components/home/ValueStrip";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Quote } from "@/components/home/Quote";
import { StoreSpotlight } from "@/components/home/StoreSpotlight";
import { Sucursales } from "@/components/home/Sucursales";
import { Newsletter } from "@/components/home/Newsletter";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategories, getFeaturedProducts } from "@/lib/woocommerce";
import { FAQS, SITE_URL } from "@/lib/seo";
import { faqSchema } from "@/lib/structured-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Italmarket · Tienda de productos italianos importados en Buenos Aires",
  description:
    "Comprá productos italianos auténticos online: pastas, aceites de oliva, salumi, vinos, quesos, pomodoro, pesto y dolci importados directamente desde Italia. Envíos a todo el país y retiro en Barrio Norte o San Telmo.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts(8)]);
  const topLevel = categories.filter((c) => c.parent === 0 && (c.count ?? 0) > 0);

  return (
    <>
      <JsonLd
        data={[
          faqSchema(FAQS),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: "Italmarket · Tienda premium de productos italianos",
            isPartOf: { "@id": `${SITE_URL}#website` },
            about: { "@id": `${SITE_URL}#organization` },
            inLanguage: "es-AR",
          },
        ]}
      />
      <Hero />
      <ValueStrip />
      <CategoryShowcase categories={topLevel} />
      <FeaturedProducts products={featured} />
      <Quote />
      <StoreSpotlight />
      <Sucursales />
      <Newsletter />
    </>
  );
}
