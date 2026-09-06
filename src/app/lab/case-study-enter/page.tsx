"use client";

import EnterLabHarness from "@/app/lab/_shared/EnterLabHarness";
import Hero from "@/components/fastrouter/Hero";
import MetaBar from "@/components/fastrouter/MetaBar";
import CockpitPlaceholder from "@/components/fastrouter/CockpitPlaceholder";
import { FASTROUTER_ENTER_LINES } from "@/components/shared/caseStudyEnterLines";

// Tuning harness for the entrance onto the VERTICAL case study (/fastrouter).
// The slide-deck version is the sibling route, /lab/case-study-enter-slides.
//
// Deliberately not on /fastrouter itself: the real route stays untouched until
// the motion is signed off, so nothing shipped can regress while this is being
// dialled in. Delete src/app/lab/ when it moves onto the real flow.
export default function CaseStudyEnterLab() {
  return (
    <EnterLabHarness lines={FASTROUTER_ENTER_LINES}>
      {/* Same column shape as src/app/fastrouter/page.tsx so the target lands
          at exactly the coordinates it will on the real page. Verified: the
          landed <h1> matches a direct /fastrouter load to 0.00px. */}
      <div className="w-full max-w-[1440px] mx-auto flex flex-col min-[1300px]:flex-row">
        <div className="hidden min-[1300px]:block w-[190px] shrink-0" />
        <main className="flex flex-col w-full min-[1300px]:w-[1060px] min-[1300px]:shrink-0">
          <Hero id="intro" />
          <MetaBar />
          <CockpitPlaceholder />
        </main>
        <div className="hidden min-[1300px]:block flex-1" aria-hidden="true" />
      </div>
    </EnterLabHarness>
  );
}
