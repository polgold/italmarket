import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getGuide, guides } from "@/lib/recipes";
import { findRelatedProducts } from "@/lib/recipes/match";
import { getProducts } from "@/lib/woocommerce";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guía no encontrada", robots: { index: false } };
  const canonical = `/guias/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `${SITE_URL}${canonical}`,
      type: "article",
      images: [{ url: guide.image, alt: guide.imageAlt }],
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [guide.image],
    },
  };
}

export default async function GuiaPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const products = guide.relatedProductKeywords
    ? findRelatedProducts(guide.relatedProductKeywords, await getProducts(), 4)
    : [];

  const breadcrumbs = [
    { name: "Inicio", url: `${SITE_URL}/` },
    { name: "Guías", url: `${SITE_URL}/guias` },
    { name: guide.title, url: `${SITE_URL}/guias/${guide.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            image: [
              guide.image.startsWith("http") ? guide.image : `${SITE_URL}${guide.image}`,
            ],
            author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            publisher: { "@id": `${SITE_URL}#organization` },
            datePublished: guide.publishedAt,
            dateModified: guide.updatedAt ?? guide.publishedAt,
            mainEntityOfPage: `${SITE_URL}/guias/${guide.slug}`,
            inLanguage: "es-AR",
            keywords: guide.keywords.join(", "),
          },
        ]}
      />

      <section className="border-b border-ink/10 bg-ivory-100">
        <div className="container-x py-16 text-center lg:py-24">
          <nav className="mb-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-extra-wide text-ink/50">
            <Link href="/guias" className="hover:text-ink">Guías</Link>
            <span>/</span>
            <span>{guide.readTimeMin} min</span>
          </nav>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            {guide.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
            {guide.summary}
          </p>
        </div>
      </section>

      <section className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-ink">
        <Image
          src={guide.image}
          alt={guide.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </section>

      <section className="container-x py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          {guide.sections.map((s, idx) => (
            <div key={idx} className="mt-12 first:mt-0">
              <h2 className="font-serif text-3xl text-ink sm:text-4xl">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="mt-4 text-base leading-relaxed text-ink/75"
                  dangerouslySetInnerHTML={{ __html: renderInline(p) }}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="border-t border-ink/10 bg-ivory-100 py-16 lg:py-20">
          <div className="container-x">
            <div className="text-center">
              <span className="eyebrow">Del catálogo</span>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                Productos relacionados
              </h2>
            </div>
            <div className="mt-10">
              <ProductGrid products={products} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/**
 * Renders **bold** markers inside guide paragraphs without pulling in a full
 * markdown dependency. Escapes HTML first so raw tags from the content can't
 * break the page.
 */
function renderInline(input: string): string {
  const escaped = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
