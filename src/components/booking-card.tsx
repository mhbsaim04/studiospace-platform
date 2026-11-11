import Link from "next/link";
import { CalendarDays, Clock, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { StatusBadge } from "@/components/status-badge";
import type { Booking, BookingStatus } from "@/lib/types";
import { formatDate, money } from "@/lib/utils";

export interface BookingAction { label: string; status: BookingStatus; variant?: "default" | "outline" | "destructive" }

export function BookingCard({ booking: b, perspective, actions, onAction, onInvoice }: {
  booking: Booking; perspective: "guest" | "host"; actions: BookingAction[];
  onAction: (b: Booking, a: BookingAction) => void; onInvoice: (b: Booking) => void;
}) {
  const showInvoice = b.status === "Confirmed" || b.status === "Completed";
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card sm:flex-row">
      <SafeImage src={b.studioImage} alt="" className="aspect-[16/9] w-full sm:aspect-auto sm:w-44 sm:shrink-0" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/studios/${b.studioId}`} className="text-lg font-bold leading-snug hover:text-primary">{b.studioTitle}</Link>
          <StatusBadge status={b.status} />
        </div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><CalendarDays className="size-4" /> {formatDate(b.date)}</li>
          <li className="flex items-center gap-2"><Clock className="size-4" /> {b.startTime} - {b.endTime} ({b.hours} hr)</li>
          <li className="flex items-center gap-2"><MapPin className="size-4" /> {b.studioLocation}</li>
        </ul>
        <p className="text-sm">
          {perspective === "host" ? <>Requested by <span className="font-semibold">{b.guestName}</span> ({b.guestEmail})</> : <>Hosted by <span className="font-semibold">{b.hostName}</span></>}
        </p>
        {b.notes && <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">&ldquo;{b.notes}&rdquo;</p>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <p className="mr-auto text-lg font-extrabold">{money(b.totalPrice)}<span className="text-xs font-medium text-muted-foreground"> + {money(b.securityDeposit)} deposit</span></p>
          {showInvoice && <Button size="sm" variant="outline" onClick={() => onInvoice(b)}><Download /> Invoice</Button>}
          {actions.map((a) => <Button key={a.label} size="sm" variant={a.variant ?? "outline"} onClick={() => onAction(b, a)}>{a.label}</Button>)}
        </div>
      </div>
    </article>
  );
}
