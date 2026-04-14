import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Vinos italianos en Buenos Aires — Italmarket";

export default async function OgImage() {
  return renderOgImage({
    eyebrow: "Vini e bevande",
    title: "Vinos italianos en Buenos Aires",
    kicker:
      "Prosecco DOCG Colvendra y Valdambra, grappa Toscana, sambuca, Birra Menabrea y más.",
    meta: "DOCG · DOC · Envío nacional",
  });
}
