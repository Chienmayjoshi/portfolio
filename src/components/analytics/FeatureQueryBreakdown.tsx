import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import ThemeSwap from "@/components/shared/ThemeSwap";
import RejectedDirectionCard from "@/components/analytics/RejectedDirectionCard";
import DecisionList, { type Decision } from "@/components/analytics/DecisionList";

// Source of truth: Figma node 6379:57339 (feature intro + KEY DECISIONS)
// and nested node 6379:57363 (rejected direction) — Analytics file, per
// CLAUDE.md.
//
// Figma has a "Before/After slider — FR-01 vs FR-02" block here (bracket-
// placeholder text, using FastRouter's own FR- numbering). FastRouter's
// own ObservabilityIntro.tsx skipped this exact hidden-in-Figma slider
// block ("exists in Figma... but is hidden there — skipped here too") —
// per direct instruction, skipped here for the same reason: no slider
// component exists anywhere in the codebase yet, building one now would be
// new interactive work, not template reuse.
//
// FLAGGED: the rejected-direction card's tag reads "FR-11" — FastRouter's
// own numbering, not relabeled for Analytics. Kept verbatim per direct
// instruction (Figma is canonical, don't invent replacement copy).
const decisions: Decision[] = [
  {
    number: "01",
    title: "Pre-select Split Query with auto-execution",
    decision:
      "Split Query arrives pre-selected with a tinted background and a countdown timer. If the user doesn't override within the window, it executes automatically. Queue remains available but requires active selection.",
    gaveUp: "Equal-weight presentation requiring active choice every time.",
    why: "Pre-selection and auto-execution encode the recommendation behaviourally. Users who trust the default pay zero decision cost. The timer gives users who genuinely need complete data a window to override. Treating both options as equal would imply a parity that doesn't exist.",
    // Light + dark both landed together (2026-07-27) — straight to
    // ThemeAwareVideo, no interim plain-<video> step needed.
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/analytics/an-pre-select-split-query-with-auto-execution.mp4"
        darkSrc="/images/analytics/an-pre-select-split-query-with-auto-execution-dark.mp4"
        aria-label="Split Query pre-selected with a tinted background and countdown timer before auto-execution"
      />
    ),
  },
  {
    number: "02",
    title: "Date direction control",
    decision: "A 'Run oldest / latest date first' dropdown within Split Query.",
    gaveUp: "Fixed execution order — simpler, one less decision for the user.",
    why: "Analysts on recent trends need latest data first. Analysts auditing historical issues need oldest. The dropdown gives users agency over which segment arrives first — without requiring them to understand how the split works technically.",
    // Light + dark both landed together (2026-07-27) — straight to
    // ThemeSwap, no interim plain-<img> step needed.
    asset: (
      /* eslint-disable-next-line @next/next/no-img-element -- fixed
         decorative capsule content, sized to fill; see
         ProductBrowserMockup.tsx for the same Tailwind-preflight/
         next-image sizing conflict this avoids. */
      <ThemeSwap
        light={
          <img
            src="/images/analytics/an-date-direction-control.png"
            alt="'Run oldest / latest date first' dropdown control within Split Query"
            className="block size-full object-cover object-top"
          />
        }
        dark={
          <img
            src="/images/analytics/an-date-direction-control-dark.png"
            alt="'Run oldest / latest date first' dropdown control within Split Query"
            className="block size-full object-cover object-top"
          />
        }
      />
    ),
  },
];

interface FeatureQueryBreakdownProps {
  id?: string;
}

export default function FeatureQueryBreakdown({ id }: FeatureQueryBreakdownProps) {
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
              QUERY BREAKDOWN
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              Analysts needed data to start working. The queue wasn&rsquo;t
              giving them any.
            </h2>
          </div>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              Large queries went to Queue — a resource management system
              that ran jobs when server capacity freed up. The problem:
              queues stalled. Hours would pass. Users had no partial data
              to work with, no visibility into when results would arrive,
              and no path forward except waiting. Analysis blocked
              entirely until the full dataset returned — or didn&rsquo;t.
            </span>
          </p>

          <RejectedDirectionCard
            title="Equal-weight presentation with balanced copy"
            tag="FR-11"
            description="Both options at equal weight, descriptive copy under each explaining the tradeoffs."
            whyTitle="Balanced copy implies parity that doesn't exist"
            whyDescription="Split Query is better for the overwhelming majority. And users hit this state mid-analysis — they need a path forward, not an education on query infrastructure."
          />
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
