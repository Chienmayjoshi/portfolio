import Hero from "@/components/analytics/Hero";
import MetaBar from "@/components/analytics/MetaBar";
import CockpitPlaceholder from "@/components/analytics/CockpitPlaceholder";
import ProblemAndProduct from "@/components/analytics/ProblemAndProduct";
import FeatureMetricCreation from "@/components/analytics/FeatureMetricCreation";
import FeatureQueryBreakdown from "@/components/analytics/FeatureQueryBreakdown";
import FeatureCalendarCompare from "@/components/analytics/FeatureCalendarCompare";
import FeatureMetricTaxonomy from "@/components/analytics/FeatureMetricTaxonomy";
import Impact from "@/components/analytics/Impact";
import Reflections from "@/components/analytics/Reflections";
import ThanksForReading from "@/components/analytics/ThanksForReading";
import ReadNext from "@/components/analytics/ReadNext";
import Footer from "@/components/analytics/Footer";
import SectionRail, {
  type SectionRailItem,
} from "@/components/shared/SectionRail";

// Mirrors fastrouter/page.tsx's structure exactly, per direct instruction
// (same page-level layout/spacing/component-behaviour, no modifications).
// Analytics has 4 features (not FastRouter's 3), so the rail has one more
// entry — SectionRail itself is fully prop-driven, so this is a
// non-structural difference.
//
// Figma node 6379:57064 (Analytics file) is canonical for this page's
// content per direct instruction — superseding CLAUDE.md's older note
// that `/content` docs are canonical for Analytics/Extensions. Real
// assets don't exist yet (in progress, in parallel); every image/video
// slot uses shared/AssetPlaceholder as a temporary stand-in.
const sections: SectionRailItem[] = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "Problem" },
  { id: "product", label: "Product" },
  { id: "feature-01", label: "Metric Creation" },
  { id: "feature-02", label: "Query Breakdown" },
  { id: "feature-03", label: "Calendar Compare" },
  { id: "feature-04", label: "Metric Taxonomy" },
  { id: "impact", label: "Impact" },
  { id: "reflections", label: "Reflections" },
];

const HEADER_OFFSET = 64;

export default function AnalyticsPage() {
  return (
    <>
      <div className="w-full max-w-[1440px] mx-auto flex flex-col min-[1300px]:flex-row">
        <div className="hidden min-[1300px]:block w-[190px] shrink-0">
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
          <FeatureMetricCreation id="feature-01" />
          <FeatureQueryBreakdown id="feature-02" />
          <FeatureCalendarCompare id="feature-03" />
          <FeatureMetricTaxonomy id="feature-04" />
          <Impact id="impact" />
          <Reflections id="reflections" />
          <ThanksForReading />
          <ReadNext />
        </main>
        <div className="hidden min-[1300px]:block flex-1" aria-hidden="true" />
      </div>
      <Footer />
    </>
  );
}
