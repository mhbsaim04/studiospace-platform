import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand PNGs (public/StudioSpace_nav_logo.png, public/StudioSpace_footer_logo.png)
 * are 1672x941 with transparent padding around the artwork (content occupies the
 * middle ~76%), so the rendered box reads slightly smaller than its dimensions.
 */
export function Logo({ variant = "nav", className }: { variant?: "nav" | "footer"; className?: string }) {
  return (
    <Link href="/" aria-label="StudioSpace home" className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src={variant === "footer" ? "/StudioSpace_footer_logo.png" : "/StudioSpace_nav_logo.png"}
        alt="StudioSpace"
        width={1672}
        height={941}
        priority={variant === "nav"}
        className={variant === "footer" ? "h-32 w-auto" : "h-16 w-auto"}
      />
    </Link>
  );
}
