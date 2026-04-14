import {
  ORG_CONTACT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  STORES,
  type StoreLocation,
} from "./seo";
import type { Product } from "./types";
import { stripHtml } from "./utils";

/**
 * Canonical Organization schema. Used globally in the root layout so every
 * page carries the same publisher identity for Google and LLM citations.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    alternateName: "Italmarket · Delizie Italiane",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/logo.png`,
    },
    image: `${SITE_URL}/images/storefront.jpg`,
    email: ORG_CONTACT.email,
    sameAs: [ORG_CONTACT.instagram],
    contactPoint: STORES.map((store) => ({
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: store.telephone,
      areaServed: "AR",
      availableLanguage: ["Spanish", "Italian"],
      name: store.name,
    })),
    address: STORES.map((store) => ({
      "@type": "PostalAddress",
      streetAddress: store.streetAddress,
      addressLocality: store.addressLocality,
      addressRegion: store.addressRegion,
      postalCode: store.postalCode,
      addressCountry: "AR",
    })),
  };
}

/**
 * WebSite schema with a SearchAction so Google can show a sitelinks
 * searchbox in SERPs.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "es-AR",
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/productos?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * LocalBusiness (Store) schema — one per branch. Includes geo-less address,
 * phone, opening hours and map URL so Google can surface the store in maps.
 */
export function storeSchema(store: StoreLocation) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": store.url,
    name: store.name,
    image: store.image,
    url: store.url,
    telephone: store.telephone,
    email: ORG_CONTACT.email,
    priceRange: "$$",
    currenciesAccepted: "ARS",
    paymentAccepted: "Cash, Credit Card, Debit Card, MercadoPago, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: store.streetAddress,
      addressLocality: store.addressLocality,
      addressRegion: store.addressRegion,
      postalCode: store.postalCode,
      addressCountry: "AR",
    },
    openingHoursSpecification: store.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasMap: store.mapUrl,
    parentOrganization: { "@id": `${SITE_URL}#organization` },
  };
}

/**
 * Product schema for /productos/[slug]. Prices from WooCommerce are already
 * in ARS major-unit (plain string), so we pass them through to schema.org.
 */
export function productSchema(product: Product, productUrl: string) {
  const image = product.images[0]?.src ? [product.images[0].src] : [];
  const description = stripHtml(product.short_description || product.description);
  const inStock = product.stock_status !== "outofstock";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: description.slice(0, 500),
    image,
    sku: String(product.id),
    category: product.categories[0]?.name,
    brand: {
      "@type": "Brand",
      name: product.origin ?? "Italmarket",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "ARS",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}#organization` },
    },
  };
}

/**
 * BreadcrumbList helper. Pass an array of [name, url] tuples in document
 * order (root → current). Google uses this to render the breadcrumb trail
 * instead of the raw URL in search results.
 */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/**
 * Brand schema for /marca/[slug]. Google uses it to link a brand to the
 * products sold under it and to surface the brand in knowledge panels.
 */
export function brandSchema(input: {
  name: string;
  url: string;
  logo?: string;
  description: string;
  foundedYear?: number;
  country?: string;
  website?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": `${input.url}#brand`,
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.website ? { sameAs: [input.website] } : {}),
    ...(input.foundedYear ? { foundingDate: String(input.foundedYear) } : {}),
    ...(input.country
      ? { brandOfCountry: { "@type": "Country", name: input.country } }
      : {}),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
