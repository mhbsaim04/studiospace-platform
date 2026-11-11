"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, Menu, PlusCircle, Store, CalendarClock, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const MENU = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Store },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarClock },
  { href: "/wishlist", label: "Saved Studios", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                active(l.href) && "text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-primary"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {loading ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-offset-4" aria-label="Open account menu" title={user.name}>
                  <Avatar className="size-9 ring-2 ring-primary/70">
                    {user.image && <AvatarImage src={user.image} alt={user.name} referrerPolicy="no-referrer" />}
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? "S"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-semibold">{user.name}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {MENU.map((m) => (
                  <DropdownMenuItem key={m.href} asChild>
                    <Link href={m.href}><m.icon /> {m.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => logout()} className="text-destructive focus:text-destructive">
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/register">Register</Link></Button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      {open && (
        <div className="border-t bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={cn("rounded-md px-3 py-2.5 text-sm font-medium", active(l.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
                {l.label}
              </Link>
            ))}
            {!loading && !user && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button variant="outline" asChild><Link href="/login" onClick={() => setOpen(false)}>Login</Link></Button>
                <Button asChild><Link href="/register" onClick={() => setOpen(false)}>Register</Link></Button>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
