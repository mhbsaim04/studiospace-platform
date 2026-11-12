"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BadgeCheck, CalendarDays, Check, ChevronLeft, ChevronRight, Heart, Images,
  MapPin, SearchX, ShieldCheck, Star, Users,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel";
import { useAuth } from "@/components/auth-provider";
import { BookingModal } from "@/components/booking-modal";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { SafeImage } from "@/components/safe-image";
import { PageSpinner, Spinner } from "@/components/spinner";
import { api, ApiError, errMsg } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { cn, money } from "@/lib/utils";

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex", className)} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={cn("size-4", i <= Math.round(value) ? "fill-tungsten text-tungsten" : "text-border")} />)}
    </span>
  );
}

/** Prev / dots / next row rendered BELOW the slides (not overlaid on the sides). */
function GalleryControls({ total }: { total: number }) {
  const { api, scrollPrev, scrollNext } = useCarousel();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (total <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <Button variant="outline" size="icon" className="rounded-full" onClick={scrollPrev} aria-label="Previous photo">
        <ChevronLeft />
      </Button>
      <div className="flex items-center gap-1.5" aria-label={`Photo ${index + 1} of ${total}`}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30")} />
        ))}
      </div>
      <span className="text-xs font-semibold tabular-nums text-muted-foreground">{index + 1} / {total}</span>
      <Button variant="outline" size="icon" className="rounded-full" onClick={scrollNext} aria-label="Next photo">
        <ChevronRight />
      </Button>
    </div>
  );
}

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, wishlistIds, toggleWishlist } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(() => {
    api<Studio>(`/studios/${id}`).then(setStudio).catch((e) => {
      if (e instanceof ApiError && (e.status === 404 || e.status === 400)) setNotFound(true);
      else toast.error(errMsg(e));
    });
  }, [id]);
  useEffect(load, [load]);

  if (notFound) return <Container className="py-16"><EmptyState icon={SearchX} title="Studio not found" description="This listing may have been removed by its host." actionLabel="Explore Studios" href="/studios" /></Container>;
  if (!studio) return <PageSpinner />;

  const isOwner = user?.email === studio.ownerEmail;
  const saved = wishlistIds.includes(studio._id);
  const gallery = [studio.image, ...(studio.gallery ?? [])].filter((v, i, a) => v && a.indexOf(v) === i);

  function book() {
    if (!user) {
      toast.info("Log in to book this studio.");
      return router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
    }
    if (isOwner) return toast.error("You cannot book your own studio.");
    setBookOpen(true);
  }

  async function postReview(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    try {
      await api(`/studios/${id}/reviews`, { method: "POST", json: { rating: Number(rating), comment } });
      toast.success("Thanks for your review!");
      setComment("");
      load();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setPosting(false);
    }
  }

  const facts = [
    { icon: Star, label: "Hourly rate", value: `${money(studio.hourlyRate)} / hr` },
    { icon: ShieldCheck, label: "Security deposit", value: money(studio.securityDeposit) },
    { icon: Users, label: "Max capacity", value: `${studio.maxCapacity} people` },
    { icon: CalendarDays, label: "Listed", value: new Date(studio.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
  ];

  // Staggered rise-in on mount (CSS: .reveal.is-visible in globals.css).
  const stagger = (i: number) => ({ animationDelay: `${i * 90}ms` });

  return (
    <Container className="py-8 sm:py-10">
      {/* Gallery */}
      <section className="reveal is-visible">
        <Carousel opts={{ loop: true }} className="relative">
          <CarouselContent className="aspect-[16/9]">
            {gallery.map((src, i) => (
              <CarouselItem key={src}>
                <SafeImage src={src} alt={`${studio.title} photo ${i + 1}`} className="size-full rounded-2xl border shadow-lg shadow-black/5" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <span className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            {studio.category}
          </span>
          <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Images className="size-3.5" /> {gallery.length} photo{gallery.length === 1 ? "" : "s"}
          </span>
          <GalleryControls total={gallery.length} />
        </Carousel>
      </section>

      {/* Title row */}
      <section className="reveal is-visible mt-8 flex flex-wrap items-start justify-between gap-4" style={stagger(1)}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{studio.category}</Badge>
            <span className="flex items-center gap-2 text-sm">
              <Stars value={studio.rating} />
              <span className="font-semibold">{studio.reviewCount ? studio.rating.toFixed(1) : "New"}</span>
              <span className="text-muted-foreground">({studio.reviewCount} review{studio.reviewCount === 1 ? "" : "s"})</span>
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{studio.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-4 text-primary" /> {studio.location}</p>
        </div>
        <button
          onClick={() => toggleWishlist(studio._id)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          title={saved ? "Remove from wishlist" : "Save to wishlist"}
          className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border bg-card transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
        >
          <Heart className={cn("size-5", saved && "fill-primary text-primary")} />
        </button>
      </section>

      {/* Quick facts */}
      <section className="reveal is-visible mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" style={stagger(2)}>
        {facts.map((f) => (
          <div key={f.label} className="flex h-full items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/60">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
              <f.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{f.label}</p>
              <p className="truncate font-bold">{f.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          {/* About */}
          <section className="reveal is-visible" style={stagger(3)}>
            <h2 className="mb-3 font-display text-2xl font-bold tracking-tight">About this space</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{studio.overview}</p>
          </section>

          {/* Amenities */}
          <section className="reveal is-visible mt-10" style={stagger(4)}>
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">Amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {studio.amenities.map((a) => (
                <li key={a} className="flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary/60">
                  <Check className="size-4 text-primary" /> {a}
                </li>
              ))}
              {studio.amenities.length === 0 && <li className="text-sm text-muted-foreground">The host has not listed amenities yet.</li>}
            </ul>
          </section>

          {/* Reviews */}
          <section className="reveal is-visible mt-10" style={stagger(5)}>
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">Reviews</h2>
            <div className="mb-6 flex flex-wrap items-center gap-6 rounded-2xl border bg-card p-6">
              <div className="text-center">
                <p className="font-display text-5xl font-extrabold leading-none">{studio.reviewCount ? studio.rating.toFixed(1) : "—"}</p>
                <Stars value={studio.rating} className="mt-2 justify-center" />
              </div>
              <div className="border-l pl-6">
                <p className="font-semibold">{studio.reviewCount} review{studio.reviewCount === 1 ? "" : "s"} from verified bookings</p>
                <p className="mt-1 text-sm text-muted-foreground">Creators who shot here share how the space, light and gear held up.</p>
              </div>
            </div>
            {studio.reviews?.length ? (
              <ul className="space-y-4">
                {studio.reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9"><AvatarImage src={r.userImage} alt="" referrerPolicy="no-referrer" /><AvatarFallback>{r.userName[0]}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-semibold">{r.userName}</p><Stars value={r.rating} /></div>
                      <time className="ml-auto text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No reviews yet. Book this studio and be the first to leave one.</p>}

            {user && !isOwner && (
              <form onSubmit={postReview} className="mt-6 space-y-3 rounded-xl border bg-card p-5">
                <h3 className="text-lg font-bold">Leave a review</h3>
                <Select value={rating} onChange={(e) => setRating(e.target.value)} aria-label="Rating" className="max-w-40">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                </Select>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the space, the light, the gear, the host?" required minLength={5} />
                <Button type="submit" disabled={posting}>{posting && <Spinner />} Post review</Button>
              </form>
            )}
          </section>
        </div>

        {/* Booking card */}
        <aside className="reveal is-visible lg:sticky lg:top-24 lg:self-start" style={stagger(2)}>
          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-lg shadow-primary/5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">From</p>
              <p className="mt-1">
                <span className="font-display text-4xl font-extrabold text-primary">{money(studio.hourlyRate)}</span>
                <span className="text-base font-medium text-muted-foreground"> / hr</span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" /> Plus {money(studio.securityDeposit)} refundable security deposit
              </p>
            </div>
            <Button size="lg" className="w-full" onClick={book}>Book Workspace Now</Button>
            <Button variant="outline" className="w-full" onClick={() => toggleWishlist(studio._id)}>
              <Heart className={cn(saved && "fill-primary text-primary")} /> {saved ? "Saved to wishlist" : "Save to wishlist"}
            </Button>
            {isOwner && <Button variant="secondary" className="w-full" asChild><Link href={`/studios/edit/${studio._id}`}>Edit this listing</Link></Button>}
            <div className="border-t pt-5">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
                Hosted by <BadgeCheck className="size-4 text-primary" aria-label="Verified host" />
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="size-11 ring-2 ring-primary/60"><AvatarImage src={studio.ownerImage} alt="" referrerPolicy="no-referrer" /><AvatarFallback>{studio.ownerName[0]}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="font-semibold">{studio.ownerName}</p><p className="truncate text-xs text-muted-foreground">{studio.ownerEmail}</p></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <BookingModal studio={studio} open={bookOpen} onOpenChange={setBookOpen} />
    </Container>
  );
}
