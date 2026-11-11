import { SignJWT } from "jose";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "studiospace_token";
const MAX_AGE = 60 * 60 * 24; // 1 day, refreshed every time the app loads

/** Exchanges a valid Better Auth session for a JWT stored in an HTTPOnly cookie (read by the Express API). */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const res = NextResponse.json({ message: "No active session." }, { status: 401 });
    res.cookies.delete(COOKIE);
    return res;
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
  const token = await new SignJWT({ email: session.user.email, name: session.user.name, image: session.user.image ?? undefined })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
