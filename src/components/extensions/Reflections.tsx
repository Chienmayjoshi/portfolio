// Source of truth: Figma node 6408:735 (Extensions file, per CLAUDE.md).
// Same structure as fastrouter/Reflections.tsx: 4 card-in-card pairs in a
// 2x2 grid, plus one closing punchy statement — matches exactly, no
// structural change needed.
const reflections = [
  {
    title: "The brief determines the design philosophy.",
    body: [
      "Retention and conversion aren't different framings of the same problem — they're different problems entirely.",
    ],
  },
  {
    title: "Hard constraints clarify more than they restrict.",
    body: [
      "Viewport limits, performance budgets, compliance requirements — each one eliminated optionality and sharpened the decision.",
    ],
  },
  {
    title: "Fast delivery doesn't excuse craft. It demands more of it.",
    body: [
      "At 3–5 days per extension, visual decisions don't get revisited after shipping. They ship as designed. That's not a trade-off — it's a different kind of discipline.",
    ],
  },
  {
    title: "No design system forced sharper decisions.",
    body: [
      "Each extension designed independently — no inherited patterns to lean on meant every choice had to be justified from scratch.",
    ],
  },
];

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
          <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
            What this taught me
          </h2>
        </div>

        <div className="pb-32px border-b border-border-default flex flex-col gap-24px w-full">
          <div className="flex flex-col md:flex-row gap-24px items-stretch w-full">
            {reflections.slice(0, 2).map((item) => (
              <div key={item.title} className="flex-1 bg-bg-light rounded-xl p-6px w-full">
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
              <div key={item.title} className="flex-1 bg-bg-light rounded-xl p-6px w-full">
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
          Anyone can design for the install. The harder problem is
          designing for every tab open after it.
        </p>
      </div>
    </section>
  );
}
