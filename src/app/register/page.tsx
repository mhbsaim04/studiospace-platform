"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Handshake, Rocket, Users } from "lucide-react";
import { AuthLink, OrDivider } from "@/components/auth-shell";
import { GoogleButton } from "@/components/google-button";
import { SafeImage } from "@/components/safe-image";
import { Spinner } from "@/components/spinner";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const POSTER = "/StudioSpace%20Creative%20Studio%20Poster.png";

function validatePassword(pw: string): string {
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter.";
  if (pw.length < 6) return "Password must be at least 6 characters long.";
  return "";
}

/** 0–3 strength score: length, mixed case, digits/symbols or long pass-phrase. */
function passwordScore(pw: string): number {
  if (!pw) return 0;
  return [pw.length >= 6, /[A-Z]/.test(pw) && /[a-z]/.test(pw), /\d/.test(pw) || /[^A-Za-z0-9]/.test(pw) || pw.length >= 10].filter(Boolean).length;
}

const STRENGTH = [
  { label: "Too weak", bar: "bg-destructive" },
  { label: "Okay", bar: "bg-tungsten" },
  { label: "Good", bar: "bg-primary" },
  { label: "Strong", bar: "bg-primary" },
];

/** Left brand panel: the StudioSpace poster with a viewfinder overlay and floating pillar chips. */
function RegisterVisual() {
  return (
    <div className="relative h-full">
      <div aria-hidden className="about-blob absolute -inset-x-6 -top-6 bottom-0 rounded-[2.5rem] bg-primary/10 blur-3xl" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border shadow-2xl">
        <SafeImage
          src={POSTER}
          alt="StudioSpace — peer-to-peer creative workspace and production studio sharing platform"
          className="aspect-[16/10] w-full flex-1 object-cover object-top sm:aspect-[4/3] lg:aspect-auto lg:min-h-[560px]"
        />
        {/* Viewfinder frame + REC tally for the cinematic feel */}
        <div aria-hidden className="pointer-events-none absolute inset-4 sm:inset-5">
          {[
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "bottom-0 left-0 border-b-2 border-l-2",
            "bottom-0 right-0 border-b-2 border-r-2",
          ].map((c) => (
            <span key={c} className={cn("absolute size-6 border-white/70", c)} />
          ))}
          <span className="absolute right-2 top-2 flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <span className="tally-dot size-2 rounded-full bg-primary" /> REC &middot; JOIN TODAY
          </span>
          <span className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-sm">
            Share &middot; Create &middot; Inspire
          </span>
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
      </div>

      {/* Floating pillar chips (echoing the poster's promises) */}
      <div className="about-float absolute -left-2 top-12 hidden items-center gap-2.5 rounded-xl border border-border bg-background/90 px-3.5 py-2.5 shadow-xl backdrop-blur sm:flex lg:-left-6">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Users className="size-4" />
        </span>
        <span className="text-sm font-bold">Share Studios</span>
      </div>
      <div className="about-float about-float-delay absolute -bottom-4 right-2 hidden items-center gap-2.5 rounded-xl border border-border bg-background/90 px-3.5 py-2.5 shadow-xl backdrop-blur sm:flex lg:-right-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Handshake className="size-4" />
        </span>
        <span className="text-sm font-bold">Collaborate Together</span>
      </div>
      <div className="about-float absolute -right-2 top-1/3 hidden items-center gap-2.5 rounded-xl border border-border bg-background/90 px-3.5 py-2.5 shadow-xl backdrop-blur lg:flex xl:-right-6">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Rocket className="size-4" />
        </span>
        <span className="text-sm font-bold">Grow Together</span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [pwError, setPwError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (k === "password") setPwError(e.target.value ? validatePassword(e.target.value) : "");
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pe = validatePassword(form.password);
    setPwError(pe);
    if (pe) return toast.error(pe);
    if (form.image && !/^https?:\/\/\S+$/i.test(form.image)) return toast.error("Photo URL must start with http:// or https://");

    setBusy(true);
    const { error } = await authClient.signUp.email({ name: form.name.trim(), email: form.email.trim(), password: form.password, image: form.image.trim() || undefined });
    setBusy(false);
    if (error) return toast.error(error.message || "We couldn't create your account. Try a different email.");
    toast.success("Account created. Please log in to continue.");
    router.push("/login");
  }

  const score = passwordScore(form.password);

  return (
    <Container className="grid gap-10 py-10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2 lg:gap-16 lg:pb-0">
      <div className="order-2 self-stretch lg:order-1 lg:h-full">
        <RegisterVisual />
      </div>

      {/* ============ Form ============ */}
      <div className="order-1 mx-auto w-full max-w-md self-center lg:order-2 lg:py-10">
        <div
          className="relative overflow-hidden rounded-2xl border bg-card shadow-xl"
          style={{ animation: "hero-rise .6s ease-out both" }}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-tungsten to-primary" />
          <div className="p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary" style={{ animation: "hero-rise .6s ease-out .08s both" }}>
              Get started
            </p>
            <h1 className="mt-2 text-3xl font-extrabold" style={{ animation: "hero-rise .6s ease-out .16s both" }}>
              Create your account
            </h1>
            <p className="mb-6 mt-2 text-sm text-muted-foreground" style={{ animation: "hero-rise .6s ease-out .24s both" }}>
              Book studios, host your own space and manage everything in one place.
            </p>

            <form onSubmit={onSubmit} className="space-y-4" noValidate style={{ animation: "hero-rise .6s ease-out .32s both" }}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={form.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
              </div>
              <div>
                <Label htmlFor="image">Photo URL <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <Input id="image" type="url" value={form.image} onChange={set("image")} placeholder="https://..." />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label htmlFor="password" className="mb-0">Password</Label>
                  <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
                    {showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />} {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                <Input id="password" type={showPw ? "text" : "password"} required value={form.password} onChange={set("password")} placeholder="Min 6 chars, Aa" autoComplete="new-password" aria-invalid={!!pwError} />
                {/* Live strength meter */}
                {form.password && !pwError && (
                  <div className="mt-2 flex items-center gap-2" aria-live="polite">
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i < score ? STRENGTH[score].bar : "bg-muted")} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{STRENGTH[score].label}</span>
                  </div>
                )}
                {pwError ? (
                  <p role="alert" className="mt-1.5 text-sm text-destructive">{pwError}</p>
                ) : (
                  !form.password && <p className="mt-1.5 text-xs text-muted-foreground">At least 6 characters with one uppercase and one lowercase letter.</p>
                )}
              </div>
              <Button type="submit" size="lg" className="w-full shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/40" disabled={busy || !form.name || !form.email}>
                {busy && <Spinner />} Register
              </Button>
            </form>

            <OrDivider />
            <GoogleButton redirectTo="/" />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already registered? <AuthLink href="/login">Log in</AuthLink>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
