"use client";

import EnterLabHarness from "@/app/lab/_shared/EnterLabHarness";
import FastRouterSlides from "@/app/fastrouter-slides/page";
import { FASTROUTER_ENTER_LINES } from "@/components/shared/caseStudyEnterLines";

// Tuning harness for the entrance onto the SLIDE DECK (/fastrouter-slides).
// Sibling of /lab/case-study-enter, which does the vertical route.
//
// This renders the real deck page component rather than reconstructing its
// stage. The deck is ~850 lines of scroll machinery - a stand-in would test the
// stand-in, and the landing depends entirely on where HeroSlide's <h1> actually
// sits inside that machinery. Importing a route's component into another route
// is unusual, but this route is temporary and it keeps the deck itself
// untouched.
//
// Two things differ from the vertical harness, both handled by props rather
// than by a second copy of the component:
//   - the deck scrolls an inner container, so the lock and the reset-to-top
//     have to target [data-enter-scroller], not the document
//   - the target is HeroSlide's 48px <h1>, which wraps at its own width, so the
//     words land on a different set of lines than the vertical hero's
//
// Since the deck now mounts its own CaseStudyEnter for the real card-click
// flow, this route has two overlays in the DOM. The deck's is inert here (it
// only arms off a sessionStorage flag a card sets, which the lab never sets),
// and each instance only ever queries inside its own overlay ref, so they
// don't see each other. Harmless duplication, lab-only.
export default function CaseStudyEnterSlidesLab() {
  return (
    <EnterLabHarness
      lines={FASTROUTER_ENTER_LINES}
      scrollerSelector="[data-enter-scroller]"
    >
      <FastRouterSlides />
    </EnterLabHarness>
  );
}
