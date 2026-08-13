// Source of truth: Figma node 6368:54236 (FastRouter file, per CLAUDE.md).
// Chapter-close section: Before/After summary, a 3-stat "why it mattered"
// row, and a closing validation paragraph.
//
// Card padding (px-29/py-25 on the Before/After cards) rounded to the
// established p-32px used by every other card in this same section (the
// 3-stat cards) — reads as drift from a shared 32px card-padding
// convention, not a deliberate 29/25 decision.
//
// Stat number color uses Figma's literal #111111, ~4 units off
// text-primary (#0D0D0D) — same tolerance-band pattern already flagged
// elsewhere in this build; mapped to text-primary.
const stats = [
  {
    number: "1",
    label: "UX Precedent",
    description: "Council. No comparable pattern existed in the LLM gateway space.",
  },
  {
    number: "1",
    label: "Investigation workflow",
    description:
      "what consumed it, how much, why — answered in one dashboard without a Slack thread.",
  },
  {
    number: "3",
    label: "Analytical Intents",
    description:
      "Single View, Multiple Baseline, Compare Mode. Three distinct user questions. One report surface.",
  },
];

// `id` (2026-07-15): optional SectionRail.tsx anchor — see Hero.tsx for
// why this is a prop, not a hardcoded string.
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
          <h2
            className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]"
          >
            <span className="block">Three features. One problem.</span>
            <span className="block">No existing playbook.</span>
          </h2>
        </div>

        <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
          The same underlying problem. Three different surfaces. One direction of change.
        </p>

        <div className="flex flex-col md:flex-row gap-24px items-start w-full">
          <div className="flex-1 bg-bg-surface border border-bg-light rounded-md p-32px flex flex-col gap-12px w-full">
            <span className="font-ui font-medium text-text-error text-[13px] uppercase tracking-[0.78px]">
              Before
            </span>
            <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Cost discovered from billing alerts. Model selection dressed up
              as strategy. Output quality judged by whoever ran the prompt.
            </p>
          </div>
          <div className="flex-1 bg-bg-surface border border-bg-light rounded-md p-32px flex flex-col gap-12px w-full">
            <span className="font-ui font-medium text-text-success text-[13px] uppercase tracking-[0.78px]">
              After ✓
            </span>
            <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              A dashboard that answers the bill-spike question before Slack
              does. Model selection that&rsquo;s defensible. A verdict no
              single model could give.
            </p>
          </div>
        </div>

        <div className="pb-32px border-b border-border-default flex flex-col md:flex-row gap-24px items-stretch w-full">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex-1 bg-bg-surface border border-bg-light rounded-md p-32px flex flex-col gap-8px w-full"
            >
              <p
                className="font-display font-bold text-text-primary text-[32px] leading-[44px] tracking-[0.5px]"
              >
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

        <p
          className="font-display font-semibold text-text-primary text-[20px] leading-[32px]"
        >
          Since shipping, Perplexity launched a feature called Model
          Council. Multiple Claude Code skills followed the same pattern.
          The deliberation architecture wasn&rsquo;t a product experiment —
          it was the right answer.
        </p>
      </div>
    </section>
  );
}
