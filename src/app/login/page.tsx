"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthLink, AuthShell, OrDivider } from "@/components/auth-shell";
import { GoogleButton } from "@/components/google-button";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const params = useSearchParams();
  const raw = params.get("redirect") || "/";
  const redirect = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      const msg = error.message || "Invalid email or password.";
      setError(msg);
      toast.error(msg);
      setBusy(false);
      return;
    }
    toast.success("Welcome back to StudioSpace!");
    // A full navigation guarantees the session + JWT cookie are fresh before any private route renders.
    setTimeout(() => window.location.assign(redirect), 600);
  }

  return (
    <AuthShell
      title="Log in to StudioSpace"
      subtitle="Welcome back. Pick up where you left off."
      footer={<>New to StudioSpace? <AuthLink href="/register">Create an account</AuthLink></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => toast.info("Password reset is not available yet. Contact support if you are locked out.")}>
              Forgot password?
            </button>
          </div>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
        </div>
        {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy && <Spinner />} Login</Button>
      </form>
      <OrDivider />
      <GoogleButton redirectTo={redirect} />
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
