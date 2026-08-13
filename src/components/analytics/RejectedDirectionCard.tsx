// Local to analytics/ — used twice (Metric Creation, Query Breakdown
// features), following the same "own comparison card per feature file"
// precedent fastrouter/RejectedVsShipped.tsx and
// fastrouter/EvaluationsFeature.tsx already establish (two independent,
// structurally-similar comparison components rather than one shared one).
//
// No exact Figma visual reference was captured for this single-card
// "REJECTED DIRECTION" variant beyond its text content — FastRouter only
// has the 2-column REJECTED/SHIPPED and REJECTED-V1/REJECTED-V2 patterns,
// not a standalone single card. Built here reusing only established
// tokens/typography (text-error eyebrows matching RejectedVsShipped's
// REJECTED label, bg-bg-surface/border-bg-light card matching Impact's
// before/after cards, a small bg-bg-light pill for the "attempted"/
// category tags) rather than inventing new visual language.
interface RejectedDirectionCardProps {
  title: string;
  tag: string;
  description: string;
  whyTitle: string;
  whyDescription: string;
}

export default function RejectedDirectionCard({
  title,
  tag,
  description,
  whyTitle,
  whyDescription,
}: RejectedDirectionCardProps) {
  return (
    <div className="bg-bg-surface border border-bg-light rounded-md p-32px flex flex-col gap-24px w-full">
      <div className="flex flex-col gap-12px">
        <span className="font-ui font-medium text-text-error text-[13px] uppercase tracking-[0.78px]">
          REJECTED DIRECTION
        </span>
        <div className="flex flex-wrap items-center gap-12px">
          <span className="bg-bg-light rounded-full px-12px py-4px font-ui font-medium text-text-muted text-[12px] uppercase tracking-[0.6px]">
            attempted
          </span>
          <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
            {title}
          </p>
          <span className="bg-bg-light rounded-full px-12px py-4px font-ui font-medium text-text-muted text-[12px] uppercase tracking-[0.6px]">
            {tag}
          </span>
        </div>
        <p className="font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px]">
          {description}
        </p>
      </div>

      <div className="pt-24px border-t border-border-default flex flex-col gap-12px">
        <span className="font-ui font-medium text-text-error text-[13px] uppercase tracking-[0.78px]">
          WHY IT FAILED
        </span>
        <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
          {whyTitle}
        </p>
        <p className="font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px]">
          {whyDescription}
        </p>
      </div>
    </div>
  );
}
