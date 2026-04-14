import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Recetas italianas auténticas — Italmarket";

export default async function OgImage() {
  return renderOgImage({
    eyebrow: "Le nostre ricette",
    title: "Recetas italianas auténticas",
    kicker:
      "Carbonara, pomodoro, pesto alla genovese, tiramisú y más. Los clásicos, con los ingredientes listos para pedir.",
  });
}
