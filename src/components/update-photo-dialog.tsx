"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/spinner";
import { useAuth } from "@/components/auth-provider";
import { authClient } from "@/lib/auth-client";

/** Google Drive share links return an HTML page, not image bytes — rewrite them to Drive's direct-render thumbnail URL. */
function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  const drive = /drive\.google\.com\/file\/d\/([^/]+)/.exec(trimmed);
  return drive ? `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w400` : trimmed;
}

/** Account-menu item + dialog for setting or replacing the profile photo (no re-login needed). */
export function UpdatePhotoDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  function onOpenChange(next: boolean) {
    if (next) setUrl(user?.image ?? "");
    setOpen(next);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const image = normalizeImageUrl(url);
    if (image && !/^https?:\/\/\S+$/i.test(image)) return toast.error("Photo URL must start with http:// or https://");
    setBusy(true);
    const { error } = await authClient.updateUser({ image: image || null });
    setBusy(false);
    if (error) return toast.error(error.message || "We couldn't update your photo. Please try again.");
    toast.success(image ? "Profile photo updated." : "Profile photo removed.");
    setOpen(false);
  }

  return (
    <>
      <DropdownMenuItem onSelect={() => onOpenChange(true)}>
        <Camera /> Update photo
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Profile photo</DialogTitle>
            <DialogDescription>Paste an image URL (https://…). Google Drive share links are converted automatically.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4" noValidate>
            <div className="flex items-center gap-4">
              <Avatar className="size-16 ring-2 ring-primary/70">
                {url.trim() && <AvatarImage src={normalizeImageUrl(url)} alt="Preview" referrerPolicy="no-referrer" />}
                <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "S"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="photo-url">Image URL</Label>
                <Input id="photo-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="mt-1" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Leave the field empty and save to remove your photo and show your initial instead.</p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={busy}>{busy && <Spinner />} Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
