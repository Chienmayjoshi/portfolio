import GridDepthLayer from "@/components/shared/GridDepthLayer";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";
import AnalyticsLogomark from "@/components/analytics-slides/AnalyticsLogomark";

// Hero, Problem and Product for the Analytics deck. Source of truth is the
// Analytics Figma frame (node 6379:57064, file 2aoIFdaJMyNBEWeQESBEzG); it is a
// single vertical layout, so these three are its first three sections
// re-composed into the deck's slide shapes (the same shapes as
// fastrouter-slides' Hero/Problem/Product). Copy is tightened for skimming
// with the meaning kept.
//
// Register: Analytics is a Figma-locked B2B study, so it takes the enterprise
// register FastRouter uses — not UltraAI's consumer one.
//
// Placeholders, deliberately: no Analytics hero illustration or product
// screenshot exists yet. Figma's hero caption ("The AI product making
// decisions at scale — with no instruments to read from") is FastRouter's line
// pasted in, so the slot carries a neutral label and no caption until there is
// Analytics copy for it.

const META = [
  { label: "Role", value: "Senior Product Designer" },
  { label: "Team", value: "2 designers · 2 PMs · mixed stakeholders" },
  { label: "Users", value: "PMs, data analysts, senior stakeholders" },
  {
    label: "Constraint",
    value: "High data density · zero screen real estate to waste",
  },
];

export function HeroSlide() {
  return (
    <section
      id="hero"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col items-start justify-between gap-0 px-20px pt-40px pb-40px md:flex-row md:gap-40px md:px-80px md:pt-[calc(var(--fr-header-h,0px)+48px)] md:pb-0">
        <div className="flex w-full max-w-[720px] flex-col items-start gap-24px md:gap-40px">
          <div className="flex flex-wrap items-center gap-12px">
            <AnalyticsLogomark />
            <span className="font-ui text-[13px] text-text-muted uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              B2B internal tool
            </span>
            <span className="font-ui text-[13px] text-text-muted uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Contextual advertising analytics
            </span>
          </div>

          <div className="flex w-full flex-col items-start gap-24px md:gap-32px">
            <h1 className="w-full font-display text-text-primary text-slide-title-sm md:text-slide-title">
              The product scaled. The interface didn&rsquo;t.
            </h1>

            <div className="w-full border-border-frame border-t py-32px md:py-40px">
              <p className="font-ui font-normal text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
                PMs, analysts and stakeholders make performance decisions here
                every day. I designed four modules to close the gaps.
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full max-w-[400px] grid-cols-2 gap-24px md:w-auto md:gap-x-64px md:gap-y-40px">
          {META.map((item) => (
            <div key={item.label} className="flex flex-col items-start gap-12px">
              <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
                {item.label}
              </span>
              <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[320px] w-full flex-1 overflow-hidden md:min-h-0">
        <AssetPlaceholder label="[ Hero illustration ]" />
      </div>
    </section>
  );
}

const PROBLEM_PILLS = [
  "Dependent metrics had no inline creation path",
  "Queued queries stalled for hours",
  "Comparison UI burdened every calendar open",
  "No way to navigate 50+ metrics and dimensions",
];

export function ProblemSlide() {
  return (
    <section
      id="problem"
      className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden bg-bg-primary md:items-center md:justify-center"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[600px]" />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-start gap-40px px-20px pt-40px md:h-full md:items-center md:justify-center md:gap-24px md:px-40px md:pt-0">
        <div className="flex w-full max-w-[760px] flex-col items-start gap-40px text-left md:items-center md:gap-24px md:text-center">
          <h1 className="w-full font-display text-text-primary text-slide-title-sm md:pb-40px md:text-slide-title">
            The Problem
          </h1>

          <p className="w-full font-ui font-semibold text-[24px] text-text-primary leading-[32px] tracking-[-0.1px] md:text-[28px] md:leading-[40px]">
            The platform got more powerful every sprint. The friction did too.
          </p>

          <p className="w-full font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px] md:text-[18px] md:leading-[30px] md:tracking-[0.09px]">
            A capable analytics platform, with specific places where it broke
            down for people doing real work.
          </p>

          <ul className="mt-16px flex w-full flex-wrap gap-12px md:justify-center">
            {PROBLEM_PILLS.map((pill) => (
              <li
                key={pill}
                className="rounded-xl border border-border-default bg-bg-primary px-24px py-16px font-ui font-semibold text-[14px] text-text-primary leading-[20px]"
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ProductSlide() {
  return (
    <section
      id="product"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full [--grid-cell:24px] md:top-0 md:h-[800px] md:[--grid-cell:40px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-start gap-40px px-20px pt-40px md:items-center md:gap-0 md:px-0 md:pt-[var(--fr-header-h,0px)]">
        <h1 className="w-full font-display text-text-primary text-slide-title-sm md:w-[680px] md:py-40px md:text-center md:text-slide-title">
          What is Analytics?
        </h1>

        <p className="w-full font-ui font-semibold text-text-primary text-[24px] leading-[32px] tracking-[-0.1px] md:w-[680px] md:pt-40px md:pb-24px md:text-center md:text-[28px] md:leading-[40px]">
          A report builder for contextual advertising analytics.
        </p>

        <div className="w-full md:max-w-[760px] md:px-80px md:pb-40px">
          <p className="font-ui font-normal text-text-primary text-[18px] leading-[30px] tracking-[0.09px] md:text-center">
            Dimensions, Metrics and Filters combine to build and schedule
            reports across publisher and advertiser data. PMs, analysts and
            stakeholders all make different decisions from the same data.
          </p>
          <p className="font-ui font-normal text-text-primary text-[18px] leading-[30px] tracking-[0.09px] md:text-center">
            I designed four modules, from mid-product onwards.
          </p>
        </div>

        <div className="flex w-full justify-center">
          <div className="relative w-full max-w-[940px] overflow-hidden rounded-tl-[24px] rounded-tr-[24px] bg-bg-light md:px-20px md:pt-20px">
            <div className="aspect-[350/187] w-full overflow-hidden rounded-[24px] border border-border-default md:aspect-[900/395]">
              <AssetPlaceholder label="[ Screenshot — Analytics report builder ]" />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[100px]"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--color-bg-primary))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
