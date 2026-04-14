import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { guides, recipes } from "@/lib/recipes";
import { getCategories, getProducts } from "@/lib/woocommerce";

export const revalidate = 3600;

/**
 * sitemap.xml generado desde el catálogo vivo de WooCommerce: incluye cada
 * producto en stock y cada categoría con productos, más las páginas estáticas.
 * Google y los LLMs lo usan para descubrir todas las URLs indexables.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/productos`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE_URL}/recetas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/guias`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sucursales`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/nosotros`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${SITE_URL}/recetas/${r.slug}`,
    lastModified: r.updatedAt ? new Date(r.updatedAt) : new Date(r.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guias/${g.slug}`,
    lastModified: g.updatedAt ? new Date(g.updatedAt) : new Date(g.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);

    categoryRoutes = categories
      .filter((c) => (c.count ?? 0) > 0)
      .map((c) => ({
        url: `${SITE_URL}/productos?categoria=${encodeURIComponent(c.slug)}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));

    productRoutes = products.map((p) => ({
      url: `${SITE_URL}/productos/${encodeURIComponent(p.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    /* if WooCommerce is unreachable we still emit the static sitemap */
  }

  return [...staticRoutes, ...recipeRoutes, ...guideRoutes, ...categoryRoutes, ...productRoutes];
}
