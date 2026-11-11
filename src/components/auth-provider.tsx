"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, errMsg } from "@/lib/api";
import { TOKEN_ROUTE } from "@/lib/constants";
import type { Studio } from "@/lib/types";

interface AuthUser { id: string; name: string; email: string; image?: string | null }
interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  wishlistIds: string[];
  toggleWishlist: (studioId: string) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [synced, setSynced] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const userId = session?.user?.id;

  // Whenever the Better Auth session changes, refresh the HTTPOnly JWT cookie used by the Express API.
  // `loading` stays true until that is done, so reloading a private route never bounces to /login.
  useEffect(() => {
    if (isPending) return;
    let cancelled = false;
    if (!userId) {
      setWishlistIds([]);
      setSynced(true);
      fetch(TOKEN_ROUTE, { method: "DELETE" }).catch(() => {});
      return;
    }
    setSynced(false);
    fetch(TOKEN_ROUTE, { cache: "no-store" })
      .then(() => api<Studio[]>("/wishlist"))
      .then((items) => !cancelled && setWishlistIds(items.map((s) => s._id)))
      .catch(() => {})
      .finally(() => !cancelled && setSynced(true));
    return () => { cancelled = true; };
  }, [isPending, userId]);

  const logout = useCallback(async () => {
    await fetch(TOKEN_ROUTE, { method: "DELETE" }).catch(() => {});
    await authClient.signOut();
    toast.success("You have been logged out.");
    router.push("/");
  }, [router]);

  const toggleWishlist = useCallback(async (studioId: string) => {
    if (!userId) {
      toast.info("Log in to save studios to your wishlist.");
      router.push("/login");
      return;
    }
    try {
      const { saved } = await api<{ saved: boolean }>(`/wishlist/${studioId}`, { method: "POST" });
      setWishlistIds((ids) => (saved ? [...ids, studioId] : ids.filter((id) => id !== studioId)));
      toast.success(saved ? "Saved to your wishlist." : "Removed from your wishlist.");
    } catch (e) {
      toast.error(errMsg(e));
    }
  }, [userId, router]);

  const value = useMemo<AuthCtx>(
    () => ({ user: session?.user ?? null, loading: isPending || (!!userId && !synced), logout, wishlistIds, toggleWishlist }),
    [session, isPending, userId, synced, logout, wishlistIds, toggleWishlist]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
