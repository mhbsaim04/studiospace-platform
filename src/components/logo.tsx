import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Wordmark PNGs (public/nav_logo.png, public/footer_logo.png) are 500x500
 * squares with the artwork centered, so the rendered box is ~3x the visible
 * logo height. The navbar uses negative margins to keep the 64px header tight.
 */
export function Logo({ variant = "nav", className }: { variant?: "nav" | "footer"; className?: string }) {
  return (
    <Link href="/" aria-label="StudioSpace home" className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src={variant === "footer" ? "/footer_logo.png" : "/nav_logo.png"}
        alt="StudioSpace"
        width={500}
        height={500}
        priority={variant === "nav"}
        className={variant === "footer" ? "h-32 w-auto" : "h-[92px] w-auto -my-7"}
      />
    </Link>
  );
}
