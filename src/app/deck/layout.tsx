import type { Metadata } from "next";

// /deck/* are access-gated share links — one case study, sent to one hiring
// team, deliberately unlisted. Keeping them out of search is the point: a link
// you hand to someone is not a link that should surface for your name, and an
// indexed gate page is just a public "there is something here" sign.
//
// Same treatment /lab/* already gets (src/app/lab/layout.tsx), and the same
// limitation: this is a request to crawlers, not access control. The access
// control is the signed cookie the page itself checks. robots.ts repeats the
// disallow at the site level for crawlers that read that and not per-page
// meta.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
