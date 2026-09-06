import type { Metadata } from "next";

// /lab/* is a tuning harness, not portfolio content — keep it out of search
// results. This is a portfolio; a page of sliders is not what should surface
// for someone's name. Routes stay reachable by direct link, which is all the
// harness needs.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
