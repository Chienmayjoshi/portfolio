// Source of truth: Figma node 6408:650 (Extensions file, per CLAUDE.md).
//
// FLAGGED: this section's intro paragraph is word-for-word identical to
// FiveMoreExtensions.tsx's own intro paragraph (see that file's comment)
// — two sections doing the same job in the source Figma file. Built
// verbatim per direct instruction.
//
// Same eyebrow/headline/paragraph/stat-grid structure as
// fastrouter/Impact.tsx and analytics/Impact.tsx, minus the Before/After
// two-card row and "ONE HONEST FAILURE" callout — Extensions has its own
// standalone honest-failure section (OneHonestFailure.tsx) elsewhere on
// the page instead of folding it into Impact.
const stats = [
  {
    number: "7",
    label: "Extensions shipped",
    description: "11 months · sole designer across all seven",
  },
  {
    number: "3–5",
    label: "Days per extension",
    description: "Research through final screens. Speed didn't trade off quality.",
  },
  {
    number: "0",
    label: "Exit loops in the interaction",
    description: "The ATF principle held across all seven without structural rework.",
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
            Seven extensions shipped. Scope expanded. Quality held.
          </h2>
        </div>

        <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
          The project started with a single extension. It became seven
          because the quality of the first made the next ones a foregone
          conclusion. Stakeholders explicitly recognised the premium
          design and UX quality — and flagged delivery pace as a
          strength, not a trade-off.
        </p>

        <div className="flex flex-col md:flex-row gap-24px items-stretch w-full">
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
      </div>
    </section>
  );
}
