import DecisionAssetFrame from "@/components/shared/DecisionAssetFrame";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";

// Source of truth: Figma node 6368:53957 (FastRouter file, per CLAUDE.md).
//
// Container unified 2026-07-16 (was: header block max-w-1016 + "Key
// Decisions" list max-w-1200, independently centered within a 1280px
// section wrapper — two different widths in one component, confirmed at
// the time against real Figma offsets). Per direct instruction, the
// whole page moved to one shared 1060px section / 980px content width
// (see design-tokens.json's width primitive note and globals.css's
// --width-content) — this section's header and decision list now share
// that single width like every other section, rather than keeping their
// own two-width split. The old Figma-matched reasoning is superseded,
// not wrong for its time — noted here rather than silently deleted.
//
// "KEY DECISIONS" label lost its pl-[40px]/pl-[90px] left indent
// 2026-07-17, per direct feedback that it misaligned the label —
// intentional reversal, not a regression: this indent was itself added
// earlier per a different direct instruction (matching the decision
// rows' own number-column offset). The label reads better flush-left,
// grouped visually with the decision list as a section heading rather
// than trying to align with an indent meant for something else.
//
// A "before/after slider" block (FR-01 vs FR-02 exploration) exists in
// Figma between the header and this decision list but is hidden there —
// skipped here too, matching the pattern already used for the hidden 5th
// FiveDecisions item.
//
// Only 2 "key decisions" here (not the case-study-wide pattern used for
// LLM Council's five) — this file has its own local row rendering rather
// than importing FiveDecisions' internal DecisionRow, since the number
// column here is 90px (not 100px) and there's no pull-quote variant to
// support. Worth reconciling into one shared component if a third
// instance of this pattern shows up.
interface ObservabilityDecision {
  number: string;
  title: string;
  decision: string;
  gaveUp: string;
  why: string;
  asset: React.ReactNode;
}

const decisions: ObservabilityDecision[] = [
  {
    number: "01",
    title: "Two filter layers — global + card-level",
    decision:
      "Global filters control the whole dashboard. Card-level filters allow tactical investigation without changing global context.",
    gaveUp: "Single filter layer — simpler to build and explain.",
    why: "Strategic analysis and tactical investigation are different cognitive modes. One filter for both forces constant context-switching.",
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/fastrouter/fr-observability-filters.mp4"
        darkSrc="/images/fastrouter/fr-observability-filters-dark.mp4"
        aria-label="Observability dashboard showing the Provider filter panel, a card-level filter layered on top of the global date-range filter"
      />
    ),
  },
  {
    number: "02",
    title: "Information hierarchy as priority stack",
    decision:
      "Section order follows the user's question sequence: what's consuming usage → how much overall → how it's trending → how fast and reliable.",
    gaveUp: "Conventional layout ordered by visual balance.",
    why: "A user arriving after an unexpected bill spike hits the most relevant information first, not buried three scrolls down.",
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/fastrouter/fr-observability-dashboard.mp4"
        darkSrc="/images/fastrouter/fr-observability-dashboard-dark.mp4"
        aria-label="Full observability dashboard showing All Keys, All Models, All Providers, All Tags, All Projects, and Gateway vs BYOK Costs panels"
      />
    ),
  },
];

// Mobile reading order (2026-07-12, explicit request): title -> asset ->
// decision/gave-up/why. Uses the flexbox `contents` + `order` technique —
// see FiveDecisions' DecisionRow for why the original CSS Grid version
// (row-spanning the asset) had a row-track-inflation bug that grew with
// asset height, and why plain flexbox avoids it entirely.
function ObservabilityDecisionRow({
  decision,
  isLast,
}: {
  decision: ObservabilityDecision;
  isLast: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-32px md:gap-40px items-start md:items-center pt-40px md:pt-80px w-full ${
        isLast ? "" : "pb-40px md:pb-80px border-b border-border-default"
      }`}
    >
      <div className="contents md:flex md:flex-col md:w-[440px] md:shrink-0 md:items-start">
        <div className="order-1 md:order-none flex items-center w-full">
          <span
            className="flex flex-col w-[90px] shrink-0 font-display font-bold text-[48px] leading-[56px] tracking-[-0.48px] text-border-frame"
          >
            {decision.number}
          </span>
          <span className="font-ui font-semibold text-text-primary text-[20px] leading-[26px] flex-1">
            {decision.title}
          </span>
        </div>

        <div className="order-3 md:order-none flex flex-col gap-12px items-start w-full md:pt-20px">
          <div className="flex items-start w-full">
            <span className="block w-[80px] md:w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
              DECISION
            </span>
            <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              {decision.decision}
            </p>
          </div>
          <div className="hidden items-start w-full">
            <span className="block w-[80px] md:w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
              GAVE UP
            </span>
            <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              {decision.gaveUp}
            </p>
          </div>
          <div className="flex items-start w-full">
            <span className="block w-[80px] md:w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
              WHY
            </span>
            <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              {decision.why}
            </p>
          </div>
        </div>
      </div>

      <DecisionAssetFrame className="order-2 md:order-none md:w-[500px] md:shrink-0">
        {decision.asset}
      </DecisionAssetFrame>
    </div>
  );
}

// `id` (2026-07-15): optional SectionRail.tsx anchor — see Hero.tsx for
// why this is a prop, not a hardcoded string.
interface ObservabilityIntroProps {
  id?: string;
}

export default function ObservabilityIntro({ id }: ObservabilityIntroProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              FEATURE 02
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              OBSERVABILITY
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2
              className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]"
            >
              AI teams had no way to see where their money was going.
            </h2>
          </div>

          <p className="font-ui text-text-primary">
            <span className="block">
              <span className="font-semibold text-[17px] leading-[28px] tracking-[0.085px]">
                Problem:{" "}
              </span>
              <span className="font-normal text-[16px] leading-[28px] tracking-[0.08px]">
                AI teams couldn&rsquo;t see where their LLM spend went. The
                first investigation after a bill
              </span>
            </span>
            <span className="block font-normal text-[16px] leading-[28px] tracking-[0.08px]">
              spike was a Slack thread, not a dashboard.
            </span>
          </p>
        </div>

        <div className="w-full flex flex-col pt-64px">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            KEY DECISIONS
          </span>

          <div className="flex flex-col items-start w-full">
            {decisions.map((decision, i) => (
              <ObservabilityDecisionRow
                key={decision.number}
                decision={decision}
                isLast={i === decisions.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
