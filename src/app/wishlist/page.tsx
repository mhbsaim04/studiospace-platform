"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { Container, PageHeader } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PrivateRoute } from "@/components/private-route";
import { StudioCard, StudioCardSkeleton } from "@/components/studio-card";
import { api, errMsg } from "@/lib/api";
import type { Studio } from "@/lib/types";

function Wishlist() {
  const { wishlistIds } = useAuth();
  const [items, setItems] = useState<Studio[] | null>(null);

  useEffect(() => {
    api<Studio[]>("/wishlist").then(setItems).catch((e) => { toast.error(errMsg(e)); setItems([]); });
  }, []);

  // Un-hearting a card removes it from the page right away.
  const visible = items?.filter((s) => wishlistIds.includes(s._id));

  return (
    <Container className="py-12">
      <PageHeader title="Saved studios" subtitle="Your shortlist of spaces to book later." />
      {!visible ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <StudioCardSkeleton key={i} />)}</div>
      ) : visible.length === 0 ? (
        <EmptyState icon={Heart} title="Nothing saved yet" description="Tap the heart on any studio to keep it here for later." actionLabel="Explore Studios" href="/studios" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
      )}
    </Container>
  );
}

export default function WishlistPage() {
  return <PrivateRoute><Wishlist /></PrivateRoute>;
}
