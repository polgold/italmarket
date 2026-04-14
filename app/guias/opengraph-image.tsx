import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Guías de productos italianos — Italmarket";

export default async function OgImage() {
  return renderOgImage({
    eyebrow: "Le nostre guide",
    title: "Guías de productos italianos",
    kicker:
      "DOP, IGP y DOCG, aceite de oliva extra virgen, pasta seca vs fresca, Prosecco y más.",
  });
}
