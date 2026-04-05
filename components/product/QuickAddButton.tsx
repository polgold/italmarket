"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface QuickAddButtonProps {
  productId: number;
  productName: string;
}

/**
 * Small "add to cart" button rendered on each product card so users can add
 * items without navigating to the detail page. Stops click propagation so the
 * parent <Link> doesn't fire when pressed.
 */
export function QuickAddButton({ productId, productName }: QuickAddButtonProps) {
  const { addItem } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === "loading") return;
    setState("loading");
    try {
      await addItem(productId, 1);
      setState("done");
      setTimeout(() => setState("idle"), 1500);
    } catch (err) {
      console.error("quick add failed", err);
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const label = {
    idle: "Agregar",
    loading: "…",
    done: "✓ Agregado",
    error: "Error",
  }[state];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Agregar ${productName} al carrito`}
      className="w-full bg-ink py-2.5 text-[11px] uppercase tracking-extra-wide text-ivory-50 transition hover:bg-bosco-700 disabled:opacity-60"
      disabled={state === "loading"}
    >
      {label}
    </button>
  );
}
