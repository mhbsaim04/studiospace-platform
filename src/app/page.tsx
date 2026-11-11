import Link from "next/link";
import { Camera, Clapperboard, Mic, Palette, Shapes } from "lucide-react";
import { Container, SectionHeading } from "@/components/container";
import { FeaturedStudios } from "@/components/featured-studios";
import { HeroSlider } from "@/components/hero-slider";
import { BookingStepsSection, AssurancesSection } from "@/components/section-blocks";
import { CATEGORY_CARDS } from "@/lib/constants";

const ICONS = { camera: Camera, clapperboard: Clapperboard, mic: Mic, shapes: Shapes, palette: Palette };

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <section className="pt-20">
        <Container>
          <SectionHeading title="Featured studios" subtitle="Our top-rated and newest spaces, ready to book this week." />
          <FeaturedStudios />
        </Container>
      </section>

      <section className="pt-24">
        <Container>
          <SectionHeading title="Browse by studio category" subtitle="Jump straight to the kind of room your project needs." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_CARDS.map((c) => {
              const Icon = ICONS[c.icon];
              return (
                <Link key={c.value} href={`/studios?category=${encodeURIComponent(c.value)}`}
                  className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:border-primary">
                  <span className="mb-5 grid size-12 place-items-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="text-lg font-bold">{c.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="how-booking-works" className="scroll-mt-24 pt-24">
        <Container>
          <BookingStepsSection />
        </Container>
      </section>

      <section id="host-guarantee" className="scroll-mt-24 pt-24">
        <Container>
          <AssurancesSection />
        </Container>
      </section>
    </>
  );
}
