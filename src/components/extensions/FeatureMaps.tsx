import DecisionList, { type Decision } from "@/components/extensions/DecisionList";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import GestureSeamVideo from "@/components/extensions/GestureSeamVideo";

// Source of truth: Figma node 6415:480 (Extensions file, per CLAUDE.md).
//
// Figma has a "Before/After slider — FR-01 vs FR-02" block here (using
// FastRouter's own FR- numbering). FastRouter's own ObservabilityIntro.tsx
// skipped this exact hidden-in-Figma slider block — per direct
// instruction, skipped here too for the same reason: no slider component
// exists anywhere in the codebase yet.
const decisions: Decision[] = [
  {
    number: "01",
    title: "ATF is the extension, not a marketing wrapper",
    decision:
      "Map loads immediately, full size, fully usable, fitted to device viewport. No headline, no value proposition, no social proof above the fold.",
    gaveUp: "All conventional landing page real estate above the fold.",
    why: "The install was the conversion. Every subsequent new tab open is a justification moment, not a marketing moment. A user who has to scroll to find the map has already been given a reason to question the install.",
    assetLabel: "[ Screenshot — Maps, full-viewport ATF ]",
    // Light + dark landed 2026-08-03.
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-left-top"
        lightSrc="/images/extensions/ex-atf-is-the-extension-not-a-marketing-wrapper.mp4"
        darkSrc="/images/extensions/ex-atf-is-the-extension-not-a-marketing-wrapper-dark.mp4"
        aria-label="Maps extension opening full-viewport above the fold, immediately usable with no marketing content"
      />
    ),
  },
  {
    number: "02",
    title: "Gesture seam on mobile — hard mode switch, not continuous scroll",
    decision:
      "Map owns the full ATF. Chevron at the bottom signals page content below. Tapping transitions to scrollable page. Hard mode switch, not continuous scroll.",
    gaveUp: "Seamless continuous scroll from map into page content.",
    why: "This was a compliance requirement — Chrome and Firefox policies require responsive usability across viewport sizes. The gesture seam was the cleanest solution to that constraint, but desktop is where Maps actually lives. The mobile work was about meeting the policy bar, not solving a real user problem.",
    assetLabel: "[ Screenshot — mobile gesture seam, map to page transition ]",
    // Light + dark landed 2026-08-04. Panned/zoomed via GestureSeamVideo
    // (2026-08-04) — the recording is portrait, and a plain object-cover
    // crop never showed the chevron tap or the page-reveal this decision
    // is actually about; see that component for the full rationale. A
    // taller capsule was tried (2026-08-04) to make the chevron visible at
    // rest, then reverted same day, per direct feedback, in favor of
    // panning to the chevron earlier in GestureSeamVideo's own timeline —
    // capsule stays the standard 720/460 size, matching siblings.
    asset: (
      <GestureSeamVideo
        lightSrc="/images/extensions/ex-gesture-seam-on-mobile.mp4"
        darkSrc="/images/extensions/ex-gesture-seam-on-mobile-dark.mp4"
        aria-label="Mobile map view with a chevron seam at the bottom, tapping transitions to the scrollable page below"
      />
    ),
  },
  {
    number: "03",
    title: "Left panel always visible, never collapsible",
    decision:
      "Directions, transport modes, POI filters permanently alongside the map. No collapse, no toggle.",
    gaveUp: "Map surface area — the always-visible panel permanently reduces visible map.",
    why: "The panel is the primary interaction surface, not a settings drawer. Sessions are short and high-frequency. A collapsible panel adds a discovery cost to every session. For a daily-use product, that cost compounds.",
    assetLabel: "[ Screenshot — Maps with permanent left panel ]",
    // Light + dark landed 2026-08-05.
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-left-top"
        lightSrc="/images/extensions/ex-left-panel-always-visible.mp4"
        darkSrc="/images/extensions/ex-left-panel-always-visible-dark.mp4"
        aria-label="Maps extension with the left panel (directions, transport modes, POI filters) permanently visible alongside the map"
      />
    ),
  },
];

interface FeatureMapsProps {
  id?: string;
}

export default function FeatureMaps({ id }: FeatureMapsProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              extension 01
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              maps
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              Navigation-grade UX. Inside a browser tab.
            </h2>
          </div>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              How do you make a map feel immediately useful. Full size, no
              friction — when it opens on every single new tab?
            </span>
          </p>
        </div>

        <div className="w-full flex flex-col pt-64px">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            KEY DECISIONS
          </span>
          <DecisionList decisions={decisions} />
        </div>
      </div>
    </section>
  );
}
