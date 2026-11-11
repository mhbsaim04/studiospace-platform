"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthLink, AuthShell, OrDivider } from "@/components/auth-shell";
import { GoogleButton } from "@/components/google-button";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

function validatePassword(pw: string): string {
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter.";
  if (pw.length < 6) return "Password must be at least 6 characters long.";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [pwError, setPwError] = useState("");
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

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book studios, host your own space and manage everything in one place."
      footer={<>Already registered? <AuthLink href="/login">Log in</AuthLink></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div><Label htmlFor="name">Name</Label><Input id="name" required value={form.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" /></div>
        <div><Label htmlFor="image">Photo URL</Label><Input id="image" type="url" value={form.image} onChange={set("image")} placeholder="https://..." /></div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={form.password} onChange={set("password")} placeholder="Min 6 chars, Aa" autoComplete="new-password" aria-invalid={!!pwError} />
          {pwError ? <p role="alert" className="mt-1.5 text-sm text-destructive">{pwError}</p> : <p className="mt-1.5 text-xs text-muted-foreground">At least 6 characters with one uppercase and one lowercase letter.</p>}
        </div>
        <Button type="submit" className="w-full" disabled={busy || !form.name || !form.email}>{busy && <Spinner />} Register</Button>
      </form>
      <OrDivider />
      <GoogleButton redirectTo="/" />
    </AuthShell>
  );
}
