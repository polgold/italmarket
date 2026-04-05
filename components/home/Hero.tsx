"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Parallax hero with three layers that transition as the user scrolls:
 *
 *   Layer 1 — storefront.jpg   (slowest, background)
 *   Layer 2 — hero.mp4 video   (mid-speed, fades in at ~30 %)
 *   Layer 3 — hero-end.png     (fastest, fades in at ~65 %)
 *
 * The section is sticky inside a tall wrapper (280 vh) so the content stays
 * in view while the scroll progress drives transform + opacity per layer.
 */

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const total = wrapper.offsetHeight - window.innerHeight;
        if (total <= 0) { setProgress(0); ticking = false; return; }
        const scrolled = -rect.top;
        setProgress(Math.max(0, Math.min(1, scrolled / total)));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- layer transforms & opacities driven by progress ---
  const storefrontY = progress * -30; // moves up slowly
  const storefrontOpacity = 1 - Math.min(1, progress / 0.4);

  const videoY = progress * -50; // mid-speed
  const videoOpacity = Math.min(1, Math.max(0, (progress - 0.15) / 0.25));
  const videoFadeOut = 1 - Math.min(1, Math.max(0, (progress - 0.6) / 0.3));

  const endY = (1 - progress) * 40; // starts offset, ends at 0
  const endOpacity = Math.min(1, Math.max(0, (progress - 0.55) / 0.3));

  const textY = progress * -80; // text floats up faster
  const textOpacity = 1 - Math.min(1, progress / 0.6);

  // Slight zoom on storefront for depth
  const storefrontScale = 1 + progress * 0.15;

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "280vh" }}>
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        {/* Layer 1 — Storefront photo (background) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${storefrontY}%) scale(${storefrontScale})`,
            opacity: storefrontOpacity,
          }}
        >
          <Image
            src="/images/storefront.jpg"
            alt="Italmarket storefront"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Layer 2 — Video (mid-layer) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${videoY}px)`,
            opacity: videoOpacity * videoFadeOut,
          }}
        >
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-poster.png"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Layer 3 — Hero-end "explosion" (foreground) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${endY}px)`,
            opacity: endOpacity,
          }}
        >
          <Image
            src="/images/hero-end.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/70" />

        {/* Text content */}
        <div
          className="container-x relative z-10 flex h-full flex-col justify-end pb-16 text-ivory-50 sm:justify-center sm:pb-0 will-change-transform"
          style={{
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
          }}
        >
          <div className="max-w-2xl">
            <span className="eyebrow text-ivory-50/80">— Delizie Italiane · Buenos Aires</span>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-[84px]">
              Un viaggio<br />
              <em className="italic text-ivory-50/90">di sapori</em>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory-50/80 sm:text-lg">
              Productos italianos seleccionados uno por uno. Pastas artesanales, aceites de primera
              presión, salumi, formaggi y vinos, directo desde Italia a tu mesa.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/productos" className="btn-primary bg-ivory-50 text-ink hover:bg-ivory-100">
                Explorar la tienda <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/nosotros" className="btn-ghost text-ivory-50/90 hover:text-ivory-50">
                Nuestra historia
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator — fades out as user scrolls */}
        <div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500"
          style={{ opacity: 1 - Math.min(1, progress / 0.1) }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-extra-wide text-ivory-50/50">
              Scroll
            </span>
            <div className="h-8 w-px animate-pulse bg-ivory-50/40" />
          </div>
        </div>

        <div
          className="absolute bottom-6 right-6 z-10 hidden text-[10px] uppercase tracking-extra-wide text-ivory-50/60 sm:block"
          style={{ opacity: textOpacity }}
        >
          Est. 2015 · Barrio Norte & San Telmo
        </div>
      </section>
    </div>
  );
}
