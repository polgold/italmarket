import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt — explícitamente permitimos a los principales search engines y
 * a los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, etc.) para que el
 * catálogo y las recetas sean indexables y citables en respuestas de LLMs.
 *
 * Bloqueamos las rutas transaccionales (carrito, checkout) y todas las
 * `/api/*`, que no aportan contenido para ranking y son ruido para el crawler.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "DuckAssistBot",
  "YouBot",
  "cohere-ai",
  "Diffbot",
  "Timpibot",
  "Omgilibot",
  "Omgili",
];

const DISALLOWED = ["/api/", "/carrito", "/checkout"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOWED },
      ...AI_CRAWLERS.map((agent) => ({ userAgent: agent, allow: "/", disallow: DISALLOWED })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
