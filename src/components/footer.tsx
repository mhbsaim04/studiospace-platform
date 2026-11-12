"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/icons";
import { categoryPlural, CATEGORIES } from "@/lib/constants";

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
          <Logo variant="footer" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            StudioSpace is where idle rooms become working studios — cyc walls, vocal booths, sound stages and design suites,
            all bookable by the hour at prices you see before you commit.
          </p>
          <div className="flex gap-2">
            {[
              { href: "https://x.com", label: "StudioSpace on X", Icon: XIcon },
              { href: "https://facebook.com", label: "StudioSpace on Facebook", Icon: FacebookIcon },
              { href: "https://instagram.com", label: "StudioSpace on Instagram", Icon: InstagramIcon },
              { href: "https://linkedin.com", label: "StudioSpace on LinkedIn", Icon: LinkedinIcon },
            ].map(({ href, label, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}
                className="grid size-9 place-items-center rounded-full border text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
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
              <li key={c}><Link href={`/studios?category=${encodeURIComponent(c)}`} className="hover:text-foreground">{categoryPlural(c)}</Link></li>
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
