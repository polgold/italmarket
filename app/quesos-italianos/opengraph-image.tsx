import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Quesos italianos en Buenos Aires — Italmarket";

export default async function OgImage() {
  return renderOgImage({
    eyebrow: "Formaggi italiani",
    title: "Quesos italianos en Buenos Aires",
    kicker:
      "Burrata, mascarpone, ricotta, caciocavallo, bocconcino y la mejor selección importada.",
    meta: "Cadena de frío · Envío nacional",
  });
}
