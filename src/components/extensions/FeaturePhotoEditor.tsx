import DecisionList, { type Decision } from "@/components/extensions/DecisionList";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";

// Source of truth: Figma node 6408:371 (Extensions file, per CLAUDE.md).
// Same shape as FeatureMaps.tsx but the label is singular "KEY DECISION"
// (matches Figma exactly) with only 1 item — DecisionList's `.map` already
// supports any length, no structural change needed.
//
// Before/after slider skipped, same reasoning as FeatureMaps.tsx.
const decisions: Decision[] = [
  {
    number: "01",
    title: "Separated traditional and AI tools at every touchpoint",
    decision:
      "Two-entry-point landing (Edit My Photo vs Create With AI), two-column nav dropdown (Editing Tools / AI Tools), left panel leading with AI Tools section and Trending tab.",
    gaveUp: "A unified tool panel — all tools in a single list, sorted by category.",
    why: "Traditional and AI editing are different cognitive modes. Corrective editing starts with a known problem. Generative editing starts with an intention. The same two-category logic across landing → nav → panel means the architecture teaches itself.",
    assetLabel: "[ Screenshot — two-entry-point Editing / AI landing ]",
    // Light + dark landed 2026-08-06. Tried center-top first (the landing
    // page itself is two symmetric cards, so a left crop seemed like it'd
    // favor one entry point over the other) but the video spends most of
    // its runtime on the Image Tools dropdown, not the landing page — and
    // that dropdown's content (logo, "Editing Tools" column) sits right at
    // the left edge, which center-top was cropping into. Switched to
    // left-top (2026-08-06, per direct feedback): keeps the dropdown fully
    // intact for the majority of the clip; the brief landing-page segment
    // only loses a decorative corner graphic on the right, not either card.
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-left-top"
        lightSrc="/images/extensions/ex-separated-traditional-and-ai-tools-at-every-touchpoint.mp4"
        darkSrc="/images/extensions/ex-separated-traditional-and-ai-tools-at-every-touchpoint-dark.mp4"
        aria-label="Photo editor landing page with two symmetric entry points, Edit My Photo and Create With AI"
      />
    ),
  },
];

interface FeaturePhotoEditorProps {
  id?: string;
}

export default function FeaturePhotoEditor({ id }: FeaturePhotoEditorProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              extension 02
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              photo editor
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              Two completely different tools. One panel. No way to tell
              them apart.
            </h2>
          </div>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              Traditional editing starts with a known problem. AI editing
              starts with an intention. Putting them in the same list
              forces users to parse everything before they can start
              anything.
            </span>
          </p>

          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            Photo editing tools are built for screen space. Professional
            editors use large canvases, floating palettes, multi-panel
            layouts. A browser extension works in a fixed viewport — and
            users aren&rsquo;t launching it for a dedicated session.
            They&rsquo;re opening a new tab and deciding in the first few
            seconds whether the tool is worth using.
          </p>
        </div>

        <div className="w-full flex flex-col pt-64px">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            KEY DECISION
          </span>
          <DecisionList decisions={decisions} />
        </div>
      </div>
    </section>
  );
}
