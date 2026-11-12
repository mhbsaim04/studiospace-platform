"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";

const SLIDES = [
  { image: "/heroslider-images/heroslider_1.jpg", take: "Take 1", label: "Plan & Book", title: "Plan it. Book it. Shoot it.", text: "From storyboard to call sheet — shortlist the right room, lock your hours and get back to the creative work." },
  { image: "/heroslider-images/heroslider_2.jpg", take: "Take 2", label: "Sound Stages", title: "Sound stages built for serious productions", text: "Blackout stages, lighting grids and green screens, bookable by the hour with live availability before you commit." },
  { image: "/heroslider-images/heroslider_3.jpg", take: "Take 3", label: "Podcast Rooms", title: "Record, stream and mix in treated rooms", text: "Podcast lounges, vocal booths and full tracking suites with the gear already on the stand." },
  { image: "/heroslider-images/heroslider_4.jpg", take: "Take 4", label: "Photo Studios", title: "Find the room your next shoot deserves", text: "Cyc walls, daylight lofts and strobe-ready sets, bookable by the hour from hosts who know their light." },
  { image: "/heroslider-images/heroslider_5.jpg", take: "Take 5", label: "Design & Motion", title: "Design & Motion rooms for digital craft", text: "Design systems, 3D software and animation toolkits in ready-to-roll digital setups." },
];

export function HeroSlider() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-black" aria-label="Featured studio highlights">
      <Swiper
        className="hero-swiper h-[560px] sm:h-[640px]"
        modules={[Autoplay, Keyboard]}
        direction="vertical"
        speed={700}
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        keyboard={{ enabled: true }}
        onSwiper={(s) => { swiperRef.current = s; }}
        onSlideChange={(s) => setActive(s.realIndex)}
      >
        {SLIDES.map((s, i) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-full">
              <SafeImage src={s.image} alt={s.title} className="hero-ken-burns absolute inset-0 size-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
              {/* Viewfinder frame */}
              <div className="pointer-events-none absolute inset-5 sm:inset-8" aria-hidden="true">
                {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
                  <span key={c} className={`absolute size-7 border-white/70 ${c}`} />
                ))}
                <span className="absolute right-3 top-3 flex items-center gap-2 text-xs font-semibold text-white sm:right-6 sm:top-5">
                  <span className="tally-dot size-2.5 rounded-full bg-primary" /> REC &middot; {s.take}
                </span>
                <span className="absolute bottom-3 right-3 text-xs font-semibold tabular-nums text-white/70 sm:bottom-5 sm:right-6">
                  {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                </span>
              </div>
              <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-6 sm:px-10 lg:px-12">
                <div className="hero-copy max-w-2xl text-white">
                  <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">{s.title}</h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button size="lg" asChild><Link href="/studios">Explore Studios</Link></Button>
                    <Button size="lg" variant="outline" asChild className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-black">
                      <Link href="/add-studio">Host Your Space</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom navigation strip: numbered items + vertical prev/next pill */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
        <div className="mx-auto flex max-w-7xl items-stretch gap-3 px-4 pb-4 pt-12 sm:px-10 lg:px-12">
          <div className="grid flex-1 grid-cols-5 gap-2 sm:gap-3">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={active === i ? "true" : undefined}
                className={`group cursor-pointer border-t-2 pt-3 text-left transition-colors ${active === i ? "border-primary" : "border-white/25 hover:border-white/60"}`}
              >
                <span className={`grid size-6 place-items-center rounded-full border text-[11px] font-bold transition-colors ${active === i ? "border-primary bg-primary text-white" : "border-white/40 text-white/70 group-hover:border-white/70 group-hover:text-white"}`}>
                  {i + 1}
                </span>
                <span className={`mt-2 hidden text-xs font-semibold leading-snug sm:block ${active === i ? "text-white" : "text-white/60 group-hover:text-white/90"}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-col self-center overflow-hidden rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="grid size-10 cursor-pointer place-items-center text-white transition-colors hover:bg-primary"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="grid size-10 cursor-pointer place-items-center text-white transition-colors hover:bg-primary"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
