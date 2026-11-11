"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, Heart, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";
import { BookingModal } from "@/components/booking-modal";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { SafeImage } from "@/components/safe-image";
import { PageSpinner, Spinner } from "@/components/spinner";
import { api, ApiError, errMsg } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { cn, money } from "@/lib/utils";
import { SearchX } from "lucide-react";

function Stars({ value }: { value: number }) {
  return (
    <span className="flex" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={cn("size-4", i <= Math.round(value) ? "fill-tungsten text-tungsten" : "text-border")} />)}
    </span>
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

  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <Swiper className="gallery-swiper aspect-[16/10] overflow-hidden rounded-xl border" modules={[Pagination]} pagination={{ clickable: true }}>
            {gallery.map((src, i) => (
              <SwiperSlide key={src}><SafeImage src={src} alt={`${studio.title} photo ${i + 1}`} className="size-full" /></SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{studio.category}</Badge>
            <span className="flex items-center gap-2 text-sm">
              <Stars value={studio.rating} />
              <span className="font-semibold">{studio.reviewCount ? studio.rating.toFixed(1) : "New"}</span>
              <span className="text-muted-foreground">({studio.reviewCount} review{studio.reviewCount === 1 ? "" : "s"})</span>
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{studio.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-4" /> {studio.location}</p>

          <section className="mt-8 grid grid-cols-3 gap-3">
            {[[Users, "Capacity", `${studio.maxCapacity} people`], [ShieldCheck, "Security deposit", money(studio.securityDeposit)], [Star, "Hourly rate", `${money(studio.hourlyRate)} / hr`]].map(([Icon, label, value]) => {
              const I = Icon as typeof Users;
              return <div key={label as string} className="rounded-xl border bg-card p-4"><I className="mb-2 size-5 text-primary" /><p className="text-xs text-muted-foreground">{label as string}</p><p className="font-bold">{value as string}</p></div>;
            })}
          </section>

          <section className="mt-10">
            <h2 className="mb-3 text-2xl font-bold">About this space</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{studio.overview}</p>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold">Amenities</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {studio.amenities.map((a) => <li key={a} className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary" /> {a}</li>)}
              {studio.amenities.length === 0 && <li className="text-sm text-muted-foreground">The host has not listed amenities yet.</li>}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold">Reviews</h2>
            {studio.reviews?.length ? (
              <ul className="space-y-4">
                {studio.reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9"><AvatarImage src={r.userImage} alt="" /><AvatarFallback>{r.userName[0]}</AvatarFallback></Avatar>
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

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-xl border bg-card p-6">
            <p className="text-3xl font-extrabold">{money(studio.hourlyRate)}<span className="text-base font-medium text-muted-foreground"> / hr</span></p>
            <Button size="lg" className="w-full" onClick={book}>Book Workspace Now</Button>
            <Button variant="outline" className="w-full" onClick={() => toggleWishlist(studio._id)}>
              <Heart className={cn(saved && "fill-primary text-primary")} /> {saved ? "Saved to wishlist" : "Save to wishlist"}
            </Button>
            {isOwner && <Button variant="secondary" className="w-full" asChild><Link href={`/studios/edit/${studio._id}`}>Edit this listing</Link></Button>}
            <div className="border-t pt-5">
              <p className="mb-3 text-sm font-semibold">Hosted by</p>
              <div className="flex items-center gap-3">
                <Avatar className="size-11"><AvatarImage src={studio.ownerImage} alt="" /><AvatarFallback>{studio.ownerName[0]}</AvatarFallback></Avatar>
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
