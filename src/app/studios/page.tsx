"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Container, PageHeader } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { StudioCard, StudioCardSkeleton } from "@/components/studio-card";
import { api, errMsg } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { Paged, Studio } from "@/lib/types";
import { cn } from "@/lib/utils";

function Explore() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";
  const maxPrice = params.get("maxPrice") || "";
  const page = Number(params.get("page")) || 1;
  const q = params.get("search") || "";

  const [searchText, setSearchText] = useState(q);
  const [data, setData] = useState<Paged<Studio> | null>(null);
  const [error, setError] = useState("");

  const update = useCallback((patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v && v !== "all" ? next.set(k, v) : next.delete(k)));
    if (!("page" in patch)) next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [params, pathname, router]);

  // Debounce the search box
  useEffect(() => {
    if (searchText === q) return;
    const t = setTimeout(() => update({ search: searchText.trim() }), 400);
    return () => clearTimeout(t);
  }, [searchText, q, update]);

  useEffect(() => {
    setData(null);
    setError("");
    const qs = new URLSearchParams({ sort, page: String(page), limit: "9" });
    if (category !== "all") qs.set("category", category);
    if (q) qs.set("search", q);
    if (maxPrice) qs.set("maxPrice", maxPrice);
    api<Paged<Studio>>(`/studios?${qs}`).then(setData).catch((e) => setError(errMsg(e)));
  }, [category, sort, maxPrice, page, q]);

  const clear = () => { setSearchText(""); router.replace(pathname); };

  return (
    <Container className="py-12">
      <PageHeader title="Explore studios" subtitle="Search every creative space on StudioSpace and book the hours you need." />

      <div className="mb-8 space-y-4 rounded-xl border bg-card p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by name, city or amenity" className="pl-9" aria-label="Search studios" />
          </div>
          <Select value={maxPrice} onChange={(e) => update({ maxPrice: e.target.value })} aria-label="Maximum hourly rate">
            <option value="">Any hourly rate</option>
            <option value="30">Up to $30 / hr</option>
            <option value="50">Up to $50 / hr</option>
            <option value="80">Up to $80 / hr</option>
            <option value="120">Up to $120 / hr</option>
          </Select>
          <Select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort studios">
            <option value="newest">Newest first</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["all", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => update({ category: c })} aria-pressed={category === c}
              className={cn("cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors", category === c ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent")}>
              {c === "all" ? "All categories" : c}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <EmptyState icon={SearchX} title="We couldn't load studios" description={`${error} Make sure the API server is running.`} actionLabel="Reload" onAction={() => location.reload()} />
      ) : !data ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <StudioCardSkeleton key={i} />)}</div>
      ) : data.items.length === 0 ? (
        <EmptyState icon={SearchX} title="No studios match your search" description="Try a different keyword, widen the price range or choose another category." actionLabel="Clear filters" onAction={clear} />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{data.total} studio{data.total === 1 ? "" : "s"} found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
          {data.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button variant="outline" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}><ChevronLeft /> Previous</Button>
              <span className="text-sm text-muted-foreground">Page {data.page} of {data.pages}</span>
              <Button variant="outline" disabled={page >= data.pages} onClick={() => update({ page: String(page + 1) })}>Next <ChevronRight /></Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default function StudiosPage() {
  return <Suspense><Explore /></Suspense>;
}
