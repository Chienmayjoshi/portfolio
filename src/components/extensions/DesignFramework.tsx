// Source of truth: Figma node 6414:317 (Extensions file, per CLAUDE.md).
//
// New layout — the one section on this page without a direct 1:1
// FastRouter component to copy behavior from (FastRouter has no table).
// Built using only existing tokens/typography: desktop is a 3-column
// bordered table (RULE / WHAT IT MEANS / DESIGN IMPLICATION, header row
// styled like MetaBar's eyebrow labels); mobile collapses each rule into
// its own card using the same label+value row idiom already established
// by the DECISION/GAVE UP/WHY pattern (FiveDecisions.tsx et al.) rather
// than inventing new visual language.
const rules = [
  {
    rule: "ATF viewport rule",
    meaning:
      "The extension must be fully usable above the fold. Not a screenshot. The product, immediately.",
    implication:
      "No headlines, no value props above fold. Every extension opens with the product filling the viewport.",
  },
  {
    rule: "Permissions upfront",
    meaning:
      "All permissions — demographics, browser details, IP — collected in one consent screen.",
    implication:
      "Drip permissions interrupt a daily-use product on every feature trigger. One moment is a better trade.",
  },
  {
    rule: "Compliance footer",
    meaning:
      "Privacy Policy, Terms of Service, Uninstall, Do Not Sell, Contact — on every page.",
    implication: "Non-negotiable. Design around it, never over it or beneath it.",
  },
  {
    rule: "Asset weight",
    meaning:
      "Extensions load on every new tab. A slow extension is a removal waiting to happen.",
    implication:
      "Every visual decision carries a performance question alongside it.",
  },
];

interface DesignFrameworkProps {
  id?: string;
}

export default function DesignFramework({ id }: DesignFrameworkProps) {
  return (
    <section id={id} className="w-full py-80px flex flex-col items-center">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px flex flex-col gap-32px w-full">
        <div className="flex flex-col gap-24px items-start pb-32px border-b border-border-default w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            Four rules. Every extension ran through them.
          </span>
          <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
            The Design Framework
          </h2>
          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            Designing for browser extensions isn&rsquo;t designing a
            smaller web app. The format creates structural constraints that
            change which decisions are even available.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:flex flex-col w-full border-t border-border-default">
          <div className="flex w-full py-16px border-b border-border-default">
            <span className="w-[230px] shrink-0 font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              RULE
            </span>
            <span className="flex-1 font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              WHAT IT MEANS
            </span>
            <span className="flex-1 font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              DESIGN IMPLICATION
            </span>
          </div>
          {rules.map((r) => (
            <div
              key={r.rule}
              className="flex w-full gap-24px py-24px items-start border-b border-border-default"
            >
              <p className="w-[230px] shrink-0 font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
                {r.rule}
              </p>
              <p className="flex-1 font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px]">
                {r.meaning}
              </p>
              <p className="flex-1 font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px]">
                {r.implication}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="flex md:hidden flex-col gap-24px w-full">
          {rules.map((r) => (
            <div
              key={r.rule}
              className="bg-bg-surface border border-bg-light rounded-md p-24px flex flex-col gap-16px w-full"
            >
              <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
                {r.rule}
              </p>
              <div className="flex items-start w-full">
                <span className="block w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                  MEANS
                </span>
                <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                  {r.meaning}
                </p>
              </div>
              <div className="flex items-start w-full">
                <span className="block w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                  IMPACT
                </span>
                <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                  {r.implication}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
