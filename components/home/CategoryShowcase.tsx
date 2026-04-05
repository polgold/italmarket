import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">La nostra casa</span>
          <h2 className="mt-4 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">Explorá por categoría</h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            Un recorrido por las regiones italianas. Cada categoría es una curaduría de productores
            y etiquetas que representan lo mejor de la tradición.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((cat, i) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              className={`group relative block overflow-hidden bg-ivory-100 ${
                i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className={`relative ${i === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-[4/5]"}`}>
                {cat.image?.src && (
                  <Image
                    src={cat.image.src}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-ivory-50">
                  <span className="eyebrow text-ivory-50/70">{cat.count} etiquetas</span>
                  <h3 className="mt-2 font-serif text-3xl lg:text-4xl">{cat.name}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory-50/80">{cat.description}</p>
                  <span className="mt-4 inline-block text-[11px] uppercase tracking-extra-wide underline-offset-4 group-hover:underline">
                    Descubrir →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
