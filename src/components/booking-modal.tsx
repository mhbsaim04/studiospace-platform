"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { api, errMsg } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { money, todayISO } from "@/lib/utils";

const TIMES = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

export function BookingModal({ studio, open, onOpenChange }: { studio: Studio; open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("12:00");
  const [notes, setNotes] = useState("");
  const [taken, setTaken] = useState<{ startTime: string; endTime: string }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !date) return;
    api<{ startTime: string; endTime: string }[]>(`/studios/${studio._id}/availability?date=${date}`).then(setTaken).catch(() => setTaken([]));
  }, [open, date, studio._id]);

  const hours = useMemo(() => (toMin(end) - toMin(start)) / 60, [start, end]);
  const total = hours > 0 ? hours * studio.hourlyRate : 0;
  const overlaps = taken.some((t) => toMin(start) < toMin(t.endTime) && toMin(end) > toMin(t.startTime));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (hours < 1) return setError("Choose an end time at least 1 hour after the start time.");
    setBusy(true);
    try {
      await api("/bookings", { method: "POST", json: { studioId: studio._id, date, startTime: start, endTime: end, notes } });
      toast.success("Booking request sent. The host will confirm shortly.");
      onOpenChange(false);
      router.push("/my-bookings");
    } catch (err) {
      setError(errMsg(err));
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {studio.title}</DialogTitle>
          <DialogDescription>Pick your date and hours. Your request is Pending until the host confirms it.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div><Label htmlFor="b-date">Date</Label><Input id="b-date" type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="b-start">Start time</Label><Select id="b-start" value={start} onChange={(e) => setStart(e.target.value)}>{TIMES.map((t) => <option key={t}>{t}</option>)}</Select></div>
            <div><Label htmlFor="b-end">End time</Label><Select id="b-end" value={end} onChange={(e) => setEnd(e.target.value)}>{TIMES.map((t) => <option key={t}>{t}</option>)}</Select></div>
          </div>

          {taken.length > 0 && (
            <div className="rounded-md border bg-muted/60 p-3 text-sm">
              <p className="font-medium">Already confirmed on this date</p>
              <p className="mt-1 text-muted-foreground">{taken.map((t) => `${t.startTime} - ${t.endTime}`).join(", ")}</p>
            </div>
          )}
          {overlaps && (
            <p role="alert" className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" /> Your selected hours overlap with a confirmed booking. Choose a different slot.
            </p>
          )}

          <div><Label htmlFor="b-notes">Notes for the host (optional)</Label><Textarea id="b-notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="Crew size, equipment you're bringing, load-in time..." className="min-h-20" /></div>

          <dl className="space-y-1.5 rounded-md border p-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{money(studio.hourlyRate)} x {hours > 0 ? hours : 0} hr</dt><dd className="font-semibold">{money(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Refundable security deposit</dt><dd className="font-semibold">{money(studio.securityDeposit)}</dd></div>
          </dl>
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy || overlaps}>{busy && <Spinner />} Send booking request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
