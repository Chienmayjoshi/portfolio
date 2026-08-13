import ScreenshotFrame from "@/components/shared/ScreenshotFrame";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";

// Source of truth: Figma node 6379:57129 (Analytics file, per CLAUDE.md).
// Same two-block structure as fastrouter/ProblemAndProduct.tsx (Problem +
// "What is X?" product explainer), extended from 3 to 4 pain points to
// match this file's actual content — the row itself already wraps on
// mobile, so a 4th item is a non-structural change.
//
// No product mockup asset exists yet for Analytics — swapped
// ProductBrowserMockup for a generic ScreenshotFrame + AssetPlaceholder at
// the same 980/497 aspect ratio FastRouter's product screenshot uses, so
// the layout slot and proportions match even though the content is a
// stand-in.
const painPoints = [
  "Dependent metrics had no inline creation path",
  "Queued queries stalled for hours",
  "Comparison UI burdened every calendar open",
  "No way to navigate 50+ metrics and dimensions",
];

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
            <h2 className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px] md:whitespace-nowrap">
              The Problem
            </h2>
          </div>

          <div className="flex flex-col w-full py-24px">
            <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] tracking-[-0.1px]">
              The platform got more powerful every sprint. The friction did
              too.
            </h3>
          </div>

          <div className="flex flex-col w-full pb-24px">
            <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              A capable analytics platform — and multiple specific places it
              broke down on users doing real work.
            </p>
          </div>

          <div className="flex flex-col md:flex-row flex-wrap gap-0 md:gap-48px items-start border-t border-border-default">
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
            <h2 className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px] md:whitespace-nowrap">
              What is Analytics?
            </h2>
          </div>

          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            A report builder for contextual advertising analytics.
            Dimensions, Metrics, and Filters combined to generate and
            schedule reports across publisher and advertiser datasets. PMs,
            analysts, and stakeholders — all making different decisions
            from the same data. I designed across four modules from
            mid-product onwards.
          </p>

          <ScreenshotFrame aspectRatio="980/497" className="max-w-[980px]">
            <AssetPlaceholder label="[ Screenshot — Analytics report builder ]" />
          </ScreenshotFrame>
        </div>
      </div>
    </section>
  );
}
