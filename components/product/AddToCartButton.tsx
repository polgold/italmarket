"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <div className="inline-flex items-center border border-ink/80">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-3 text-ink hover:bg-ink hover:text-ivory-50"
          aria-label="Reducir"
        >
          −
        </button>
        <span className="w-10 text-center text-sm">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="px-4 py-3 text-ink hover:bg-ink hover:text-ivory-50"
          aria-label="Aumentar"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await addItem(product.id, qty);
          } catch (e) {
            console.error(e);
            alert("No se pudo agregar al carrito. Intentá de nuevo.");
          } finally {
            setBusy(false);
          }
        }}
        className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Agregando…" : "Agregar al carrito"}
      </button>
    </div>
  );
}
