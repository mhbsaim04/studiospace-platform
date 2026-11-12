import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/container";
import { BookingStepsSection, AssurancesSection } from "@/components/section-blocks";

export const metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <Container className="py-14">
      <PageHeader title="How StudioSpace works" subtitle="One simple flow for creators who need a room, and hosts who have one to share." />

      {/* Section 1: How Booking Works */}
      <section>
        <BookingStepsSection />
      </section>

      {/* Section 2: Host Guarantee & Creator Support */}
      <section className="mt-20">
        <AssurancesSection hostCta />
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" asChild><Link href="/studios">Explore Studios</Link></Button>
        <Button size="lg" variant="outline" asChild><Link href="/add-studio">Add New Studio</Link></Button>
      </div>
    </Container>
  );
}
