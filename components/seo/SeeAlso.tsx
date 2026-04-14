import Link from "next/link";

export interface SeeAlsoItem {
  href: string;
  label: string;
  /** Small caps text above the label, e.g. "Receta", "Guía", "Marca". */
  eyebrow?: string;
  /** Optional longer description shown under the label. */
  description?: string;
}

interface Props {
  items: SeeAlsoItem[];
  heading?: string;
  eyebrow?: string;
  className?: string;
}

/**
 * Generic "Ver también" block: a centered heading plus a responsive grid of
 * linked cards. Used on PDPs, category pages and recipe pages to cross-link
 * recipes ↔ products ↔ categories ↔ brands ↔ guides for SEO depth.
 */
export function SeeAlso({
  items,
  heading = "Ver también",
  eyebrow = "Ver también",
  className = "",
}: Props) {
  if (items.length === 0) return null;
  return (
    <section className={`border-t border-ink/10 bg-ivory-100 py-14 lg:py-20 ${className}`}>
      <div className="container-x mx-auto max-w-4xl">
        <div className="text-center">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-3 font-serif text-2xl text-ink sm:text-3xl">{heading}</h2>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={`${it.href}-${it.label}`}>
              <Link
                href={it.href}
                className="group flex h-full flex-col border border-ink/15 bg-ivory-50 p-5 transition hover:border-ink"
              >
                {it.eyebrow && (
                  <span className="eyebrow text-[10px] text-ink/50">{it.eyebrow}</span>
                )}
                <span className="mt-2 font-serif text-lg text-ink group-hover:underline">
                  {it.label}
                </span>
                {it.description && (
                  <span className="mt-2 text-sm leading-relaxed text-ink/60">
                    {it.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
