"use client";
import { useState } from "react";
import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

/** <img> with a graceful placeholder if the URL fails to load. */
export function SafeImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} className={cn("grid place-items-center bg-gradient-to-br from-secondary to-muted text-muted-foreground", className)}>
        <Aperture className="size-10 opacity-40" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn("object-cover", className)} />;
}
