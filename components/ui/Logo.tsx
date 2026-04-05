import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  const color = variant === "light" ? "text-ivory-50" : "text-ink";
  return (
    <Link href="/" aria-label="Italmarket — inicio" className={cn("inline-flex flex-col items-center leading-none", color, className)}>
      <span className="font-serif text-[26px] tracking-[0.18em] sm:text-[30px]">ITALMARKET</span>
      <span className="mt-1 text-[8px] font-sans uppercase tracking-extra-wide opacity-80 sm:text-[9px]">Delizie Italiane</span>
    </Link>
  );
}
