import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";
import { getRecipe, recipes } from "@/lib/recipes";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Receta italiana — Italmarket";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export default async function OgImage({ params }: { params: { slug: string } }) {
  const r = getRecipe(params.slug);
  if (!r) {
    return renderOgImage({
      eyebrow: "Receta",
      title: "Receta italiana auténtica",
      kicker: "La cocina italiana como la haría una nonna.",
    });
  }
  const meta = [r.region, `${r.prepTimeMin + r.cookTimeMin} min`].filter(Boolean).join(" · ");
  return renderOgImage({
    eyebrow: r.italianTitle ?? "Receta",
    title: r.title,
    kicker: r.summary,
    meta,
  });
}
