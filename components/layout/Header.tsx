"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { BagIcon, MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

interface HeaderCategory {
  slug: string;
  name: string;
}

interface HeaderProps {
  featuredCategories?: HeaderCategory[];
}

const staticLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/recetas", label: "Recetas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/sucursales", label: "Sucursales" },
];

function toTitleCase(s: string) {
  return s.toLowerCase().replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());
}

export function Header({ featuredCategories = [] }: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const navLinks = [
    staticLinks[0],
    ...featuredCategories.map((c) => ({
      href: `/productos?categoria=${c.slug}`,
      label: toTitleCase(c.name),
    })),
    ...staticLinks.slice(1),
  ];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "bg-ivory-50/95 backdrop-blur-md shadow-[0_1px_0_rgba(14,14,12,0.06)]" : "bg-ivory-50",
      )}
    >
      <div className="container-x">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center py-5 lg:py-7">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              className="lg:hidden text-ink"
            >
              <MenuIcon />
            </button>
            <div className="hidden lg:inline-flex">
              <SearchOverlay />
            </div>
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-5 text-ink">
            <Link href="/contacto" className="hidden text-[11px] uppercase tracking-extra-wide lg:inline-block link-underline">
              Contacto
            </Link>
            <button onClick={openCart} aria-label="Abrir carrito" className="relative">
              <BagIcon />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bosco-700 px-1 text-[10px] font-medium text-ivory-50">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-ink/10 py-3 lg:block">
          <ul className="flex items-center justify-center gap-10">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[11px] uppercase tracking-extra-wide text-ink/80 transition hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-ivory-50 transition-transform duration-500 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-5">
          <Logo />
          <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
            <CloseIcon />
          </button>
        </div>
        <nav className="px-6 py-8">
          <ul className="flex flex-col gap-5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-6 border-t border-ink/10 pt-6">
              <Link
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="text-[12px] uppercase tracking-extra-wide text-ink/80"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
