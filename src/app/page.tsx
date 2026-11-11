import Link from "next/link";
import { BadgeCheck, CalendarCheck, Camera, Clapperboard, Clock, Headset, Mic, Palette, Search, Shapes, ShieldCheck, Wrench } from "lucide-react";
import { Container, SectionHeading } from "@/components/container";
import { FeaturedStudios } from "@/components/featured-studios";
import { HeroSlider } from "@/components/hero-slider";
import { CATEGORY_CARDS } from "@/lib/constants";

const ICONS = { camera: Camera, clapperboard: Clapperboard, mic: Mic, shapes: Shapes, palette: Palette };

const STEPS = [
  { icon: Search, title: "Discover spaces", text: "Filter by category, price and city to shortlist rooms that fit your shoot." },
  { icon: Clock, title: "Select shoot hours", text: "Pick a date and time range. Live availability and the full price show before you commit." },
  { icon: CalendarCheck, title: "Book instantly", text: "Send your request in one tap. Hosts confirm quickly and overlapping slots are blocked." },
  { icon: Clapperboard, title: "Create and produce", text: "Arrive, plug in and roll. Download your invoice once the booking is confirmed." },
];

const GUARANTEES = [
  { icon: ShieldCheck, title: "Liability protection", text: "Every confirmed booking is covered by our host and creator liability terms." },
  { icon: BadgeCheck, title: "Verified profiles", text: "Hosts and creators sign in with verified accounts, so you know who is on set." },
  { icon: Wrench, title: "Equipment safety", text: "Listed gear is inspected by hosts, and security deposits protect both sides." },
  { icon: Headset, title: "24/7 host support", text: "Real people answer booking questions at any hour, including pre-dawn call times." },
];

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

      <section className="pt-24">
        <Container>
          <SectionHeading title="How booking works" subtitle="From first search to first take in four steps." />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex h-full flex-col rounded-xl border bg-card p-6">
                <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-muted">{i + 1}</span>
                <span className="mb-5 grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground"><s.icon className="size-6" /></span>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pt-24">
        <Container>
          <div className="rounded-2xl border bg-card p-6 sm:p-10">
            <SectionHeading title="Host guarantee and creator support" subtitle="Everything we do is designed so hosts and creators can focus on the work." />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {GUARANTEES.map((g) => (
                <div key={g.title}>
                  <g.icon className="mb-4 size-8 text-primary" />
                  <h3 className="text-lg font-bold">{g.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{g.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
