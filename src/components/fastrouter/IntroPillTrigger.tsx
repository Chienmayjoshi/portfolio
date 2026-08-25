"use client";

import FastRouterLogomark from "@/components/fastrouter/FastRouterLogomark";
import { useCaseStudyIntroPill } from "@/components/shared/useCaseStudyIntroPill";

// Renders nothing — just drives Header.tsx's case-study-pill swap once the
// reader scrolls past Hero (id="intro", same id SectionRail already uses).
// Isolated into its own tiny client component rather than converting
// page.tsx itself to "use client", matching this codebase's existing
// pattern of scoping client-only interactivity to small dedicated pieces.
export default function IntroPillTrigger() {
  useCaseStudyIntroPill("intro", {
    logo: <FastRouterLogomark />,
    business: "B2B",
    domain: "AI Infrastructure",
  });

  return null;
}
