import Hero from "@/components/extensions/Hero";
import MetaBar from "@/components/extensions/MetaBar";
import CockpitPlaceholder from "@/components/extensions/CockpitPlaceholder";
import ProblemAndBrief from "@/components/extensions/ProblemAndBrief";
import DesignFramework from "@/components/extensions/DesignFramework";
import FeatureMaps from "@/components/extensions/FeatureMaps";
import OneHonestFailure from "@/components/extensions/OneHonestFailure";
import FeaturePhotoEditor from "@/components/extensions/FeaturePhotoEditor";
import FiveMoreExtensions from "@/components/extensions/FiveMoreExtensions";
import Impact from "@/components/extensions/Impact";
import Reflections from "@/components/extensions/Reflections";
import ThanksForReading from "@/components/extensions/ThanksForReading";
import ReadNext from "@/components/extensions/ReadNext";
import Footer from "@/components/extensions/Footer";
import SectionRail, {
  type SectionRailItem,
} from "@/components/shared/SectionRail";

// Mirrors fastrouter/page.tsx's structure exactly, per direct instruction.
// Figma node 6408:8 (Extensions file) is canonical for this page's
// content. Real assets don't exist yet; every image slot uses
// shared/AssetPlaceholder as a temporary stand-in.
//
// "Five More Extensions" is skipped as a rail target (a card grid, not a
// top-level beat), same reasoning fastrouter/page.tsx already documents
// for skipping RejectedVsShipped/FiveDecisions/HonestFailure.
const sections: SectionRailItem[] = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "Problem" },
  { id: "framework", label: "Framework" },
  { id: "feature-01", label: "Maps" },
  { id: "feature-02", label: "Photo Editor" },
  { id: "impact", label: "Impact" },
  { id: "reflections", label: "Reflections" },
];

const HEADER_OFFSET = 64;

export default function ExtensionsPage() {
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
          <ProblemAndBrief problemId="problem" />
          <DesignFramework id="framework" />
          <FeatureMaps id="feature-01" />
          <OneHonestFailure />
          <FeaturePhotoEditor id="feature-02" />
          <FiveMoreExtensions />
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
