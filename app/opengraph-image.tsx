import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Italmarket — Delizie Italiane en Buenos Aires";

export default async function OgImage() {
  return renderOgImage({
    eyebrow: "Dal 2015",
    title: "Delizie Italiane en Buenos Aires",
    kicker:
      "Tienda premium de productos italianos importados: pastas, aceites, salumi, quesos, vinos y dolci.",
  });
}
