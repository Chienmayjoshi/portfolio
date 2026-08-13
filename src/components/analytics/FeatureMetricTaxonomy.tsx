import ThemeSwap from "@/components/shared/ThemeSwap";
import DecisionList, { type Decision } from "@/components/analytics/DecisionList";

// Source of truth: Figma node 6379:57570 (Analytics file, per CLAUDE.md).
//
// The "pending this to analytics" kicker + REJECTED/REJECTED/SHIPPED block
// (RejectedShippedTriple) removed 2026-08-07, per direct instruction — same
// placeholder content as FeatureCalendarCompare.tsx (see that file's
// comment), not anything specific to Metric Taxonomy.
const decisions: Decision[] = [
  {
    number: "01",
    title: "Six categories from scratch",
    decision:
      "A taxonomy built from how metrics are actually constructed — Base, Time, Transformed, Segment, and Filter group. Faulty surfaced separately as a visible, filterable toggle, not hidden silently. Custom metrics in blue, system metrics in default dark.",
    gaveUp: "A cleaner panel showing only healthy metrics.",
    why: "Surfacing broken metrics gives users a data integrity signal before they build a report on unreliable data. Most tools hide this. Hiding it optimises for the appearance of cleanliness over actual trustworthiness.",
    // Light + dark landed 2026-07-31.
    asset: (
      /* eslint-disable-next-line @next/next/no-img-element -- fixed
         decorative capsule content, sized to fill; see
         ProductBrowserMockup.tsx for the same Tailwind-preflight/
         next-image sizing conflict this avoids. */
      <ThemeSwap
        light={
          <img
            src="/images/analytics/an-six-categories-from-scratch.png"
            alt="Six-category metric taxonomy panel — Base, Time, Transformed, Segment, and Filter group, plus a separate Faulty dimension toggle"
            className="block size-full object-cover object-top"
          />
        }
        dark={
          <img
            src="/images/analytics/an-six-categories-from-scratch-dark.png"
            alt="Six-category metric taxonomy panel — Base, Time, Transformed, Segment, and Filter group, plus a separate Faulty dimension toggle"
            className="block size-full object-cover object-top"
          />
        }
      />
    ),
  },
  {
    number: "02",
    title: "Multi-popup replaced with breadcrumb navigation",
    decision:
      "Info icons on metrics previously spawned cascading 3–4 overlapping popups. Replaced with a single popup and breadcrumb trail — sequential navigation within one contained surface.",
    gaveUp: "Separate popups per metric level — simpler technically, unworkable at depth.",
    why: "The same root cause as on-the-fly creation — users losing their place inside a nested workflow. Same mechanism, different problem. Intentional product consistency, not lazy repetition.",
    // Light + dark landed 2026-07-31.
    asset: (
      /* eslint-disable-next-line @next/next/no-img-element -- fixed
         decorative capsule content, sized to fill; see
         ProductBrowserMockup.tsx for the same Tailwind-preflight/
         next-image sizing conflict this avoids. */
      <ThemeSwap
        light={
          <img
            src="/images/analytics/an-multi-popup-replaced-with-breadcrumb-navigation.png"
            alt="A single popup with a breadcrumb trail showing the full metric dependency chain, replacing cascading overlapping popups"
            className="block size-full object-cover object-top"
          />
        }
        dark={
          <img
            src="/images/analytics/an-multi-popup-replaced-with-breadcrumb-navigation-dark.png"
            alt="A single popup with a breadcrumb trail showing the full metric dependency chain, replacing cascading overlapping popups"
            className="block size-full object-cover object-top"
          />
        }
      />
    ),
  },
];

interface FeatureMetricTaxonomyProps {
  id?: string;
}

export default function FeatureMetricTaxonomy({ id }: FeatureMetricTaxonomyProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              FEATURE 04
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              METRIC TAXONOMY
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              Making 100+ metrics and dimensions navigable for users who
              think about data very differently.
            </h2>
          </div>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              The metric and dimensions panel was an undifferentiated list.
              Analysts who knew metric names could search and find. PMs who
              think in business outcomes had no reliable way in. At 100+
              entries, the list was navigable only by luck or tribal
              knowledge.
            </span>
          </p>
        </div>

        <div className="w-full flex flex-col pt-64px">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            two KEY DECISIONS
          </span>
          <DecisionList decisions={decisions} />
        </div>
      </div>
    </section>
  );
}
