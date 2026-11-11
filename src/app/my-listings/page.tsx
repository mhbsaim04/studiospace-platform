"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, PlusCircle, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Container, PageHeader } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PrivateRoute } from "@/components/private-route";
import { SafeImage } from "@/components/safe-image";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errMsg } from "@/lib/api";
import type { Studio } from "@/lib/types";

function Listings() {
  const [items, setItems] = useState<Studio[] | null>(null);
  const [target, setTarget] = useState<Studio | null>(null);

  useEffect(() => {
    api<Studio[]>("/studios/mine").then(setItems).catch((e) => { toast.error(errMsg(e)); setItems([]); });
  }, []);

  async function remove() {
    if (!target) return;
    try {
      await api(`/studios/${target._id}`, { method: "DELETE" });
      setItems((l) => l?.filter((s) => s._id !== target._id) ?? null);
      toast.success(`"${target.title}" was deleted.`);
    } catch (e) {
      toast.error(errMsg(e));
    }
  }

  return (
    <Container className="py-12">
      <PageHeader title="My studio listings" subtitle="Manage the spaces you host on StudioSpace.">
        <Button asChild><Link href="/add-studio"><PlusCircle /> Add New Studio</Link></Button>
      </PageHeader>

      {!items ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={Store} title="You haven't listed a studio yet" description="Share your space with creators and start earning from the hours it sits empty." actionLabel="Add New Studio" href="/add-studio" />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/60 text-muted-foreground">
              <tr><th className="p-4 font-semibold">Studio</th><th className="p-4 font-semibold">Category</th><th className="p-4 font-semibold">Rate</th><th className="p-4 font-semibold">Rating</th><th className="p-4 text-right font-semibold">Actions</th></tr>
            </thead>
            <tbody className="divide-y">
              {items.map((s) => (
                <tr key={s._id}>
                  <td className="p-4">
                    <Link href={`/studios/${s._id}`} className="flex items-center gap-3 font-semibold hover:text-primary">
                      <SafeImage src={s.image} alt="" className="size-14 shrink-0 rounded-md" />
                      <span className="line-clamp-2">{s.title}</span>
                    </Link>
                  </td>
                  <td className="p-4"><Badge variant="secondary">{s.category}</Badge></td>
                  <td className="p-4 font-semibold">${s.hourlyRate} / hr</td>
                  <td className="p-4">{s.reviewCount ? `${s.rating.toFixed(1)} (${s.reviewCount})` : "No reviews"}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild><Link href={`/studios/edit/${s._id}`}><Pencil /> Update</Link></Button>
                      <Button size="sm" variant="destructive" onClick={() => setTarget(s)}><Trash2 /> Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        onOpenChange={(o) => !o && setTarget(null)}
        title="Delete this studio?"
        description={`"${target?.title ?? ""}" will be permanently removed and its pending booking requests will be cancelled. This cannot be undone.`}
        confirmLabel="Delete studio"
        onConfirm={remove}
      />
    </Container>
  );
}

export default function MyListingsPage() {
  return <PrivateRoute><Listings /></PrivateRoute>;
}
