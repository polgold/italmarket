import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";
import { BRANDS, getBrand } from "@/lib/brands";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Marca italiana — Italmarket";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export default async function OgImage({ params }: { params: { slug: string } }) {
  const brand = getBrand(params.slug);
  if (!brand) {
    return renderOgImage({
      eyebrow: "Marca",
      title: "Marca italiana en Italmarket",
    });
  }
  return renderOgImage({
    eyebrow: brand.eyebrow,
    title: brand.name,
    kicker: brand.intro,
    meta: `${brand.region} · ${brand.country}`,
  });
}
