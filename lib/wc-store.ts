/**
 * Server-side wrapper for the WooCommerce Store API (wc/store/v1).
 * Used by our Next.js API routes to proxy cart operations and keep the
 * Cart-Token + Nonce in sync via an HttpOnly cookie.
 *
 * Browser ↔ Next.js: cart_token cookie (HttpOnly).
 * Next.js ↔ Woo: Cart-Token + Nonce headers.
 * MCP server shares the same cart by calling the pairing endpoint, which
 * exchanges a 6-digit code for the browser's current cart_token.
 */

import { cookies } from "next/headers";
import { rewriteImage } from "./woocommerce";

const BASE = process.env.WC_SITE_URL || "https://italmarket.com.ar";
const COOKIE_TOKEN = "italmarket_cart_token";
const COOKIE_NONCE = "italmarket_cart_nonce";

export interface StoreCart {
  items: StoreCartItem[];
  items_count: number;
  items_weight: number;
  needs_shipping: boolean;
  coupons: { code: string }[];
  totals: StoreTotals;
}

export interface StoreCartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink: string;
  images: { src: string; thumbnail: string; alt?: string }[];
  prices: { price: string; regular_price: string; currency_minor_unit: number; currency_symbol: string };
  totals: { line_total: string; line_subtotal: string; currency_minor_unit: number; currency_symbol: string };
  variation: { attribute: string; value: string }[];
}

export interface StoreTotals {
  total_items: string;
  total_discount: string;
  total_shipping: string | null;
  total_tax: string;
  total_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
}

interface WcCall {
  method: "GET" | "POST" | "DELETE" | "PATCH";
  path: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
}

async function call<T>(opts: WcCall): Promise<T> {
  try {
    return await rawCall<T>(opts);
  } catch (e) {
    // Self-heal on missing/invalid Nonce: GET /cart once so Woo reissues a
    // fresh Nonce (captured by our cookie writer), then retry the original
    // request. Guard against infinite recursion by not retrying /cart.
    const err = e as { status?: number; data?: { code?: string } };
    const isNonceError =
      err.status === 401 &&
      (err.data?.code === "woocommerce_rest_missing_nonce" ||
        err.data?.code === "woocommerce_rest_invalid_nonce");
    if (!isNonceError || opts.path === "/cart") throw e;
    await rawCall({ method: "GET", path: "/cart" });
    return rawCall<T>(opts);
  }
}

async function rawCall<T>({ method, path, body, query }: WcCall): Promise<T> {
  const jar = await cookies();
  const token = jar.get(COOKIE_TOKEN)?.value;
  const nonce = jar.get(COOKIE_NONCE)?.value;

  const url = new URL(`${BASE}/wp-json/wc/store/v1${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Cart-Token"] = token;
  if (nonce) headers["Nonce"] = nonce;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // Refresh cart-token and nonce from response headers whenever Woo sends them.
  const newToken = res.headers.get("cart-token");
  const newNonce = res.headers.get("nonce");
  if (newToken && newToken !== token) {
    jar.set(COOKIE_TOKEN, newToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
  }
  if (newNonce && newNonce !== nonce) {
    jar.set(COOKIE_NONCE, newNonce, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const message = (data as { message?: string } | null)?.message || res.statusText;
    throw Object.assign(new Error(`Store API ${method} ${path} → ${res.status}: ${message}`), {
      status: res.status,
      data,
    });
  }
  return rewriteCartImages(data) as T;
}

/**
 * Walks a cart payload and rewrites item image URLs to the locally optimized
 * versions when available. Done once at the proxy boundary so every consumer
 * (cart hook, cart page, drawer) gets the small images for free.
 */
function rewriteCartImages(payload: unknown): unknown {
  const cart = payload as { items?: Array<{ images?: Array<{ src?: string; thumbnail?: string }> }> } | null;
  if (!cart?.items) return payload;
  for (const item of cart.items) {
    if (!item.images) continue;
    for (const img of item.images) {
      if (img.src) img.src = rewriteImage(img.src);
      if (img.thumbnail) img.thumbnail = rewriteImage(img.thumbnail);
    }
  }
  return payload;
}

// ---------- Checkout-related payloads ----------

export interface StoreAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
}

export interface StoreBillingAddress extends StoreAddress {
  email: string;
}

export interface StoreOrder {
  order_id: number;
  order_number: string;
  order_key: string;
  status: string;
  customer_note: string;
  billing_address: StoreBillingAddress;
  shipping_address: StoreAddress;
  payment_method: string;
  payment_result: {
    payment_status: string;
    redirect_url: string;
  };
}

export const wcStore = {
  getCart: () => call<StoreCart>({ method: "GET", path: "/cart" }),
  addItem: (id: number, quantity: number) =>
    call<StoreCart>({ method: "POST", path: "/cart/add-item", body: { id, quantity } }),
  updateItem: (key: string, quantity: number) =>
    call<StoreCart>({ method: "POST", path: "/cart/update-item", body: { key, quantity } }),
  removeItem: (key: string) =>
    call<StoreCart>({ method: "POST", path: "/cart/remove-item", body: { key } }),
  clearCart: async () => {
    await call<unknown>({ method: "DELETE", path: "/cart/items" });
    return call<StoreCart>({ method: "GET", path: "/cart" });
  },
  applyCoupon: (code: string) =>
    call<StoreCart>({ method: "POST", path: "/cart/apply-coupon", body: { code } }),
  removeCoupon: (code: string) =>
    call<StoreCart>({ method: "POST", path: "/cart/remove-coupon", body: { code } }),

  /**
   * Sets the customer's billing/shipping address on the cart. Triggers Woo
   * to recalculate shipping rates against the destination, which show up in
   * the returned cart's `shipping_rates` field.
   */
  updateCustomer: (payload: {
    billing_address: StoreBillingAddress;
    shipping_address: StoreAddress;
  }) =>
    call<StoreCart>({ method: "POST", path: "/cart/update-customer", body: payload }),

  /**
   * Picks which of the quoted shipping rates the customer wants.
   */
  selectShippingRate: (package_id: number, rate_id: string) =>
    call<StoreCart>({
      method: "POST",
      path: "/cart/select-shipping-rate",
      body: { package_id, rate_id },
    }),

  /**
   * Finalizes the order. Woo creates a real WooCommerce order in the
   * status dictated by the selected payment method (bacs/transferencia
   * lands in "on-hold" until the admin confirms the transfer).
   */
  placeOrder: (payload: {
    billing_address: StoreBillingAddress;
    shipping_address: StoreAddress;
    payment_method: string;
    customer_note?: string;
  }) => call<StoreOrder>({ method: "POST", path: "/checkout", body: payload }),
};

// ---------- Cart token helpers (for the pairing flow) ----------

export async function readCartTokenCookie(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_TOKEN)?.value ?? null;
}

export async function writeCartTokenCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_TOKEN, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

/**
 * Ensures the browser has a cart_token cookie by hitting Woo once if empty.
 * Returns the current token.
 */
export async function ensureCartToken(): Promise<string> {
  const existing = await readCartTokenCookie();
  if (existing) return existing;
  await wcStore.getCart();
  return (await readCartTokenCookie()) || "";
}
