import { cn } from "@/lib/utils";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const base = "h-5 w-5 stroke-current";

export function SearchIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function BagIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <path d="M5 8h14l-1 12H6L5 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InstagramIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function WhatsappIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <path d="M20 12a8 8 0 1 1-3.2-6.4L20 4l-1.4 3.2A8 8 0 0 1 20 12z" strokeLinejoin="round" />
      <path d="M8.5 9.5c.5 2.5 2.5 4.5 5 5l1.5-1.5 2 1-.5 2c-4 0-8-4-8-8l2-.5 1 2-1.5 1z" strokeLinejoin="round" />
    </svg>
  );
}

export function MapPinIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} className={cn(base, className)} {...rest}>
      <path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
