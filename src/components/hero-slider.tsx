"use client";
import Link from "next/link";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";

const SLIDES = [
  { image: "/heroslider-images/heroslider_1.jpg", take: "Take 1", title: "Plan it. Book it. Shoot it.", text: "From storyboard to call sheet — shortlist the right room, lock your hours and get back to the creative work." },
  { image: "/heroslider-images/heroslider_2.jpg", take: "Take 2", title: "Sound stages built for serious productions", text: "Blackout stages, lighting grids and green screens, bookable by the hour with live availability before you commit." },
  { image: "/heroslider-images/heroslider_3.jpg", take: "Take 3", title: "Record, stream and mix in treated rooms", text: "Podcast lounges, vocal booths and full tracking suites with the gear already on the stand." },
  { image: "/heroslider-images/heroslider_4.jpg", take: "Take 4", title: "Find the room your next shoot deserves", text: "Cyc walls, daylight lofts and strobe-ready sets, bookable by the hour from hosts who know their light." },
];

export function HeroSlider() {
  return (
    <section className="relative bg-black" aria-label="Featured studio highlights">
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-[560px] sm:h-[640px]">
              <SafeImage src={s.image} alt={s.title} className="absolute inset-0 size-full" />
              <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/10" />
              {/* Viewfinder frame */}
              <div className="pointer-events-none absolute inset-5 sm:inset-8" aria-hidden="true">
                {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
                  <span key={c} className={`absolute size-7 border-white/70 ${c}`} />
                ))}
                <span className="absolute right-3 top-3 flex items-center gap-2 text-xs font-semibold text-white sm:right-6 sm:top-5">
                  <span className="tally-dot size-2.5 rounded-full bg-primary" /> REC &middot; {s.take}
                </span>
              </div>
              <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-6 sm:px-10 lg:px-12">
                <div className="max-w-2xl text-white">
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
    </section>
  );
}
