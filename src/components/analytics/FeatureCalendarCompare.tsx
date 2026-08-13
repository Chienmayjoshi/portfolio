import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import DecisionList, { type Decision } from "@/components/analytics/DecisionList";

// Source of truth: Figma node 6379:57464 (Analytics file, per CLAUDE.md).
//
// The "pending this to analytics" kicker + REJECTED/REJECTED/SHIPPED block
// (RejectedShippedTriple) removed 2026-08-07, per direct instruction —
// both were placeholders: the kicker read like a raw internal dev note
// left in the source Figma text layer, and the verdict block was
// FastRouter's own Side stepper/Top stepper/Unified form content
// (FR-05/06/07), byte-for-byte identical to FeatureMetricTaxonomy.tsx's
// copy of the same component, not anything specific to Calendar Compare.
const decisions: Decision[] = [
  {
    number: "01",
    title: "Compare toggle — off by default",
    decision:
      "Toggle off by default. Full comparison configuration reveals only when activated. The base calendar handles date selection cleanly for the majority.",
    gaveUp:
      "Always-visible comparison tab giving power users immediate access without a toggle step.",
    why: "The cognitive cost of always-visible options is paid by every user every time — including users who never compare. The cognitive cost of a toggle is paid only by users who want it. When the majority doesn't need a feature, don't make the majority pay for its visibility.",
    // Light + dark both landed together (2026-07-28) — straight to
    // ThemeAwareVideo, no interim plain-<video> step needed.
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/analytics/an-compare-toggle.mp4"
        darkSrc="/images/analytics/an-compare-toggle-dark.mp4"
        aria-label="Compare toggle for the calendar, off by default"
      />
    ),
  },
];

interface FeatureCalendarCompareProps {
  id?: string;
}

export default function FeatureCalendarCompare({ id }: FeatureCalendarCompareProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              FEATURE 03
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              CALENDAR COMPARE TOGGLE
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              Removing comparison complexity from users who aren&rsquo;t
              comparing.
            </h2>
          </div>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              Date selection and period comparison were presented as two
              equal tasks — tabs side by side, always visible. Most users
              most of the time are doing one thing: setting a date range.
              The comparison overhead was paid by everyone on every
              calendar open.
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
