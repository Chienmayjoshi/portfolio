"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Header is mounted once, at the root layout, above every page — a page
// can't hand it props directly the way it would a sibling. Same shape of
// problem ThemeProvider.tsx already solves for the same file: a Client
// Component context wrapping {children}, read by a component that lives
// above the page tree. Mirrors that file's pattern exactly.
//
// Pages register/clear their own case-study identity as the reader
// scrolls (vertical-scroll case studies, via useCaseStudyIntroPill.ts) or
// pages through chapters (fastrouter-slides, via SegmentedRail.tsx) —
// Header.tsx just renders whatever's currently in context, it has no
// knowledge of which case study set it.
export interface CaseStudyPill {
  logo: ReactNode;
  business: string;
  domain: string;
}

interface HeaderContextValue {
  caseStudyPill: CaseStudyPill | null;
  setCaseStudyPill: (pill: CaseStudyPill | null) => void;
  // When true, the Header renders as the INVERSE of the global theme, to
  // match a slide that does the same (fastrouter-slides chapter-intro slides
  // — see .chapter-intro-invert in globals.css). Kept here, not on
  // ThemeProvider, because it's a transient per-slide surface state the deck
  // pushes as the reader pages through it, not the reader's own theme choice.
  // A page that never sets it leaves the header at the normal global theme.
  invertSurface: boolean;
  setInvertSurface: (invert: boolean) => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [caseStudyPill, setCaseStudyPill] = useState<CaseStudyPill | null>(
    null
  );
  const [invertSurface, setInvertSurface] = useState(false);

  return (
    <HeaderContext.Provider
      value={{
        caseStudyPill,
        setCaseStudyPill,
        invertSurface,
        setInvertSurface,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderCaseStudyPill() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error(
      "useHeaderCaseStudyPill must be used within a HeaderProvider"
    );
  }
  return ctx;
}

// Companion to useHeaderCaseStudyPill for the header's inverted-surface state
// — a separate hook so a page that only drives the surface (or only the pill)
// reads just what it needs. Both share the one HeaderContext above.
export function useHeaderInvertSurface() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error(
      "useHeaderInvertSurface must be used within a HeaderProvider"
    );
  }
  return {
    invertSurface: ctx.invertSurface,
    setInvertSurface: ctx.setInvertSurface,
  };
}
