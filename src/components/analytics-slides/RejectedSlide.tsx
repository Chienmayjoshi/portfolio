import GridDepthLayer from "@/components/shared/GridDepthLayer";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";

// "Rejected direction" slide for the two Analytics features that have one
// (metric creation, query breakdown). Copy is the Figma frame's REJECTED
// DIRECTION card (node 6379:57064), tightened: the "attempted" / "analytics" /
// "FR-11" tags are dropped (the last is a FastRouter frame id pasted into the
// card), and the long "why" is cut to the reasoning.
//
// Calendar compare and metric taxonomy have no rejected slide: their Figma
// blocks are FastRouter's Side stepper / Top stepper / Unified form under a
// "pending this to analytics" note, i.e. no Analytics content exists.
//
// The shape is a text column beside an asset slot. There is no rejected-state
// screenshot yet, so the slot is a placeholder in the same capsule proportion
// the decisions use (720x460), ready for the real image.
interface RejectedSlideProps {
  id: string;
  feature: string;
  title: string;
  tried: string;
  whyTitle: string;
  why: string;
  assetLabel: string;
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-8px">
      <span className="font-mono font-medium text-[13px] text-text-error uppercase tracking-[0.78px]">
        {label}
      </span>
      <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
        {children}
      </p>
    </div>
  );
}

function RejectedSlide({
  id,
  feature,
  title,
  tried,
  whyTitle,
  why,
  assetLabel,
}: RejectedSlideProps) {
  return (
    <section
      id={id}
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:items-center md:px-80px md:pt-0 md:pb-0">
        <div className="flex w-full flex-col gap-24px md:mx-auto md:max-w-[1280px] md:flex-row md:items-center md:gap-40px">
          <div className="flex flex-col gap-24px md:w-[520px] md:shrink-0 md:gap-[40px]">
            <div className="flex flex-col gap-16px">
              <span className="font-mono font-medium text-[13px] text-text-error uppercase tracking-[0.78px]">
                Rejected direction · {feature}
              </span>
              <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
                {title}
              </h1>
            </div>

            <div className="flex flex-col gap-24px">
              <Block label="What we tried">{tried}</Block>
              <Block label="Why it failed">{`${whyTitle}. ${why}`}</Block>
            </div>
          </div>

          <div className="aspect-[720/460] w-full shrink-0 overflow-hidden rounded-tl-[32px] md:w-[720px]">
            <AssetPlaceholder label={assetLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}

export const MetricCreationRejected = () => (
  <RejectedSlide
    id="metric-creation-rejected"
    feature="Metric creation"
    title="Top-down creation flow"
    tried="Build the primary metric first, name its dependencies, then create each one in sequence. Navigation between the metrics in the chain was provided."
    whyTitle="Technical reality, not design merit"
    why="A metric has to exist in the backend before another formula can reference it, and keeping partial state across several unsaved forms wasn’t feasible. The most natural design failed on the constraints."
    assetLabel="[ Screenshot — top-down creation flow ]"
  />
);

export const QueryBreakdownRejected = () => (
  <RejectedSlide
    id="query-breakdown-rejected"
    feature="Query breakdown"
    title="Equal-weight options with balanced copy"
    tried="Both options at equal weight, with copy under each explaining the tradeoffs."
    whyTitle="Balanced copy implies a parity that doesn’t exist"
    why="Split Query is better for the vast majority, and users hit this state mid-analysis. They need a path forward, not a lesson in query infrastructure."
    assetLabel="[ Screenshot — equal-weight options ]"
  />
);
