export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type Init = Omit<RequestInit, "body"> & { json?: unknown };

/**
 * All requests go to /server/* on the Next.js origin, which is rewritten to the Express API.
 * The HTTPOnly JWT cookie travels with every request automatically.
 */
export async function api<T>(path: string, { json, headers, ...rest }: Init = {}): Promise<T> {
  const res = await fetch(`/server${path}`, {
    cache: "no-store",
    credentials: "include",
    ...rest,
    headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.message ?? "Something went wrong. Please try again.", res.status);
  return data as T;
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");
