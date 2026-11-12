"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/container";
import { BOOKING_STEPS, PLATFORM_ASSURANCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CYCLE_MS = 2600;
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

/** Section 1 — How booking works. Steps auto-highlight in sequence with a progress
 *  bar; hovering (or focusing) a card pins it to that step. Arrows connect the
 *  cards on desktop. Everything reveals with a staggered rise when scrolled to. */
export function BookingStepsSection() {
  const { ref, inView } = useInView<HTMLOListElement>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reducedMotion()) return;
    const t = setInterval(() => setActive((a) => (a + 1) % BOOKING_STEPS.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Step by step</p>
      <SectionHeading title="How booking works" subtitle="From first search to first take in four steps." className="mb-8" />
      <ol ref={ref} className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4" onMouseLeave={() => setPaused(false)}>
        {BOOKING_STEPS.map((s, i) => (
          <li
            key={s.title}
            tabIndex={0}
            onMouseEnter={() => { setActive(i); setPaused(true); }}
            onFocus={() => { setActive(i); setPaused(true); }}
            onBlur={() => setPaused(false)}
            style={inView ? { animationDelay: `${i * 110}ms` } : undefined}
            className={cn(
              "reveal group relative flex h-full flex-col rounded-xl border bg-card p-6 outline-offset-4 transition-[border-color,box-shadow,transform] duration-300",
              "hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10 focus-visible:-translate-y-1 focus-visible:border-primary/70",
              inView && "is-visible",
              active === i ? "border-primary shadow-md shadow-primary/10" : "border-border"
            )}
          >
            {i < BOOKING_STEPS.length - 1 && (
              <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full border bg-background text-primary shadow-sm lg:grid">
                <ArrowRight className="size-4" />
              </span>
            )}
            <span className={cn("absolute right-5 top-4 font-display text-4xl font-extrabold transition-colors", active === i ? "text-primary/25" : "text-muted")}>
              {i + 1}
            </span>
            <span className={cn(
              "mb-5 grid size-12 place-items-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6",
              active === i ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            )}>
              <s.icon className="size-6" />
            </span>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            <span className="mt-auto block pt-5">
              <span className="block h-1 w-full overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                  style={{ width: active === i ? "100%" : "0%" }}
                />
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Section 2 (shared by home + how-it-works): platform assurances.
 *  `hostCta` shows the "Add New Studio" call-to-action — used on the how-it-works page. */
export function AssurancesSection({ hostCta = false }: { hostCta?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Trust & safety</p>
      <SectionHeading title="Host guarantee & creator support" subtitle="Platform assurances so hosts and creators can focus on the work." className="mb-8" />
      <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_ASSURANCES.map((g, i) => (
          <div
            key={g.title}
            style={inView ? { animationDelay: `${i * 110}ms` } : undefined}
            className={cn(
              "reveal group flex h-full flex-col rounded-xl border bg-card p-5 transition-[border-color,box-shadow,transform] duration-300",
              "hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10",
              inView && "is-visible"
            )}
          >
            <span className="mb-5 grid size-12 place-items-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <g.icon className="size-6" />
            </span>
            <h3 className="text-lg font-bold">{g.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{g.text}</p>
          </div>
        ))}
      </div>
      {hostCta && (
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Ready to earn from your space? Click the{" "}
          <span className="font-semibold text-primary">Add New Studio</span> button in your account menu to list it in minutes.
        </p>
      )}
    </div>
  );
}
