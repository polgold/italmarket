"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <section className="container-x py-20 lg:py-28">
      <div className="mb-14 text-center">
        <span className="eyebrow">Checkout</span>
        <h1 className="mt-3 font-serif text-5xl text-ink sm:text-6xl">Il tuo carrello</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-20 text-center">
          <p className="font-serif text-2xl text-ink">Tu carrito está vacío</p>
          <Link href="/productos" className="btn-primary">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-14 lg:grid-cols-[1.7fr_1fr] lg:gap-20">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {items.map((item) => (
              <li key={item.key} className="grid grid-cols-[120px_1fr_auto] gap-6 py-8">
                <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100">
                  <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
                </div>
                <div>
                  <Link href={`/productos/${item.slug}`} className="font-serif text-2xl text-ink hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm text-ink/60">{formatPrice(item.price)} c/u</p>
                  <div className="mt-5 inline-flex items-center border border-ink/20">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-3 py-2 hover:bg-ink hover:text-ivory-50">−</button>
                    <span className="px-4 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-3 py-2 hover:bg-ink hover:text-ivory-50">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-serif text-xl text-ink">{formatPrice(item.lineTotal)}</span>
                  <button onClick={() => removeItem(item.key)} className="text-[11px] uppercase tracking-extra-wide text-ink/50 hover:text-rosso-500">
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit bg-ivory-100 p-10">
            <h2 className="font-serif text-3xl text-ink">Resumen</h2>
            <dl className="mt-8 space-y-4 border-b border-ink/10 pb-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd className="text-ink">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Envío</dt>
                <dd className="text-ink">Calculado en checkout</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-baseline justify-between">
              <span className="eyebrow">Total</span>
              <span className="font-serif text-3xl text-ink">{formatPrice(subtotal)}</span>
            </div>
            <button className="btn-primary mt-8 w-full">Ir al checkout</button>
            <Link href="/productos" className="mt-4 block text-center text-[11px] uppercase tracking-extra-wide text-ink/60 hover:text-ink">
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
