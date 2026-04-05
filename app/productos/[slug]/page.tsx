import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/woocommerce";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { formatPrice } from "@/lib/utils";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts())
    .filter((p) => p.id !== product.id && p.categories[0]?.id === product.categories[0]?.id)
    .slice(0, 4);

  const image = product.images[0]?.src || "/images/storefront.jpg";

  return (
    <>
      <div className="container-x pt-8">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-extra-wide text-ink/50">
          <Link href="/" className="hover:text-ink">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-ink">Productos</Link>
          {product.categories[0] && (
            <>
              <span>/</span>
              <Link href={`/productos?categoria=${product.categories[0].slug}`} className="hover:text-ink">
                {product.categories[0].name}
              </Link>
            </>
          )}
        </nav>
      </div>

      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100">
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            {product.categories[0] && (
              <span className="eyebrow">{product.categories[0].name}</span>
            )}
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl lg:text-[56px]">
              {product.name}
            </h1>
            {product.origin && (
              <p className="mt-3 text-[11px] uppercase tracking-extra-wide text-ink/50">
                Origen · {product.origin}
              </p>
            )}

            <div className="mt-6 flex items-baseline gap-4">
              {product.on_sale && product.regular_price && (
                <span className="text-lg text-ink/40 line-through">{formatPrice(product.regular_price)}</span>
              )}
              <span className="font-serif text-3xl text-ink">{formatPrice(product.price)}</span>
            </div>

            <div
              className="prose prose-sm mt-8 max-w-none text-ink/70"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-ink/10 pt-8 text-sm">
              <div>
                <dt className="eyebrow">Disponibilidad</dt>
                <dd className="mt-1 text-ink">
                  {product.stock_status === "instock" ? "En stock" : "Consultar"}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Envíos</dt>
                <dd className="mt-1 text-ink">AMBA 24–48 h · Nacional 3–5 días</dd>
              </div>
              <div>
                <dt className="eyebrow">Retiro</dt>
                <dd className="mt-1 text-ink">Barrio Norte & San Telmo</dd>
              </div>
              <div>
                <dt className="eyebrow">Garantía</dt>
                <dd className="mt-1 text-ink">Producto auténtico importado</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-ivory-100 py-24">
          <div className="container-x">
            <div className="flex flex-col items-center text-center">
              <span className="eyebrow">Tambi&eacute;n te puede gustar</span>
              <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Productos relacionados</h2>
            </div>
            <div className="mt-14">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
