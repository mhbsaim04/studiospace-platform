"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, DollarSign, Heart, Inbox, PlusCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth-provider";
import { Container, PageHeader } from "@/components/container";
import { PrivateRoute } from "@/components/private-route";
import { api } from "@/lib/api";
import { money } from "@/lib/utils";

interface Stats { listings: number; reservations: number; pendingRequests: number; saved: number; earnings: number }

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { api<Stats>("/stats").then(setStats).catch(() => setStats({ listings: 0, reservations: 0, pendingRequests: 0, saved: 0, earnings: 0 })); }, []);

  const cards = stats && [
    { icon: Store, label: "Active listings", value: stats.listings, href: "/my-listings" },
    { icon: CalendarClock, label: "My reservations", value: stats.reservations, href: "/my-bookings" },
    { icon: Inbox, label: "Requests awaiting you", value: stats.pendingRequests, href: "/my-bookings" },
    { icon: Heart, label: "Saved studios", value: stats.saved, href: "/wishlist" },
    { icon: DollarSign, label: "Host earnings", value: money(stats.earnings), href: "/my-bookings" },
  ];

  return (
    <Container className="py-12">
      <PageHeader title={`Welcome back, ${user?.name?.split(" ")[0] ?? "creator"}`} subtitle="Your studios, reservations and requests at a glance.">
        <Button asChild><Link href="/add-studio"><PlusCircle /> Add New Studio</Link></Button>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {!cards ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32" />) : cards.map((c) => (
          <Link key={c.label} href={c.href} className="flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:border-primary">
            <c.icon className="mb-4 size-6 text-primary" />
            <p className="font-display text-3xl font-extrabold">{c.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default function DashboardPage() {
  return <PrivateRoute><Dashboard /></PrivateRoute>;
}
