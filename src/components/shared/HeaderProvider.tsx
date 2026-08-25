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
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [caseStudyPill, setCaseStudyPill] = useState<CaseStudyPill | null>(
    null
  );

  return (
    <HeaderContext.Provider value={{ caseStudyPill, setCaseStudyPill }}>
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
