import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/container";

export const metadata = { title: "How it works" };

const CREATOR = [
  ["Search and filter", "Browse every studio, narrow by category, price range or keyword, and save favourites with the heart icon."],
  ["Choose your hours", "Open a studio, pick a date and a start and end time. You will see already-confirmed slots and the total price."],
  ["Send the request", "Your booking is saved as Pending. The host reviews it and confirms, usually within a few hours."],
  ["Show up and create", "Confirmed bookings can be downloaded as a PDF invoice. If plans change, cancel any pending booking."],
];
const HOST = [
  ["List your space", "Add photos, amenities, your hourly rate and a security deposit in a single form."],
  ["Review requests", "Incoming requests appear in My Bookings. Confirm, decline or mark sessions as completed."],
  ["Stay conflict-free", "The platform checks every request against your confirmed bookings so double-booking never happens."],
];

export default function HowItWorksPage() {
  return (
    <Container className="py-14">
      <PageHeader title="How StudioSpace works" subtitle="One simple flow for creators who need a room, and hosts who have one to share." />
      <div className="grid gap-8 lg:grid-cols-2">
        {[["For creators", CREATOR], ["For hosts", HOST]].map(([heading, items]) => (
          <section key={heading as string} className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="mb-6 text-2xl font-bold">{heading as string}</h2>
            <ol className="space-y-6">
              {(items as string[][]).map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <div><h3 className="text-lg font-bold">{t}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d}</p></div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" asChild><Link href="/studios">Explore Studios</Link></Button>
        <Button size="lg" variant="outline" asChild><Link href="/add-studio">Add New Studio</Link></Button>
      </div>
    </Container>
  );
}
