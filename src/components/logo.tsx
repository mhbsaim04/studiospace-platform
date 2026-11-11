import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-display text-xl font-extrabold tracking-tight", className)}>
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <Aperture className="size-5" />
      </span>
      StudioSpace
    </Link>
  );
}
