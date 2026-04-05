"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Cart state is now authoritative on the server (WooCommerce Store API),
 * proxied through /api/cart* routes. We keep a local snapshot synced via
 * short polling so that changes made by the MCP server (or any other client
 * sharing the same Cart-Token) appear in the browser within a few seconds.
 */

export interface CartLineItem {
  key: string; // Store API item key — used for update/remove
  id: number;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  price: number; // unit price in currency units (ARS, no decimals)
  lineTotal: number;
  permalink?: string;
}

export interface CartTotals {
  items: number;
  discount: number;
  shipping: number | null;
  tax: number;
  total: number;
  currencyCode: string;
}

interface CartContextValue {
  items: CartLineItem[];
  totals: CartTotals | null;
  isOpen: boolean;
  loading: boolean;
  totalItems: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
  pair: () => Promise<{ code: string; expires_in_seconds: number }>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface StoreCartResponse {
  items: Array<{
    key: string;
    id: number;
    name: string;
    quantity: number;
    permalink: string;
    images: { src: string; thumbnail: string }[];
    prices: { price: string; currency_minor_unit: number };
    totals: { line_total: string; currency_minor_unit: number };
    variation: unknown[];
  }>;
  items_count: number;
  coupons: { code: string }[];
  totals: {
    total_items: string;
    total_discount: string;
    total_shipping: string | null;
    total_tax: string;
    total_price: string;
    currency_code: string;
    currency_minor_unit: number;
  };
}

function toMoney(value: string | null, minor: number): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n / Math.pow(10, minor);
}

function slugFromPermalink(permalink: string): string {
  try {
    const segments = new URL(permalink).pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? "";
  } catch {
    return "";
  }
}

function mapCart(data: StoreCartResponse): { items: CartLineItem[]; totals: CartTotals } {
  const items: CartLineItem[] = data.items.map((i) => {
    const minor = i.prices.currency_minor_unit;
    return {
      key: i.key,
      id: i.id,
      name: i.name,
      slug: slugFromPermalink(i.permalink),
      image: i.images?.[0]?.src || "/images/storefront.jpg",
      quantity: i.quantity,
      price: toMoney(i.prices.price, minor),
      lineTotal: toMoney(i.totals.line_total, i.totals.currency_minor_unit),
      permalink: i.permalink,
    };
  });
  const t = data.totals;
  const totals: CartTotals = {
    items: toMoney(t.total_items, t.currency_minor_unit),
    discount: toMoney(t.total_discount, t.currency_minor_unit),
    shipping: t.total_shipping ? toMoney(t.total_shipping, t.currency_minor_unit) : null,
    tax: toMoney(t.total_tax, t.currency_minor_unit),
    total: toMoney(t.total_price, t.currency_minor_unit),
    currencyCode: t.currency_code,
  };
  return { items, totals };
}

async function cartFetch(path: string, init?: RequestInit): Promise<StoreCartResponse> {
  const res = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${path} → ${res.status}: ${body}`);
  }
  return (await res.json()) as StoreCartResponse;
}

const POLL_INTERVAL_MS = 3000;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const lastSigRef = useRef<string>("");

  const applyCart = useCallback((data: StoreCartResponse) => {
    const mapped = mapCart(data);
    // Cheap signature to skip re-renders when nothing changed between polls.
    const sig = JSON.stringify(mapped);
    if (sig === lastSigRef.current) return;
    lastSigRef.current = sig;
    setItems(mapped.items);
    setTotals(mapped.totals);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await cartFetch("/api/cart");
      applyCart(data);
    } catch (e) {
      console.error("[cart] refresh failed", e);
    }
  }, [applyCart]);

  // Initial load + polling.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [refresh]);

  // Also refresh on window focus so coming back to the tab shows MCP changes fast.
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      const data = await cartFetch("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ id: productId, quantity }),
      });
      applyCart(data);
      setIsOpen(true);
    },
    [applyCart],
  );

  const updateQuantity = useCallback(
    async (key: string, quantity: number) => {
      const data = await cartFetch("/api/cart/items", {
        method: "PATCH",
        body: JSON.stringify({ key, quantity }),
      });
      applyCart(data);
    },
    [applyCart],
  );

  const removeItem = useCallback(
    async (key: string) => {
      const data = await cartFetch(`/api/cart/items?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      applyCart(data);
    },
    [applyCart],
  );

  const clear = useCallback(async () => {
    const data = await cartFetch("/api/cart", { method: "DELETE" });
    applyCart(data);
  }, [applyCart]);

  const pair = useCallback(async () => {
    const res = await fetch("/api/cart/pair", {
      method: "POST",
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error(`pair failed: ${res.status}`);
    return (await res.json()) as { code: string; expires_in_seconds: number };
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = totals?.items ?? 0;

  const value: CartContextValue = {
    items,
    totals,
    isOpen,
    loading,
    totalItems,
    subtotal,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refresh,
    pair,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
