// Source of truth: Figma node 6379:57701 (Analytics file, per CLAUDE.md).
// Same eyebrow/headline/paragraph/stat-grid structure as
// fastrouter/Impact.tsx, minus its Before/After two-card row (no such
// content exists for Analytics in the extracted Figma copy). The "ONE
// HONEST FAILURE" callout that closes fastrouter/Impact.tsx's page as its
// own separate section instead sits inside this same Impact block in the
// Analytics file — rendered inline here with the same accent-stripe
// pull-quote-free treatment fastrouter/HonestFailure.tsx uses (label +
// paragraph only; no separate pull-quote line was captured for this one).
const stats = [
  {
    number: "Zero",
    label: "Exit-and-return loops",
    description:
      "Metric creation that used to interrupt itself now completes without a single context switch.",
  },
  {
    number: "Minutes",
    label: "Time to first data",
    description:
      "Analysts reached partial results before the full query finished — analysis no longer waited on the queue.",
  },
  {
    number: "100+",
    label: "Metrics made navigable",
    description:
      "A taxonomy built from scratch so PMs and analysts could both find what they needed, without tribal knowledge.",
  },
];

interface ImpactProps {
  id?: string;
}

export default function Impact({ id }: ImpactProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full px-[var(--edge-padding)] md:px-40px flex flex-col gap-32px">
        <div className="pb-32px border-b border-border-default flex flex-col gap-32px w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            IMPACT
          </span>
          <h2 className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
            Four features. One compounding fix.
          </h2>
        </div>

        <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
          The internal conversation shifted from &ldquo;why does this take so
          long&rdquo; to &ldquo;how do we get more from the data we
          have.&rdquo; Analysts could build without interruption, reach
          partial data without waiting on queues, and navigate 100+ metrics
          and dimensions by how they&rsquo;re built — not just by name.
        </p>

        <div className="pb-32px border-b border-border-default flex flex-col md:flex-row gap-24px items-stretch w-full">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex-1 bg-bg-surface border border-bg-light rounded-md p-32px flex flex-col gap-8px w-full"
            >
              <p className="font-display font-bold text-text-primary text-[32px] leading-[44px] tracking-[0.5px]">
                {stat.number}
              </p>
              <p className="font-ui font-semibold text-text-primary text-[20px] leading-[26px]">
                {stat.label}
              </p>
              <p className="pt-8px font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-bg-light rounded-md p-32px flex flex-col items-start w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            ONE HONEST FAILURE
          </span>
          <p className="pt-10px font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            The taxonomy came after the metrics. It should have come with
            them. Categorisation built into the creation flow from day one
            means every new metric arrives already classified — retrofitting
            structure is always more expensive than building with it.
          </p>
        </div>
      </div>
    </section>
  );
}
