// Source of truth: Figma node 6379:57777 (Analytics file, per CLAUDE.md).
// Same structure as fastrouter/Reflections.tsx: 4 card-in-card pairs in a
// 2x2 grid, plus one closing punchy statement below (not a 5th card — the
// Figma content reads as exactly this shape: 4 title+body pairs, then a
// standalone closing line).
const reflections = [
  {
    title: "The rejected direction teaches more than the shipped one.",
    body: [
      "Top-down creation was intuitive. It failed on technical reality. That failure is what makes the shipped solution legible.",
    ],
  },
  {
    title: "Constraints redirect good design. They don't block it.",
    body: [
      "The backend ID requirement forced depth-first. The constraint and the cognitive model pointed in the same direction.",
    ],
  },
  {
    title: "Surface what others hide.",
    body: [
      "The Faulty metric category was the most deliberate call. Visible broken things build more confidence than invisible clean ones.",
    ],
  },
  {
    title: "Defaults are a statement about who you built it for.",
    body: [
      "The calendar toggle isn't a convenience feature. It's a decision about whose experience gets optimised.",
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
          Friction at high frequency isn&rsquo;t a minor inconvenience.
          It&rsquo;s a compounding cost on every user, every session, every
          day.
        </p>
      </div>
    </section>
  );
}
