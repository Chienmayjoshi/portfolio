import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// One shared secret, `ADMIN_TOKEN`, no accounts. The cookie holds a SHA-256 of
// it, never the token itself, and is httpOnly so page script can't read it.
//
// With no ADMIN_TOKEN set: open in `next dev` (so the inbox works locally with
// zero setup, like the in-memory feedback store), closed everywhere else.
export const ADMIN_COOKIE = "admin_session";

const digest = (value: string) =>
  createHash("sha256").update(value).digest();

export const adminConfigured = () => Boolean(process.env.ADMIN_TOKEN);

export function tokenMatches(candidate: string): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return timingSafeEqual(digest(candidate), digest(token));
}

export function sessionValue(): string {
  return digest(process.env.ADMIN_TOKEN ?? "").toString("hex");
}

export async function isAuthed(): Promise<boolean> {
  if (!adminConfigured()) return process.env.NODE_ENV !== "production";
  const jar = await cookies();
  const have = jar.get(ADMIN_COOKIE)?.value;
  if (!have) return false;
  const a = Buffer.from(have);
  const b = Buffer.from(sessionValue());
  return a.length === b.length && timingSafeEqual(a, b);
}
