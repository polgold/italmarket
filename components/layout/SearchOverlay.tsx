"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { formatPrice } from "@/lib/utils";

interface SearchItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
}

/**
 * Typeahead search that queries /api/search, which proxies the WC Store API.
 * Debounced 200ms, minimum 2 chars, cancels in-flight requests with
 * AbortController so old responses never overwrite newer ones.
 */
export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setItems([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { items: SearchItem[] };
        setItems(data.items || []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          console.error("search failed", e);
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setItems([]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar productos"
        className="text-ink/80 hover:text-ink"
      >
        <SearchIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ivory-50/98 backdrop-blur">
          <div className="border-b border-ink/10">
            <div className="container-x flex items-center gap-4 py-6">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar pastas, aceites, vinos…"
                className="flex-1 bg-transparent font-serif text-2xl text-ink placeholder:text-ink/30 focus:outline-none sm:text-3xl"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar búsqueda"
                className="text-ink/60 hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="container-x py-10">
              {query.trim().length < 2 ? (
                <p className="text-center text-[11px] uppercase tracking-extra-wide text-ink/40">
                  Escribí al menos 2 caracteres
                </p>
              ) : loading && items.length === 0 ? (
                <p className="text-center text-[11px] uppercase tracking-extra-wide text-ink/40">
                  Buscando…
                </p>
              ) : items.length === 0 ? (
                <p className="text-center text-[11px] uppercase tracking-extra-wide text-ink/40">
                  Sin resultados para &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul className="mx-auto max-w-3xl divide-y divide-ink/10">
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/productos/${item.slug}`}
                        onClick={close}
                        className="flex items-center gap-4 py-4 transition hover:bg-ivory-100"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-ivory-100">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-lg text-ink">{item.name}</p>
                          <p className="text-sm text-ink/60">{formatPrice(item.price)}</p>
                        </div>
                        <span className="text-[11px] uppercase tracking-extra-wide text-ink/40">
                          Ver →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
