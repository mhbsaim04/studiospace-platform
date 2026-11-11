"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { XIcon } from "@/components/icons";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  const [email, setEmail] = useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Enter a valid email address to subscribe.");
    toast.success("You're on the list. Watch your inbox for new studio drops.");
    setEmail("");
  }

  return (
    <footer className="mt-24 border-t bg-card">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Our mission is to put every creator within an hour of the right room, from cyc walls to vocal booths, with transparent prices and instant booking.
          </p>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="StudioSpace on X"
            className="inline-grid size-9 place-items-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground">
            <XIcon className="size-4" />
          </a>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">Quick links</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {[["/", "Home"], ["/studios", "Explore Studios"], ["/how-it-works", "How It Works"], ["/about", "About Us"], ["/add-studio", "Host Your Space"]].map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:text-foreground">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">Popular categories</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {CATEGORIES.map((c) => (
              <li key={c}><Link href={`/studios?category=${encodeURIComponent(c)}`} className="hover:text-foreground">{c}s</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">New spaces, every week</h3>
          <form onSubmit={subscribe} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" aria-label="Email address" />
            </div>
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">One short email a week. Unsubscribe whenever you like.</p>
        </div>
      </Container>
      <div className="border-t">
        <Container className="flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our Terms of Service and Privacy Policy.</p>
        </Container>
      </div>
    </footer>
  );
}
