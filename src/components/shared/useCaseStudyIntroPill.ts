"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useHeaderCaseStudyPill,
  type CaseStudyPill,
} from "@/components/shared/HeaderProvider";

gsap.registerPlugin(ScrollTrigger);

// Drives Header.tsx's case-study-pill swap on vertical-scroll case study
// pages. Scroll-driven, so GSAP + ScrollTrigger per this project's
// animation split (CLAUDE.md) — bound directly to the intro/Hero
// element's own DOM boundary rather than a hand-picked pixel threshold
// (SectionRail.tsx's appearAfterPx was deliberately decoupled from
// section boundaries for its own, different reason — rail-appearance
// timing, not "has the reader left the intro" — so that pattern doesn't
// apply here; this needs the real boundary).
//
// fastrouter-slides has no scroll to track (chapter index is plain React
// state) — see SegmentedRail.tsx for that format's equivalent.
export function useCaseStudyIntroPill(
  introElementId: string,
  pill: CaseStudyPill
) {
  const { setCaseStudyPill } = useHeaderCaseStudyPill();

  useEffect(() => {
    const introEl = document.getElementById(introElementId);
    if (!introEl) return;

    const trigger = ScrollTrigger.create({
      trigger: introEl,
      start: "bottom top",
      onEnter: () => setCaseStudyPill(pill),
      onEnterBack: () => setCaseStudyPill(null),
    });

    return () => {
      trigger.kill();
      setCaseStudyPill(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introElementId]);
}
