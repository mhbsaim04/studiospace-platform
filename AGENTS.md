# StudioSpace frontend

Frontend of a two-repo project: this Next.js 16.4.6 / React 19 app plus the sibling Express API in `../studiospace-backend-server` (currently just a stub `index.js`). Note: this frontend's `package.json` `name` is misleadingly `"studiospace-backend-server"` (copy/paste) — this IS the frontend repo.

## Commands

- `npm run dev` — Turbopack dev server on http://localhost:3000
- `npm run lint` — flat-config ESLint (eslint 9, `eslint-config-next`)
- `npm run build` — typecheck + production build (there is no separate typecheck script and no tests)

## Framework quirks

- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`) — do not add manual memoization (`useMemo`/`useCallback`/`React.memo`) for performance reasons.
- Tailwind v4 CSS-first: theme tokens live in `src/app/globals.css` (no `tailwind.config` file). shadcn/ui components are in `src/components/ui` (style `base-nova`, per `components.json`); add new ones with `npx shadcn add`.
- `src/lib` is the single module surface: `@/lib/api` (`api<T>()` helper, throws `ApiError`), `@/lib/types`, `@/lib/constants`. Toasts use `sonner`.

## Architecture: auth & API wiring (non-obvious)

- **Auth runs inside this Next app, not the backend.** `src/lib/auth.ts` is Better Auth with the MongoDB adapter (Atlas, db `studiospace`), mounted at `src/app/api/auth/[...all]/route.ts`. Supports email/password and Google OAuth.
- **JWT bridge to the Express API:** `src/app/api/token/route.ts` exchanges the Better Auth session for an HS256 JWT (via `jose`) stored in the HTTPOnly cookie `studiospace_token` (1-day max-age). The Express backend authenticates requests by reading this cookie, so `JWT_SECRET` in this repo's `.env` **must match** the backend's.
- `AuthProvider` (`src/components/auth-provider.tsx`) refreshes that JWT cookie and loads wishlist state on every app load. Wishlist lives there — use `useAuth()`, don't duplicate per-page wishlist logic.
- **All client API calls go through `src/lib/api.ts`**, which fetches `/server/*` on this origin — a Next.js rewrite must map `/server/*` to the Express API (`API_URL` in `.env`, expected on :5000). `next.config.ts` currently has **no rewrites**: if API calls 404, that's the first thing to check.
- **Route protection is client-side only** — wrap protected pages in `<PrivateRoute>` (`src/components/private-route.tsx`); there is no middleware. It deliberately waits until the JWT-cookie sync finishes before rendering, so a reload on a private route never bounces a logged-in user to `/login`. Don't bypass it.

## Env (.env, gitignored)

- Required: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID/SECRET` (callback URI: `http://localhost:3000/api/auth/callback/google`), `JWT_SECRET`, `API_URL`.
- Image uploads use imgbb: `src/components/studio-form.tsx` reads `NEXT_PUBLIC_IMGBB_KEY`. The `.env` line is currently split across two lines (`NEXT_PUBLIC_IMG` / `BB_KEY=`), so the key never loads and the form falls back to pasting a URL — fix the line to enable uploads.
- In `src/lib/auth.ts`, `cookieCache` must stay **OFF** in this better-auth version: enabling it stops the `session_token` cookie from being issued and breaks fresh sign-ins (see comment there).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
