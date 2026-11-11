"use client";
import { useEffect, useState } from "react";
import { CalendarX, Inbox } from "lucide-react";
import { toast } from "sonner";
import { BookingAction, BookingCard } from "@/components/booking-card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Container, PageHeader } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PrivateRoute } from "@/components/private-route";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errMsg } from "@/lib/api";
import { downloadInvoice } from "@/lib/invoice";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";

const HOST_ACTIONS: Record<string, BookingAction[]> = {
  Pending: [{ label: "Confirm", status: "Confirmed", variant: "default" }, { label: "Decline", status: "Cancelled", variant: "destructive" }],
  Confirmed: [{ label: "Mark completed", status: "Completed", variant: "default" }, { label: "Cancel", status: "Cancelled", variant: "destructive" }],
};

function Bookings() {
  const [tab, setTab] = useState<"mine" | "host">("mine");
  const [mine, setMine] = useState<Booking[] | null>(null);
  const [host, setHost] = useState<Booking[] | null>(null);
  const [pending, setPending] = useState<{ b: Booking; a: BookingAction } | null>(null);

  useEffect(() => {
    api<Booking[]>("/bookings/mine").then(setMine).catch((e) => { toast.error(errMsg(e)); setMine([]); });
    api<Booking[]>("/bookings/host").then(setHost).catch(() => setHost([]));
  }, []);

  async function apply({ b, a }: { b: Booking; a: BookingAction }) {
    try {
      await api(`/bookings/${b._id}/status`, { method: "PATCH", json: { status: a.status } });
      const patch = (l: Booking[] | null) => l && l.map((x) => (x._id === b._id ? { ...x, status: a.status } : x));
      setMine(patch);
      setHost(patch);
      toast.success(a.status === "Cancelled" && tab === "mine" ? "Your booking was cancelled." : `Booking marked ${a.status.toLowerCase()}.`);
    } catch (e) {
      toast.error(errMsg(e));
    }
  }

  const list = tab === "mine" ? mine : host;
  const pendingRequests = host?.filter((b) => b.status === "Pending").length ?? 0;

  return (
    <Container className="py-12">
      <PageHeader title="My bookings" subtitle="Track your reservations and respond to requests for the studios you host." />
      <div className="mb-6 inline-flex rounded-lg border bg-card p-1" role="tablist">
        {([["mine", "My reservations"], ["host", `Requests for my studios${pendingRequests ? ` (${pendingRequests})` : ""}`]] as const).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={cn("cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition-colors", tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            {label}
          </button>
        ))}
      </div>

      {!list ? (
        <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52" />)}</div>
      ) : list.length === 0 ? (
        tab === "mine"
          ? <EmptyState icon={CalendarX} title="No bookings yet" description="When you book a studio, your reservation and its status will appear here." actionLabel="Explore Studios" href="/studios" />
          : <EmptyState icon={Inbox} title="No booking requests" description="Requests for your studios will show up here so you can confirm or decline them." actionLabel="Add New Studio" href="/add-studio" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              perspective={tab === "mine" ? "guest" : "host"}
              actions={tab === "mine" ? (b.status === "Pending" ? [{ label: "Cancel Booking", status: "Cancelled", variant: "destructive" }] : []) : HOST_ACTIONS[b.status] ?? []}
              onAction={(bk, a) => (a.status === "Cancelled" ? setPending({ b: bk, a }) : apply({ b: bk, a }))}
              onInvoice={(bk) => downloadInvoice(bk).catch(() => toast.error("We couldn't generate the invoice. Please try again."))}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        title={tab === "mine" ? "Cancel this booking?" : "Cancel this booking request?"}
        description={`${pending?.b.studioTitle ?? ""} on ${pending?.b.date ?? ""}, ${pending?.b.startTime ?? ""} - ${pending?.b.endTime ?? ""}. This frees the time slot and cannot be undone.`}
        confirmLabel={tab === "mine" ? "Cancel booking" : "Yes, cancel"}
        onConfirm={() => (pending ? apply(pending) : undefined)}
      />
    </Container>
  );
}

export default function MyBookingsPage() {
  return <PrivateRoute><Bookings /></PrivateRoute>;
}
