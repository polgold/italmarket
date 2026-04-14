"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export interface RecipeCartLineIn {
  productId: number;
  productName: string;
  productSlug: string;
  image: string;
  unitPrice: number;
  suggestedUnits: number;
  recipeLabel: string;
}

interface Props {
  /** Ingredient lines — tildados por defecto. */
  lines: RecipeCartLineIn[];
  /** Productos complementarios — destildados por defecto. */
  pairingLines?: RecipeCartLineIn[];
  recipeTitle: string;
}

/**
 * Pre-filled recipe cart: lets the visitor toggle each ingredient off (they
 * already have it), adjust quantities and push everything into the site cart
 * with one click. Skips UI entirely when no ingredient matched a product.
 */
export function RecipeCart({ lines, pairingLines = [], recipeTitle }: Props) {
  const { addItem, openCart } = useCart();
  const router = useRouter();
  const allLines = useMemo(() => [...lines, ...pairingLines], [lines, pairingLines]);
  const [selected, setSelected] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    for (const l of lines) init[l.productId] = true;
    for (const p of pairingLines) init[p.productId] = false;
    return init;
  });
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(allLines.map((l) => [l.productId, Math.max(1, l.suggestedUnits)])),
  );
  const [submitting, setSubmitting] = useState<"cart" | "checkout" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeLines = useMemo(
    () => allLines.filter((l) => selected[l.productId]),
    [allLines, selected],
  );
  const total = useMemo(
    () => activeLines.reduce((s, l) => s + l.unitPrice * quantities[l.productId], 0),
    [activeLines, quantities],
  );

  if (lines.length === 0 && pairingLines.length === 0) return null;

  const addAll = async (mode: "cart" | "checkout") => {
    setError(null);
    setSubmitting(mode);
    try {
      for (const line of activeLines) {
        await addItem(line.productId, quantities[line.productId]);
      }
      if (mode === "checkout") {
        router.push("/checkout");
      } else {
        openCart();
      }
    } catch (e) {
      console.error("[RecipeCart] add-all failed", e);
      setError("No se pudo agregar todo al carrito. Probá de nuevo en unos segundos.");
    } finally {
      setSubmitting(null);
    }
  };

  const toggle = (id: number) => setSelected((p) => ({ ...p, [id]: !p[id] }));
  const updateQty = (id: number, delta: number) =>
    setQuantities((p) => ({ ...p, [id]: Math.max(1, (p[id] ?? 1) + delta) }));

  const renderLine = (line: RecipeCartLineIn) => {
    const isOn = selected[line.productId];
    const qty = quantities[line.productId];
    return (
      <li
        key={line.productId}
        className={`flex items-center gap-4 py-4 transition ${isOn ? "" : "opacity-40"}`}
      >
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => toggle(line.productId)}
          aria-label={`Incluir ${line.productName}`}
          className="h-5 w-5 accent-bosco-700"
        />
        <Link
          href={`/productos/${line.productSlug}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden bg-ivory-50"
        >
          <Image
            src={line.image}
            alt={line.productName}
            fill
            sizes="64px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          {line.recipeLabel && (
            <p className="text-[10px] uppercase tracking-extra-wide text-ink/50">
              {line.recipeLabel}
            </p>
          )}
          <Link
            href={`/productos/${line.productSlug}`}
            className="mt-1 block truncate font-serif text-lg text-ink hover:underline"
          >
            {line.productName}
          </Link>
          <p className="text-sm text-ink/60">{formatPrice(line.unitPrice)} c/u</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateQty(line.productId, -1)}
            disabled={!isOn || qty <= 1}
            aria-label="Disminuir cantidad"
            className="flex h-8 w-8 items-center justify-center border border-ink/20 text-ink disabled:opacity-30"
          >
            −
          </button>
          <span className="w-6 text-center font-serif text-base">{qty}</span>
          <button
            type="button"
            onClick={() => updateQty(line.productId, 1)}
            disabled={!isOn}
            aria-label="Aumentar cantidad"
            className="flex h-8 w-8 items-center justify-center border border-ink/20 text-ink disabled:opacity-30"
          >
            +
          </button>
        </div>
        <div className="w-24 text-right font-serif text-base text-ink">
          {formatPrice(line.unitPrice * qty)}
        </div>
      </li>
    );
  };

  return (
    <section className="border-t border-ink/10 bg-ivory-100 py-16 lg:py-20">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">Cocinala en casa</span>
            <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
              Ingredientes listos para pedir
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
              Seleccionamos de nuestro catálogo los ingredientes italianos que necesitás para
              hacer {recipeTitle} en casa. Destildá lo que ya tengas, ajustá cantidades y mandalos
              al carrito.
            </p>
          </div>

          {lines.length > 0 && (
            <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {lines.map(renderLine)}
            </ul>
          )}

          {pairingLines.length > 0 && (
            <>
              <div className="mt-12 text-center">
                <span className="eyebrow">Completá el plato</span>
                <h3 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
                  Para acompañar esta receta
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink/60">
                  Productos del catálogo que combinan con esta receta. Tildá lo que quieras sumar.
                </p>
              </div>
              <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {pairingLines.map(renderLine)}
              </ul>
            </>
          )}

          <div className="mt-6 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-extra-wide text-ink/60">
              Total estimado
            </span>
            <span className="font-serif text-3xl text-ink">{formatPrice(total)}</span>
          </div>

          {error && (
            <p className="mt-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addAll("cart")}
              disabled={submitting !== null || activeLines.length === 0}
              className="btn-primary flex-1 justify-center disabled:opacity-50"
            >
              {submitting === "cart" ? "Agregando…" : "Agregar al carrito"}
            </button>
            <button
              type="button"
              onClick={() => addAll("checkout")}
              disabled={submitting !== null || activeLines.length === 0}
              className="btn-outline flex-1 justify-center disabled:opacity-50"
            >
              {submitting === "checkout" ? "Preparando…" : "Comprar ahora"}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-ink/50">
            Los ingredientes básicos (agua, sal, huevos, albahaca fresca, ajo) no están en este
            pedido — conseguilos en tu verdulería o almacén.
          </p>
        </div>
      </div>
    </section>
  );
}
