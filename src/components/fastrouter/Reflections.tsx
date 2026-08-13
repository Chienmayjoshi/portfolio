// Source of truth: Figma node 6368:54321 (FastRouter file, per CLAUDE.md).
// "decision-title" (h3s) still bound to DM Sans in Figma — already a
// documented known gap in CLAUDE.md; using Google Sans Flex.
//
// Re-synced 2026-07-13: user redesigned the cards in Figma (a card-within-
// card treatment — bg-light 6px frame around a white, rounded, drop-
// shadowed inner card, replacing the previous flat bordered card) and
// revised some copy. Titles no longer need forced multi-line breaks (all
// four are single Figma text nodes now, wrapping naturally); two of the
// four bodies now hard-break across 2 lines in Figma (kept here via
// `body: string[]`), the other two are single-line arrays.
const reflections = [
  {
    title: "Read the domain before you read the brief.",
    body: [
      "Karpathy reframed the problem from output synthesis to trust architecture before designing any screen.",
    ],
  },
  {
    title: "Process visibility is proof of rigour.",
    body: [
      "Showing how the verdict was reached did more for",
      "trust than any copy or explanation could.",
    ],
  },
  {
    title: "No existing pattern, no inherited constraints.",
    body: [
      "Every decision reasoned from scratch. Harder to navigate, more considered than adapting an existing pattern.",
    ],
  },
  {
    title: "Holding a position is part of senior design.",
    body: [
      "The verdict-first call was pushed back on. It shipped",
      "because I didn't fold on the reasoning.",
    ],
  },
];

// `id` (2026-07-15): optional SectionRail.tsx anchor — see Hero.tsx for
// why this is a prop, not a hardcoded string.
interface ReflectionsProps {
  id?: string;
}

export default function Reflections({ id }: ReflectionsProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full px-[var(--edge-padding)] md:px-40px flex flex-col gap-32px">
        <div className="pb-32px border-b border-border-default flex flex-col gap-32px w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            REFLECTIONS
          </span>
          <h2
            className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]"
          >
            What this taught me
          </h2>
        </div>

        <div className="pb-32px border-b border-border-default flex flex-col gap-24px w-full">
          <div className="flex flex-col md:flex-row gap-24px items-stretch w-full">
            {reflections.slice(0, 2).map((item) => (
              <div
                key={item.title}
                className="flex-1 bg-bg-light rounded-xl p-6px w-full"
              >
                <div className="bg-bg-surface rounded-[14px] p-32px flex flex-col gap-12px w-full shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)]">
                  <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[26px]">
                    {item.title}
                  </h3>
                  <p className="font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                    {item.body.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-24px items-stretch w-full">
            {reflections.slice(2, 4).map((item) => (
              <div
                key={item.title}
                className="flex-1 bg-bg-light rounded-xl p-6px w-full"
              >
                <div className="bg-bg-surface rounded-[14px] p-32px flex flex-col gap-12px w-full shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)]">
                  <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[26px]">
                    {item.title}
                  </h3>
                  <p className="font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                    {item.body.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="font-ui font-semibold text-text-primary text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] tracking-[-0.1px]">
          Getting the right answer from AI is a solved problem. Knowing
          whether to trust it isn&rsquo;t. That&rsquo;s the design problem.
        </p>
      </div>
    </section>
  );
}
