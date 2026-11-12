"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  Camera,
  Clock,
  Clapperboard,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/container";
import { SafeImage } from "@/components/safe-image";
import { cn } from "@/lib/utils";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Adds .is-visible once the element scrolls into view (one-shot, unobserves after). */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/** Scroll-reveal wrapper with an optional stagger delay. */
function Reveal({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
      className={cn("reveal", inView && "is-visible", className)}
    >
      {children}
    </div>
  );
}

/** Counts up from 0 to `to` (ease-out cubic) when scrolled into view. */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reducedMotion()) {
      const t = requestAnimationFrame(() => setVal(to));
      return () => cancelAnimationFrame(t);
    }
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 350, suffix: "+", label: "studios listed" },
  { value: 1200, suffix: "+", label: "hours booked" },
  { value: 5, suffix: "", label: "creative categories" },
  { value: 98, suffix: "%", label: "would book again" },
];

const MILESTONES = [
  {
    year: "2024",
    icon: Lightbulb,
    title: "The empty-room problem",
    text: "A photographer needs a cyc wall for two hours while a perfectly good one sits empty down the road. A podcaster needs a treated room on Thursday. That gap is where StudioSpace started.",
  },
  {
    year: "2025",
    icon: Rocket,
    title: "The marketplace opens",
    text: "Hosts begin listing their rooms, setting their own rates and approving every request themselves. Creators get live availability and book the exact hours they need.",
  },
  {
    year: "Today",
    icon: Clapperboard,
    title: "Five categories and counting",
    text: "Photo, video, podcast, design and workshop spaces are live — with transparent pricing on every listing and a booking flow that takes minutes, not phone calls.",
  },
];

const VALUES = [
  {
    icon: BadgeDollarSign,
    title: "Transparent pricing",
    text: "Hourly rates and security deposits are shown up front. No service-fee surprises at checkout.",
  },
  {
    icon: Sparkles,
    title: "Creators first",
    text: "We build tools for people who make things: photographers, filmmakers, podcasters, musicians and artists.",
  },
  {
    icon: ShieldCheck,
    title: "Trust through verification",
    text: "Verified accounts, clear booking statuses and host approval keep every session accountable.",
  },
];

export function AboutShowcase() {
  return (
    <Container className="py-12 sm:py-16">
      {/* ============ Hero: story + framed studio visual ============ */}
      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">About StudioSpace</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] sm:text-5xl">
              Every creator is{" "}
              <span className="bg-linear-to-r from-primary to-tungsten bg-clip-text text-transparent">one great room</span>{" "}
              away.
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                StudioSpace started with a familiar problem: a photographer needs a cyc wall for two hours, while a perfectly
                good one sits empty down the road. A podcaster needs a treated room on Thursday. A potter has a kiln with free
                slots.
              </p>
              <p>
                We connect those people. Hosts list their rooms, set their own rates and approve every request. Creators
                discover spaces, check live availability and book the exact hours they need.
              </p>
            </div>
          </Reveal>
          <Reveal delay={270}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/studios">Find a studio</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Framed studio shot with viewfinder overlay + floating glass chips */}
        <Reveal delay={150} className="relative">
          <div aria-hidden className="about-blob absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl">
            <SafeImage
              src="/heroslider-images/heroslider_4.jpg"
              alt="A bright cyc-wall photo studio ready for a shoot"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" aria-hidden />
            <div aria-hidden className="pointer-events-none absolute inset-4">
              {[
                "left-0 top-0 border-l-2 border-t-2",
                "right-0 top-0 border-r-2 border-t-2",
                "bottom-0 left-0 border-b-2 border-l-2",
                "bottom-0 right-0 border-b-2 border-r-2",
              ].map((c) => (
                <span key={c} className={cn("absolute size-6 border-white/70", c)} />
              ))}
              <span className="absolute right-2 top-2 flex items-center gap-2 text-[11px] font-semibold text-white">
                <span className="tally-dot size-2 rounded-full bg-primary" /> REC &middot; 00:47
              </span>
            </div>
            <p className="absolute bottom-4 left-5 text-xs font-semibold text-white/85">
              <Camera className="mr-1.5 inline size-3.5" />
              Cyc-wall studio &middot; Photo category
            </p>
          </div>

          <div className="about-float absolute -left-2 top-10 flex items-center gap-3 rounded-xl border border-border bg-background/90 px-4 py-3 shadow-xl backdrop-blur sm:-left-6">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Clock className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-bold">Book in minutes</span>
              <span className="block text-xs text-muted-foreground">Live availability, hourly rates</span>
            </span>
          </div>
          <div className="about-float about-float-delay absolute -bottom-5 right-2 flex items-center gap-3 rounded-xl border border-border bg-background/90 px-4 py-3 shadow-xl backdrop-blur sm:-right-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-bold">Verified hosts</span>
              <span className="block text-xs text-muted-foreground">Every request reviewed</span>
            </span>
          </div>
        </Reveal>
      </section>

      {/* ============ Animated stat counters ============ */}
      <section className="mt-20 sm:mt-24">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-card p-6 text-center sm:p-8">
                <p className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ Timeline: the story so far ============ */}
      <section className="mt-20 sm:mt-24">
        <Reveal>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">The story so far</p>
          <SectionHeading title="From an empty soundstage to a full marketplace" className="mb-10" />
        </Reveal>
        <div className="relative max-w-3xl">
          <div
            aria-hidden
            className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-primary/70 via-border to-transparent"
          />
          <ol className="space-y-8">
            {MILESTONES.map((m, i) => (
              <li key={m.title}>
                <Reveal delay={i * 130}>
                  <div className="group relative pl-14">
                    <span className="absolute left-0 top-4 z-10 grid size-8 place-items-center rounded-full border border-primary/60 bg-background text-primary shadow-md transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <m.icon className="size-4" />
                    </span>
                    <div className="rounded-xl border bg-card p-6 transition-[border-color,box-shadow] duration-300 group-hover:border-primary/70 group-hover:shadow-lg group-hover:shadow-primary/10">
                      <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                        {m.year}
                      </span>
                      <h3 className="mt-3 text-lg font-bold">{m.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ Values ============ */}
      <section className="mt-20 sm:mt-24">
        <Reveal>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">What we stand for</p>
          <SectionHeading title="Three things we never compromise" className="mb-10" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 110}>
              <div className="group relative h-full overflow-hidden rounded-xl border bg-card p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-tungsten transition-transform duration-300 group-hover:scale-x-100"
                />
                <span className="mb-5 grid size-12 place-items-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <v.icon className="size-6" />
                </span>
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA band ============ */}
      <section className="mt-20 sm:mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center sm:p-14">
            <div aria-hidden className="about-blob absolute -left-16 -top-16 size-56 rounded-full bg-primary/20 blur-3xl" />
            <div
              aria-hidden
              className="about-blob about-float-delay absolute -bottom-20 -right-10 size-64 rounded-full bg-tungsten/15 blur-3xl"
            />
            <h2 className="relative text-3xl font-bold leading-tight sm:text-4xl">Your next shoot deserves the right room.</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-base text-muted-foreground">
              Browse live availability, compare rates and lock your hours in minutes.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/studios">Explore Studios</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/add-studio">Host Your Space</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </Container>
  );
}
