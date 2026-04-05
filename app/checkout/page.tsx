"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AR_PROVINCES } from "@/lib/ar-provinces";
import { formatPrice } from "@/lib/utils";

/**
 * Headless checkout that posts to WC Store API via our /api/checkout proxy.
 *
 * Flow:
 *   1. Pull cart from /api/cart for the summary + payment_methods.
 *   2. When the address has enough fields filled in, POST /api/cart/customer
 *      so Woo returns the applicable shipping_rates for that destination.
 *   3. User picks a shipping rate — POST /api/cart/shipping to lock it in.
 *   4. On submit → POST /api/checkout. On success we stash the order in
 *      sessionStorage and push /checkout/confirmacion so the client can show
 *      the order details without hitting Woo again.
 */

interface Money {
  price: string;
  currency_minor_unit: number;
}

interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink: string;
  images: { src: string }[];
  prices: Money;
  totals: { line_total: string; currency_minor_unit: number };
}

interface ShippingRate {
  rate_id: string;
  name: string;
  description: string;
  price: string;
  currency_minor_unit: number;
  selected: boolean;
}

interface ShippingPackage {
  package_id: number;
  shipping_rates: ShippingRate[];
}

interface Cart {
  items: CartItem[];
  items_count: number;
  needs_shipping: boolean;
  needs_payment: boolean;
  payment_methods: string[];
  shipping_rates: ShippingPackage[];
  totals: {
    total_items: string;
    total_shipping: string | null;
    total_tax: string;
    total_price: string;
    currency_minor_unit: number;
  };
}

function toMajor(value: string | null, minor: number): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n / Math.pow(10, minor) : 0;
}

const PAYMENT_METHOD_LABELS: Record<string, { name: string; description: string }> = {
  bacs: {
    name: "Transferencia bancaria",
    description:
      "Recibirás los datos bancarios por email. Tu pedido quedará reservado hasta que confirmemos el pago.",
  },
  cod: {
    name: "Pago contra entrega",
    description: "Abonás al recibir el pedido.",
  },
  cheque: {
    name: "Cheque",
    description: "Entrega por cheque.",
  },
};

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  customer_note: string;
  payment_method: string;
}

