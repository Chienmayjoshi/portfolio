import Hero from "@/components/fastrouter/Hero";
import MetaBar from "@/components/fastrouter/MetaBar";
import CockpitPlaceholder from "@/components/fastrouter/CockpitPlaceholder";
import ProblemAndProduct from "@/components/fastrouter/ProblemAndProduct";
import CouncilIntro from "@/components/fastrouter/CouncilIntro";
import RejectedVsShipped from "@/components/fastrouter/RejectedVsShipped";
import FiveDecisions from "@/components/fastrouter/FiveDecisions";
import HonestFailure from "@/components/fastrouter/HonestFailure";
import ObservabilityIntro from "@/components/fastrouter/ObservabilityIntro";
import EvaluationsFeature from "@/components/fastrouter/EvaluationsFeature";
import Impact from "@/components/fastrouter/Impact";
import Reflections from "@/components/fastrouter/Reflections";
import ThanksForReading from "@/components/fastrouter/ThanksForReading";
import ReadNext from "@/components/fastrouter/ReadNext";
import Footer from "@/components/fastrouter/Footer";
import SectionRail, {
  type SectionRailItem,
} from "@/components/shared/SectionRail";

// Section-rail wiring (2026-07-15): this is FastRouter's own
// "Intro/Problem/Product/Feature.../Impact/Reflections" list — the
// SectionRail component itself has no knowledge of this content, it
// just renders whatever ordered {id, label} list it's given. Each
// future case study defines and passes its own list the same way.
// Skipped as rail targets: MetaBar/CockpitPlaceholder (above-the-fold
// intro filler, nothing to jump back to), RejectedVsShipped/
// FiveDecisions/HonestFailure (sub-parts of the Council feature, not
// top-level beats), ThanksForReading/ReadNext/Footer (closing
// boilerplate).
const sections: SectionRailItem[] = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "Problem" },
  { id: "product", label: "Product" },
  { id: "feature-01", label: "LLM Council" },
  { id: "feature-02", label: "Observability" },
  { id: "feature-03", label: "Evaluations" },
  { id: "impact", label: "Impact" },
  { id: "reflections", label: "Reflections" },
];

// headerOffset matches TempHeader.tsx's own height (12px padding top +
// bottom + the 40px ThemeToggle button = ~64px) so a jumped-to section
// doesn't land underneath that sticky bar. TempHeader is itself
// temporary scaffolding (see its own file) — revisit this constant if/
// when it's replaced with real page chrome.
const HEADER_OFFSET = 64;

// Page-level 1440px framing wrapper (2026-07-16, per direct request,
// matching a reference site's layout: rail column | content | empty
// placeholder column, keeping content optically centered rather than
// pushed left by the rail).
//
// Revised same day: the rail needs to be a genuine flex child of this
// row (not nested inside <main> with a separate decorative spacer) so
// its horizontal position actually tracks the wrapper — see
// SectionRail.tsx's own comment for why that required switching it from
// `position: fixed` to `position: sticky`. Column layout is now literally
// [rail: sized to its own content][main: fixed 1060px][placeholder:
// flex-1, absorbs whatever's left of the 1440px budget]. `<main>` no
// longer needs `min-w-0` (it's shrink-0 at a fixed width now, not a
// flexible item that could get squeezed) — the placeholder is the only
// flexible column, and it can shrink to 0 gracefully without breaking
// anything, unlike main.
//
// The whole row only switches from stacked (`flex-col`, mobile-first
// default) to the 3-column layout (`flex-row`) at the same `min-[1300px]`
// breakpoint SectionRail itself uses to show/hide — below that, the rail
// and placeholder are both hidden (via their own classes) and <main>
// renders full-width exactly as before this wrapper existed, using its
// own already-solid mobile/tablet responsive behavior unchanged.
//
// Left column fixed at 190px (2026-07-16, per direct feedback) — same
// width as the right placeholder ((1440-1060)/2), so <main> sits truly
// centered in the 1440px wrapper. The rail's own content (text labels,
// ~125px) doesn't fill that whole 190px — it's a reusable, generic
// component that sizes to its own content (SectionRail.tsx), not
// something that should hardcode a FastRouter-specific column width
// internally. This wrapping div is what reserves the matching 190px
// here, at the page level where that number is actually meaningful;
// SectionRail's content just sits flush-left within it, same left edge
// as before, with the leftover ~65px reading as breathing room before
// <main> begins rather than an off-center page.
//
// Footer moved outside the [rail|main|placeholder] row (2026-07-16, per
// direct feedback) — it needs to span the full 1440px composition, not
// just <main>'s fixed 1060px column. Rendering it as a 4th child inside
// the row wouldn't do that (it'd just become another flex item squeezed
// beside rail/main/placeholder); it needs to be a true sibling of the
// whole row so it can carry its own independent 1440px-wide container
// below it. Footer.tsx's own internal max-width was updated to match
// (see that file).
export default function FastRouterPage() {
  return (
    <>
      <div className="w-full max-w-[1440px] mx-auto flex flex-col min-[1300px]:flex-row">
        <div className="hidden min-[1300px]:block w-[190px] shrink-0">
          {/* backHref="/" — the portfolio root is the only real, existing
              route that could stand in for "project listing" today; there's
              no dedicated index page yet. Revisit once one exists — not a
              fabricated destination (the route is real), just not yet the
              right content behind it. */}
          <SectionRail
            sections={sections}
            appearAfterPx={150}
            headerOffset={HEADER_OFFSET}
            backHref="/"
          />
        </div>
        <main className="flex flex-col w-full min-[1300px]:w-[1060px] min-[1300px]:shrink-0">
          <Hero id="intro" />
          <MetaBar />
          <CockpitPlaceholder />
          <ProblemAndProduct problemId="problem" productId="product" />
          <CouncilIntro id="feature-01" />
          <RejectedVsShipped />
          <FiveDecisions />
          <HonestFailure />
          <ObservabilityIntro id="feature-02" />
          <EvaluationsFeature id="feature-03" />
          <Impact id="impact" />
          <Reflections id="reflections" />
          <ThanksForReading />
          <ReadNext />
        </main>
        <div
          className="hidden min-[1300px]:block flex-1"
          aria-hidden="true"
        />
      </div>
      <Footer />
    </>
  );
}
