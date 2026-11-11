"use client";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { SafeImage } from "@/components/safe-image";
import type { Studio } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StudioCard({ studio }: { studio: Studio }) {
  const { wishlistIds, toggleWishlist } = useAuth();
  const saved = wishlistIds.includes(studio._id);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md">
      <div className="relative `aspect-4/3` overflow-hidden">
        <SafeImage src={studio.image} alt={studio.title} className="size-full transition-transform duration-500 group-hover:scale-105" />
        <Badge variant="outline" className="absolute left-3 top-3">{studio.category}</Badge>
        <button
          onClick={() => toggleWishlist(studio._id)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid size-9 cursor-pointer place-items-center rounded-full bg-card/90 shadow backdrop-blur transition-transform hover:scale-110"
        >
          <Heart className={cn("size-4", saved && "fill-primary text-primary")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 `min-h-13` text-lg font-bold leading-snug">{studio.title}</h3>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-tungsten/15 px-2 py-1 text-xs font-bold">
            <Star className="size-3.5 fill-tungsten text-tungsten" />
            {studio.reviewCount ? studio.rating.toFixed(1) : "New"}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" /> <span className="line-clamp-1">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-xl font-extrabold">${studio.hourlyRate}<span className="text-sm font-medium text-muted-foreground"> / hr</span></p>
          <Button asChild size="sm"><Link href={`/studios/${studio._id}`}>View Details</Link></Button>
        </div>
      </div>
    </article>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex justify-between pt-4"><div className="h-6 w-20 animate-pulse rounded bg-muted" /><div className="h-8 w-24 animate-pulse rounded bg-muted" /></div>
      </div>
    </div>
  );
}
