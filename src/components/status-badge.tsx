import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/types";

const VARIANT = { Pending: "pending", Confirmed: "confirmed", Completed: "completed", Cancelled: "cancelled" } as const;

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>;
}
