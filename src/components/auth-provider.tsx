"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, errMsg } from "@/lib/api";
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
  // Wishlist state per user id. A user absent from the map = still loading, which is what
  // `loading` derives from — no synchronous setState needed in the effect below.
  const [wishlists, setWishlists] = useState<Record<string, string[]>>({});
  const userId = session?.user?.id;
  const loading = isPending || (!!userId && !(userId in wishlists));

  // All API calls carry the Better Auth session cookies same-origin, which is what the
  // Express API authenticates with. Fetch the user's wishlist once per session.
  useEffect(() => {
    if (!userId || userId in wishlists) return;
    let cancelled = false;
    api<Studio[]>("/wishlist")
      .then((items) => !cancelled && setWishlists((w) => ({ ...w, [userId]: items.map((s) => s._id) })))
      .catch(() => !cancelled && setWishlists((w) => ({ ...w, [userId]: [] })));
    return () => { cancelled = true; };
  }, [userId, wishlists]);

  const logout = useCallback(async () => {
    if (userId) setWishlists((w) => { const rest = { ...w }; delete rest[userId]; return rest; });
    await authClient.signOut();
    toast.success("You have been logged out.");
    router.push("/");
  }, [userId, router]);

  const toggleWishlist = useCallback(async (studioId: string) => {
    if (!userId) {
      toast.info("Log in to save studios to your wishlist.");
      router.push("/login");
      return;
    }
    try {
      const { saved } = await api<{ saved: boolean }>(`/wishlist/${studioId}`, { method: "POST" });
      setWishlists((w) => ({
        ...w,
        [userId]: saved ? [...(w[userId] ?? []), studioId] : (w[userId] ?? []).filter((id) => id !== studioId),
      }));
      toast.success(saved ? "Saved to your wishlist." : "Removed from your wishlist.");
    } catch (e) {
      toast.error(errMsg(e));
    }
  }, [userId, router]);

  const value = useMemo<AuthCtx>(
    () => ({
      user: session?.user ?? null,
      loading,
      logout,
      wishlistIds: (userId && wishlists[userId]) || [],
      toggleWishlist,
    }),
    [session, loading, logout, userId, wishlists, toggleWishlist]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
