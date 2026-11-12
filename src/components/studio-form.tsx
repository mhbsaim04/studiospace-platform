"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";
import { SafeImage } from "@/components/safe-image";
import { Spinner } from "@/components/spinner";
import { api, errMsg } from "@/lib/api";
import { AMENITY_PRESETS, CATEGORIES } from "@/lib/constants";
import type { Studio } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StudioForm({ studio }: { studio?: Studio }) {
  const router = useRouter();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customAmenity, setCustomAmenity] = useState("");
  const [f, setF] = useState({
    title: studio?.title ?? "",
    category: studio?.category ?? CATEGORIES[0],
    hourlyRate: String(studio?.hourlyRate ?? ""),
    securityDeposit: String(studio?.securityDeposit ?? ""),
    maxCapacity: String(studio?.maxCapacity ?? ""),
    location: studio?.location ?? "",
    image: studio?.image ?? "",
    gallery: [0, 1, 2].map((i) => (studio?.gallery ?? []).filter((g) => g !== studio?.image)[i] ?? ""),
    overview: studio?.overview ?? "",
  });
  const [amenities, setAmenities] = useState<string[]>(studio?.amenities ?? []);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  const setGalleryUrl = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, gallery: p.gallery.map((v, j) => (j === i ? e.target.value : v)) }));
  const toggle = (a: string) => setAmenities((l) => (l.includes(a) ? l.filter((x) => x !== a) : [...l, a]));
  const allAmenities = [...new Set([...AMENITY_PRESETS, ...amenities])];

  async function upload(file?: File) {
    if (!file) return;
    const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
    if (!key) return toast.error("imgbb is not configured. Set NEXT_PUBLIC_IMGBB_KEY or paste an image URL instead.");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image must be smaller than 8 MB.");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error?.message || "Upload failed.");
      setF((p) => ({ ...p, image: json.data.display_url }));
      toast.success("Image uploaded.");
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.image) return toast.error("Add a cover image by uploading one or pasting an image URL.");
    setBusy(true);
    const payload = {
      ...f,
      hourlyRate: Number(f.hourlyRate),
      securityDeposit: Number(f.securityDeposit),
      maxCapacity: Number(f.maxCapacity),
      gallery: [f.image, ...f.gallery.map((s) => s.trim()).filter(Boolean)],
      amenities,
    };
    try {
      if (studio) await api(`/studios/${studio._id}`, { method: "PUT", json: payload });
      else await api("/studios", { method: "POST", json: payload });
      toast.success(studio ? "Studio updated successfully." : "Your studio is live on StudioSpace!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(errMsg(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="grid gap-5 rounded-xl border bg-card p-6 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label htmlFor="title">Title</Label><Input id="title" required minLength={3} value={f.title} onChange={set("title")} placeholder="e.g. Northlight Cyc Wall Studio" /></div>
        <div><Label htmlFor="category">Category</Label><Select id="category" value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></div>
        <div><Label htmlFor="location">Location / address</Label><Input id="location" required value={f.location} onChange={set("location")} placeholder="Street, area, city" /></div>
        <div><Label htmlFor="rate">Hourly rate ($)</Label><Input id="rate" type="number" required min={1} step="0.5" value={f.hourlyRate} onChange={set("hourlyRate")} /></div>
        <div><Label htmlFor="deposit">Security deposit ($)</Label><Input id="deposit" type="number" required min={0} value={f.securityDeposit} onChange={set("securityDeposit")} /></div>
        <div><Label htmlFor="cap">Max capacity (people)</Label><Input id="cap" type="number" required min={1} step={1} value={f.maxCapacity} onChange={set("maxCapacity")} /></div>
        <div className="hidden sm:block" />
        <div><Label htmlFor="hostName">Host name</Label><Input id="hostName" readOnly value={user?.name ?? ""} /></div>
        <div><Label htmlFor="hostEmail">Host email</Label><Input id="hostEmail" readOnly value={user?.email ?? ""} /></div>
      </section>

      <section className="space-y-5 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-bold">Photos</h2>
        <div className="grid gap-5 sm:grid-cols-[1fr_220px]">
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Cover image URL</Label>
              <div className="flex gap-2">
                <Input id="image" type="url" required value={f.image} onChange={set("image")} placeholder="https://..." />
                <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? <Spinner /> : <ImagePlus />} Upload
                </Button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">Upload a file to imgbb or paste any public image link.</p>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <Label htmlFor={`gallery-${i}`}>Extra gallery image URL {i + 1} (optional)</Label>
                <Input id={`gallery-${i}`} type="url" value={f.gallery[i]} onChange={setGalleryUrl(i)} placeholder="https://..." />
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2">
              {f.gallery.map((url, i) => <SafeImage key={i} src={url} alt={`Gallery preview ${i + 1}`} className="aspect-[4/3] w-full rounded-md border" />)}
            </div>
          </div>
          <SafeImage src={f.image} alt="Cover preview" className="aspect-[4/3] w-full rounded-lg border" />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-bold">Amenities</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Amenities">
          {allAmenities.map((a) => (
            <button type="button" key={a} onClick={() => toggle(a)} aria-pressed={amenities.includes(a)}
              className={cn("cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors", amenities.includes(a) ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent")}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex max-w-sm gap-2">
          <Input value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} placeholder="Add your own (e.g. Fog machine)"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("add-amenity")?.click(); } }} />
          <Button id="add-amenity" type="button" variant="outline" onClick={() => { const v = customAmenity.trim(); if (v && !amenities.includes(v)) setAmenities((l) => [...l, v]); setCustomAmenity(""); }}><Plus /> Add</Button>
        </div>
        {amenities.length > 0 && <p className="text-sm text-muted-foreground"><Badge variant="secondary" className="mr-2">{amenities.length}</Badge>selected</p>}
      </section>

      <section className="rounded-xl border bg-card p-6">
        <Label htmlFor="overview">Detailed overview</Label>
        <Textarea id="overview" required minLength={20} value={f.overview} onChange={set("overview")} className="min-h-36" placeholder="Describe the space, the light, the gear and the house rules." />
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={busy || uploading}>{busy && <Spinner />} {studio ? "Save changes" : "Publish studio"}</Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/my-listings")}>Cancel</Button>
      </div>
    </form>
  );
}
