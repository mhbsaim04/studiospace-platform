"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { StudioCard, StudioCardSkeleton } from "@/components/studio-card";
import { api, errMsg } from "@/lib/api";
import type { Studio } from "@/lib/types";

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Studio[]>("/studios/featured").then(setStudios).catch((e) => setError(errMsg(e)));
  }, []);

  if (error) return <EmptyState icon={SearchX} title="We couldn't load studios" description={`${error} Make sure the API server is running.`} actionLabel="Try again" onAction={() => location.reload()} />;
  if (!studios) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <StudioCardSkeleton key={i} />)}</div>;
  if (!studios.length) return <EmptyState icon={SearchX} title="No studios listed yet" description="Be the first host on StudioSpace and list your creative space." actionLabel="Add New Studio" href="/add-studio" />;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{studios.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
      <div className="mt-10 text-center"><Button variant="outline" size="lg" asChild><Link href="/studios">See all studios</Link></Button></div>
    </>
  );
}
