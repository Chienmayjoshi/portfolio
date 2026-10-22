import type { Metadata } from "next";

// The feedback inbox. Not for crawlers: robots.ts disallows /admin/ at the
// site level and this repeats it per page. The real gate is the cookie the
// page checks (auth.ts) — this is only a request to crawlers.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
