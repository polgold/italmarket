"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { CloseIcon } from "@/components/ui/Icons";
import { cn, formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal, pair } = useCart();
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [pairExpires, setPairExpires] = useState<number | null>(null);
  const [pairLoading, setPairLoading] = useState(false);

  const requestPair = async () => {
    setPairLoading(true);
    try {
      const { code, expires_in_seconds } = await pair();
      setPairCode(code);
      setPairExpires(Date.now() + expires_in_seconds * 1000);
    } catch (e) {
      console.error(e);
      alert("No se pudo generar el código de pareo.");
    } finally {
      setPairLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory-50 shadow-2xl transition-transform duration-500",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-6">
          <h2 className="font-serif text-2xl text-ink">Il tuo carrello</h2>
          <button onClick={closeCart} aria-label="Cerrar carrito" className="text-ink/70 hover:text-ink">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-serif text-xl text-ink">Tu carrito está vacío</p>
            <p className="text-sm text-ink/60">Descubrí los productos seleccionados por Italmarket.</p>
            <Link href="/productos" onClick={closeCart} className="btn-primary mt-4">
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-ivory-100">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/productos/${item.slug}`}
                      onClick={closeCart}
                      className="font-serif text-lg text-ink hover:underline"
                    >
                      {item.name}
                    </Link>
                    <span className="mt-1 text-sm text-ink/70">{formatPrice(item.price)}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border border-ink/20">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="px-3 py-1 text-sm hover:bg-ink hover:text-ivory-50"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="px-3 py-1 text-sm hover:bg-ink hover:text-ivory-50"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-[11px] uppercase tracking-extra-wide text-ink/50 hover:text-rosso-500"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink/10 px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-serif text-2xl text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-extra-wide text-ink/50">
                Envíos e impuestos calculados en el checkout
              </p>
              <Link href="/carrito" onClick={closeCart} className="btn-primary mt-5 w-full">
                Finalizar compra
              </Link>
              <button
                onClick={closeCart}
                className="mt-3 block w-full text-[11px] uppercase tracking-extra-wide text-ink/60 hover:text-ink"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}

        {/* Pair-with-Claude section — always visible at the bottom of the drawer */}
        <div className="border-t border-ink/10 bg-ivory-100/60 px-6 py-5">
          {pairCode ? (
            <div>
              <p className="eyebrow mb-2">Código de pareo</p>
              <p className="font-serif text-3xl tracking-[0.3em] text-ink">{pairCode}</p>
              <p className="mt-2 text-[11px] text-ink/60">
                Decile a Claude: <em>“pareate con el código {pairCode}”</em>.
                {pairExpires ? ` Expira a las ${new Date(pairExpires).toLocaleTimeString()}.` : ""}
              </p>
              <button
                onClick={() => setPairCode(null)}
                className="mt-3 text-[11px] uppercase tracking-extra-wide text-ink/50 hover:text-ink"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <button
              onClick={requestPair}
              disabled={pairLoading}
              className="w-full border border-ink/80 px-4 py-3 text-[11px] uppercase tracking-extra-wide text-ink hover:bg-ink hover:text-ivory-50 disabled:opacity-60"
            >
              {pairLoading ? "Generando código…" : "Conectar con Claude"}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
