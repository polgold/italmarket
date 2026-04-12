"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";

interface OrderSnapshot {
  order_id: number;
  order_number: string;
  order_key: string;
  status: string;
  customer_note?: string;
  billing_address: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  payment_result?: {
    payment_status: string;
    redirect_url?: string;
  };
}

/**
 * Post-checkout confirmation screen. We read the order data from
 * sessionStorage (set by /checkout right after POST /api/checkout) so we can
 * show the order number + bank details without another round-trip to Woo.
 */
export default function ConfirmacionPage() {
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const { refresh } = useCart();

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = sessionStorage.getItem("italmarket_last_order");
      if (raw) setOrder(JSON.parse(raw) as OrderSnapshot);
    } catch {
      /* noop */
    }
    // The Woo cart is reset server-side once the order is placed; nudge the
    // client cart state so the header count drops to 0 immediately.
    refresh();
  }, [refresh]);

  if (!hydrated) {
    return <section className="container-x py-24" />;
  }

  if (!order) {
    return (
      <section className="container-x py-24 text-center">
        <span className="eyebrow">Grazie</span>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Gracias por tu pedido</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink/60">
          Si entraste acá desde un link directo, no tenemos el detalle del pedido a mano. Revisá
          tu casilla de email — te enviamos la confirmación con todos los datos.
        </p>
        <Link href="/productos" className="btn-primary mt-8">
          Seguir comprando
        </Link>
      </section>
    );
  }

  const a = order.billing_address;
  const isBacs = order.payment_method === "bacs";

  return (
    <section className="container-x py-16 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="eyebrow">Pedido confirmado</span>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Grazie, {a.first_name}!</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            Tu pedido <strong className="text-ink">#{order.order_number}</strong> fue recibido.
            Te enviamos una confirmación a <strong className="text-ink">{a.email}</strong> con
            todos los detalles.
          </p>
        </div>

        <div className="mt-12 border border-ink/10 bg-ivory-100 p-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="eyebrow text-[10px]">Número de pedido</dt>
              <dd className="mt-1 font-serif text-lg text-ink">#{order.order_number}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[10px]">Estado</dt>
              <dd className="mt-1 text-ink">
                {order.status === "on-hold"
                  ? "Esperando transferencia"
                  : order.status === "processing"
                    ? "En preparación"
                    : order.status}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow text-[10px]">Enviado a</dt>
              <dd className="mt-1 text-ink">
                {a.first_name} {a.last_name}
                <br />
                {a.address_1}
                {a.address_2 ? `, ${a.address_2}` : ""}
                <br />
                {a.city}, {a.state}, {a.postcode}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-[10px]">Email</dt>
              <dd className="mt-1 text-ink">{a.email}</dd>
            </div>
            {a.phone && (
              <div>
                <dt className="eyebrow text-[10px]">Teléfono</dt>
                <dd className="mt-1 text-ink">{a.phone}</dd>
              </div>
            )}
            {order.customer_note && (
              <div className="col-span-2">
                <dt className="eyebrow text-[10px]">Notas</dt>
                <dd className="mt-1 text-ink/80">{order.customer_note}</dd>
              </div>
            )}
          </dl>
        </div>

        {isBacs && (
          <div className="mt-8 border border-ink/10 p-8">
            <h3 className="eyebrow mb-4">Próximo paso</h3>
            <p className="text-sm leading-relaxed text-ink/70">
              Vamos a enviarte por email los datos bancarios para la transferencia. Tu pedido
              queda reservado hasta que confirmemos el pago. Una vez acreditado, lo preparamos
              para despacho o retiro.
            </p>
          </div>
        )}

        {order.payment_result?.redirect_url && (
          <div className="mt-8 text-center">
            <a
              href={order.payment_result.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-extra-wide text-ink/60 underline-offset-4 hover:text-ink hover:underline"
            >
              Ver pedido en shop.italmarket.com.ar →
            </a>
          </div>
        )}

        <div className="mt-12 flex justify-center gap-4">
          <Link href="/productos" className="btn-primary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </section>
  );
}
