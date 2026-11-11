import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Aperture className={cn("size-5 animate-spin", className)} aria-label="Loading" />;
}

/** Branded full-area loader used for route transitions and auth checks. */
export function PageSpinner({ label = "Loading the studio floor..." }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Aperture className="size-8 animate-spin [animation-duration:2.2s]" />
        </span>
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
