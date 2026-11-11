import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/container";

export const metadata = { title: "About us" };

const VALUES = [
  ["Transparent pricing", "Hourly rates and security deposits are shown up front. No service-fee surprises at checkout."],
  ["Creators first", "We build tools for people who make things: photographers, filmmakers, podcasters, musicians and artists."],
  ["Trust through verification", "Verified accounts, clear booking statuses and host approval keep every session accountable."],
];

export default function AboutPage() {
  return (
    <Container className="py-14">
      <PageHeader title="About StudioSpace" subtitle="A peer-to-peer marketplace that turns idle creative spaces into working studios." />
      <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>StudioSpace started with a familiar problem: a photographer needs a cyc wall for two hours, while a perfectly good one sits empty down the road. A podcaster needs a treated room on Thursday. A potter has a kiln with free slots.</p>
        <p>We connect those people. Hosts list their rooms, set their own rates and approve every request. Creators discover spaces, check live availability and book the exact hours they need.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {VALUES.map(([t, d]) => (
          <div key={t} className="h-full rounded-xl border bg-card p-6">
            <h3 className="text-lg font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <Button size="lg" asChild className="mt-10"><Link href="/studios">Find a studio</Link></Button>
    </Container>
  );
}