const initialForm: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "C",
  postcode: "",
  country: "AR",
  customer_note: "",
  payment_method: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addressDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load cart on mount.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-store", credentials: "same-origin" });
        const data = (await res.json()) as Cart;
        setCart(data);
        if (data.payment_methods?.length && !form.payment_method) {
          setForm((f) => ({ ...f, payment_method: data.payment_methods[0] }));
        }
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the cart is empty, kick the user back to the shop.
  useEffect(() => {
    if (cart && cart.items_count === 0) {
      router.replace("/productos");
    }
  }, [cart, router]);

  const addressComplete =
    form.first_name.trim().length > 0 &&
    form.last_name.trim().length > 0 &&
    form.address_1.trim().length > 3 &&
    form.city.trim().length > 1 &&
    form.postcode.trim().length >= 4 &&
    form.state.length > 0;

  // When the address is complete, sync it to Woo (debounced) so shipping
  // rates are recalculated for the correct destination.
  useEffect(() => {
    if (!addressComplete) return;
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    addressDebounceRef.current = setTimeout(async () => {
      setLoadingRates(true);
      try {
        const payload = {
          billing_address: {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email || "noemail@example.com",
            phone: form.phone,
            address_1: form.address_1,
            address_2: form.address_2,
            city: form.city,
            state: form.state,
            postcode: form.postcode,
            country: form.country,
            company: "",
          },
          shipping_address: {
            first_name: form.first_name,
            last_name: form.last_name,
            phone: form.phone,
            address_1: form.address_1,
            address_2: form.address_2,
            city: form.city,
            state: form.state,
            postcode: form.postcode,
            country: form.country,
            company: "",
          },
        };
        const res = await fetch("/api/cart/customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = (await res.json()) as Cart;
          setCart(data);
          // Preselect the currently-selected rate from the response.
          const pkg = data.shipping_rates?.[0];
          if (pkg) {
            const current = pkg.shipping_rates.find((r) => r.selected);
            if (current) setSelectedRate(current.rate_id);
          }
        }
      } catch (e) {
        console.error("address sync failed", e);
      } finally {
        setLoadingRates(false);
      }
    }, 500);
    return () => {
      if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    };
  }, [
    addressComplete,
    form.first_name,
    form.last_name,
    form.address_1,
    form.address_2,
    form.city,
    form.state,
    form.postcode,
    form.country,
    form.phone,
    form.email,
  ]);

  const pickShippingRate = useCallback(async (rateId: string) => {
    setSelectedRate(rateId);
    try {
      const res = await fetch("/api/cart/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: 0, rate_id: rateId }),
        credentials: "same-origin",
      });
      if (res.ok) {
        const data = (await res.json()) as Cart;
        setCart(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedRate && cart?.needs_shipping) {
      setError("Elegí un método de envío.");
      return;
    }
    if (!form.payment_method) {
      setError("Elegí un método de pago.");
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        billing_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          address_1: form.address_1,
          address_2: form.address_2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          country: form.country,
          company: "",
        },
        shipping_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          address_1: form.address_1,
          address_2: form.address_2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          country: form.country,
          company: "",
        },
        payment_method: form.payment_method,
        customer_note: form.customer_note,
      };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No pudimos procesar el pedido. Intentá de nuevo.");
        return;
      }
      sessionStorage.setItem("italmarket_last_order", JSON.stringify(data));
      router.push("/checkout/confirmacion");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPlacing(false);
    }
  };

  const shippingOptions = cart?.shipping_rates?.[0]?.shipping_rates ?? [];
  const minor = cart?.totals.currency_minor_unit ?? 0;
  const totals = cart?.totals;

  const summary = useMemo(() => {
    if (!cart) return null;
    return {
      items: toMajor(totals!.total_items, minor),
      shipping: totals!.total_shipping ? toMajor(totals!.total_shipping, minor) : null,
      total: toMajor(totals!.total_price, minor),
    };
  }, [cart, totals, minor]);

  if (!cart) {
    return (
      <section className="container-x py-24 text-center text-ink/50">
        <p className="text-[11px] uppercase tracking-extra-wide">Cargando carrito…</p>
      </section>
    );
  }

  const set = <K extends keyof FormState>(key: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  return (
    <section className="container-x py-10 lg:py-14">
      <div className="mb-10 text-center">
        <span className="eyebrow">Checkout</span>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">Finalizar compra</h1>
      </div>

      <form onSubmit={placeOrder} className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        {/* ---------------- Form column ---------------- */}
        <div className="space-y-12">
          <Section title="Contacto">
            <Field label="Email" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                className="input"
                autoComplete="email"
              />
            </Field>
            <Field label="Teléfono" required>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={set("phone")}
                className="input"
                autoComplete="tel"
              />
            </Field>
          </Section>

          <Section title="Dirección de envío">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nombre" required>
                <input
                  required
                  value={form.first_name}
                  onChange={set("first_name")}
                  className="input"
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Apellido" required>
                <input
                  required
                  value={form.last_name}
                  onChange={set("last_name")}
                  className="input"
                  autoComplete="family-name"
                />
              </Field>
            </div>
            <Field label="Dirección" required>
              <input
                required
                value={form.address_1}
                onChange={set("address_1")}
                placeholder="Calle y número"
                className="input"
                autoComplete="address-line1"
              />
            </Field>
            <Field label="Depto / Piso (opcional)">
              <input
                value={form.address_2}
                onChange={set("address_2")}
                className="input"
                autoComplete="address-line2"
              />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="Ciudad" required>
                <input required value={form.city} onChange={set("city")} className="input" />
              </Field>
              <Field label="Provincia" required>
                <select required value={form.state} onChange={set("state")} className="input">
                  {AR_PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Código postal" required>
                <input
                  required
                  value={form.postcode}
                  onChange={set("postcode")}
                  className="input"
                  autoComplete="postal-code"
                />
              </Field>
            </div>
          </Section>

          {cart.needs_shipping && (
            <Section title="Método de envío">
              {!addressComplete ? (
                <p className="text-sm text-ink/50">Completá la dirección para ver las opciones de envío.</p>
              ) : loadingRates ? (
                <p className="text-sm text-ink/50">Calculando envíos…</p>
              ) : shippingOptions.length === 0 ? (
                <p className="text-sm text-rosso-500">
                  No hay métodos de envío disponibles para esta dirección.
                </p>
              ) : (
                <div className="space-y-2">
                  {shippingOptions.map((rate) => {
                    const price = toMajor(rate.price, rate.currency_minor_unit);
                    const active = selectedRate === rate.rate_id;
                    return (
                      <label
                        key={rate.rate_id}
                        className={`flex cursor-pointer items-center justify-between border px-5 py-4 transition ${
                          active ? "border-ink bg-ivory-100" : "border-ink/10 hover:border-ink/40"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shipping_rate"
                            checked={active}
                            onChange={() => pickShippingRate(rate.rate_id)}
                            className="accent-ink"
                          />
                          <div>
                            <p className="text-sm text-ink">{rate.name}</p>
                            {rate.description && (
                              <p className="text-[11px] uppercase tracking-extra-wide text-ink/50">
                                {rate.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-serif text-base text-ink">
                          {price === 0 ? "Gratis" : formatPrice(price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </Section>
          )}

          <Section title="Método de pago">
            {cart.payment_methods.length === 0 ? (
              <p className="text-sm text-rosso-500">No hay métodos de pago configurados.</p>
            ) : (
              <div className="space-y-2">
                {cart.payment_methods.map((method) => {
                  const meta = PAYMENT_METHOD_LABELS[method] ?? { name: method, description: "" };
                  const active = form.payment_method === method;
                  return (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-start gap-4 border px-5 py-4 transition ${
                        active ? "border-ink bg-ivory-100" : "border-ink/10 hover:border-ink/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={active}
                        onChange={() => setForm((f) => ({ ...f, payment_method: method }))}
                        className="mt-1 accent-ink"
                      />
                      <div>
                        <p className="text-sm text-ink">{meta.name}</p>
                        {meta.description && (
                          <p className="mt-0.5 text-[11px] leading-relaxed text-ink/50">{meta.description}</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </Section>

          <Section title="Notas del pedido (opcional)">
            <textarea
              value={form.customer_note}
              onChange={set("customer_note")}
              rows={3}
              placeholder="Horario de entrega, indicaciones al repartidor, regalo, etc."
              className="input resize-none"
            />
          </Section>
        </div>

        {/* ---------------- Summary column ---------------- */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-ink/10 bg-ivory-100 p-8">
            <h3 className="font-serif text-2xl text-ink">Tu pedido</h3>
            <ul className="mt-6 divide-y divide-ink/10">
              {cart.items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-ivory-50">
                    {item.images?.[0]?.src && (
                      <Image
                        src={item.images[0].src}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-ink">{item.name}</p>
                      <p className="text-[11px] uppercase tracking-extra-wide text-ink/50">
                        Cantidad {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-ink">
                      {formatPrice(toMajor(item.totals.line_total, item.totals.currency_minor_unit))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {summary && (
              <dl className="mt-6 space-y-2 border-t border-ink/10 pt-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Subtotal</dt>
                  <dd className="text-ink">{formatPrice(summary.items)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Envío</dt>
                  <dd className="text-ink">
                    {summary.shipping === null
                      ? "—"
                      : summary.shipping === 0
                        ? "Gratis"
                        : formatPrice(summary.shipping)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
                  <dt className="eyebrow">Total</dt>
                  <dd className="font-serif text-2xl text-ink">{formatPrice(summary.total)}</dd>
                </div>
              </dl>
            )}

            {error && (
              <p className="mt-5 border border-rosso-500/40 bg-rosso-500/5 p-3 text-sm text-rosso-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={placing}
              className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placing ? "Procesando pedido…" : "Confirmar pedido"}
            </button>
            <Link
              href="/carrito"
              className="mt-3 block text-center text-[11px] uppercase tracking-extra-wide text-ink/50 hover:text-ink"
            >
              ← Volver al carrito
            </Link>
          </div>
        </aside>
      </form>
    </section>
  );
}

// ---------- Small presentational helpers ----------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow mb-5">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-extra-wide text-ink/60">
        {label}
        {required && <span className="ml-1 text-rosso-500">*</span>}
      </span>
      {children}
    </label>
  );
}
