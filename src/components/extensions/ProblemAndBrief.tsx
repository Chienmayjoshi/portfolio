// Source of truth: Figma node 6408:62 (Extensions file, per CLAUDE.md).
// Problem block mirrors fastrouter/ProblemAndProduct.tsx's Problem
// sub-block exactly (h2/h3/paragraph + pain-point row, 3 items here vs.
// FastRouter's 3 — same count, no structural change). Brief block reuses
// fastrouter/CouncilIntro.tsx's "THE BRIEF" eyebrow + border-l-3
// accent-stripe quote-card pattern (quote + attribution), since this page
// has no "What is X?" product block to reuse instead — the Brief is its
// own distinct beat here.
const painPoints = [
  "No design system across 7 extensions",
  "ATF viewport constraint on every tab open",
  "User removes with 3 clicks if not useful",
];

interface ProblemAndBriefProps {
  problemId?: string;
  briefId?: string;
}

export default function ProblemAndBrief({ problemId, briefId }: ProblemAndBriefProps) {
  return (
    <section className="w-full py-80px flex flex-col items-center">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px flex flex-col gap-64px w-full">
        <div id={problemId} className="flex flex-col w-full border-b border-border-default">
          <div className="flex flex-col w-full py-24px border-b border-border-default">
            <h2 className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px] md:whitespace-nowrap">
              The Problem
            </h2>
          </div>

          <div className="flex flex-col w-full py-24px">
            <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] tracking-[-0.1px]">
              Designing for retention. Not for the install.
            </h3>
          </div>

          <div className="flex flex-col w-full pb-24px">
            <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              A new tab replacement isn&rsquo;t a landing page. A landing
              page converts a stranger into a user. A new tab replacement
              has already converted — the install happened. Its job now is
              harder: justify itself every single time a tab opens, or get
              removed. Users can uninstall with three clicks. The design
              question isn&rsquo;t how to get installed. It&rsquo;s how to
              stay installed.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-0 md:gap-48px items-start border-t border-border-default">
            {painPoints.map((point) => (
              <div key={point} className="flex flex-col py-16px md:py-32px">
                <span className="font-ui font-semibold text-text-accent text-[14px] leading-[20px]">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div id={briefId} className="flex flex-col gap-32px items-start w-full">
          <div className="flex flex-col w-full py-24px border-b border-border-default">
            <h2 className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px] md:whitespace-nowrap">
              The Brief
            </h2>
          </div>

          <div className="flex flex-col gap-24px items-start w-full">
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              THE BRIEF
            </span>
            <div className="bg-bg-surface border-l-[3px] border-[var(--color-text-accent)] rounded-tr-sm rounded-br-sm pl-24px pr-24px py-24px flex flex-col gap-12px w-full">
              <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                &ldquo;Build something people choose to keep
                installed.&rdquo;
              </p>
              <p className="font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                — Business brief, verbatim
              </p>
            </div>
          </div>

          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            That single shift changed every design decision. Designing for
            retention means designing for the hundredth use, not the
            first. No marketing layer to fall back on. The product has to
            earn its place in the viewport, every time.
          </p>
        </div>
      </div>
    </section>
  );
}
