import ProductBrowserMockup from "@/components/fastrouter/ProductBrowserMockup";

// Source of truth: Figma node 6368:53648 (FastRouter file, per CLAUDE.md).
// Standard 60px top/bottom section rhythm — no exception here.
//
// Divider borders throughout this section are bound to Figma's
// color/text-on-dark (#D9D9D9) in some spots and correctly to
// border/default (#E5E5E5) in others within the same node — same class of
// mode-mismatch slip already flagged in Hero and CockpitPlaceholder.
// Using border-default everywhere for consistency.
const painPoints = [
  "No visibility into spend",
  "No way to validate quality",
  "No trusted path to a verdict",
];

// `problemId`/`productId` (2026-07-15): SectionRail.tsx anchors — this
// component covers two rail entries ("Problem" and "Product") in one
// file, since it already has two distinct inner blocks. Splitting into
// two components for this alone would be an invasive refactor of an
// already-built, working section for no functional gain — the rail's
// anchor concept is just "a DOM id it can target," not strictly "one
// component per section."
interface ProblemAndProductProps {
  problemId?: string;
  productId?: string;
}

export default function ProblemAndProduct({
  problemId,
  productId,
}: ProblemAndProductProps) {
  return (
    <section className="w-full py-80px flex flex-col items-center">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px flex flex-col gap-64px w-full">
        <div id={problemId} className="flex flex-col w-full border-b border-border-default">
          <div className="flex flex-col w-full py-24px border-b border-border-default">
            <h2
              className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px] md:whitespace-nowrap"
            >
              The Problem
            </h2>
          </div>

          <div className="flex flex-col w-full py-24px">
            <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] tracking-[-0.1px]">
              <span className="block md:whitespace-nowrap">
                Every model decision was gut feel
              </span>
              <span className="block md:whitespace-nowrap">
                dressed up as strategy.
              </span>
            </h3>
          </div>

          <div className="flex flex-col w-full pb-24px">
            <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              <span className="block">
                Enterprise AI teams were making expensive model decisions on
                gut feel, with no
              </span>
              <span className="block">
                visibility into cost, no way to validate model quality, and
                no systematic path to a
              </span>
              <span className="block">trusted output.</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-0 md:gap-48px items-start border-t border-border-default">
            {painPoints.map((point) => (
              <div key={point} className="flex flex-col py-16px md:py-32px">
                <span className="font-ui font-semibold text-text-accent text-[14px] leading-[20px]">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div id={productId} className="flex flex-col gap-32px items-start w-full">
          <div className="flex flex-col w-full py-24px border-b border-border-default">
            <h2
              className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px] md:whitespace-nowrap"
            >
              What is FastRouter?
            </h2>
          </div>

          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            <span className="block">
              One API across 100+ models. Intelligent routing by cost,
              latency, or quality. Real-time
            </span>
            <span className="block">
              visibility into every request that runs through it. FastRouter
              gives AI teams the control
            </span>
            <span className="block">surface their products were missing.</span>
          </p>

          <ProductBrowserMockup />
        </div>
      </div>
    </section>
  );
}
