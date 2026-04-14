import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Marcas italianas — Italmarket";

export default async function OgImage() {
  return renderOgImage({
    eyebrow: "I marchi",
    title: "Marcas italianas en Italmarket",
    kicker:
      "Divella, Perugina, Menabrea, Giuliano Tartufi, Daleo y más. Historia, origen y productos de cada casa.",
  });
}
