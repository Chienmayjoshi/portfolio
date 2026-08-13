// Source of truth: Figma node 6368:53618 (FastRouter file, per CLAUDE.md).
// Sits directly under Hero with no added gap — this section is 0px top /
// 60px bottom padding (the border-t below is the only separator), an
// undocumented rhythm exception alongside the ones already listed in
// CLAUDE.md's "Known Figma/code sync gaps." Measured directly off the node.
//
// Responsive conversion (2026-07-12): the 4-column row has no room to
// breathe at mobile widths, so it becomes a 2x2 grid below `md`. The
// between-column `border-r` divider is desktop-only (`md:border-r`) since
// it doesn't map cleanly onto a 2x2 grid without asymmetric borders on the
// last column of row 1 — engineering judgment, no Figma mobile ref.
const items = [
  { label: "ROLE", value: "Senior Product Designer" },
  { label: "TEAM", value: "1 PM, 2 Engineers" },
  { label: "TIMELINE", value: "4 Weeks 2025-26" },
  { label: "LIVE AT", value: "fastrouter.ai ↗", href: "https://fastrouter.ai" },
];

export default function MetaBar() {
  return (
    <section className="w-full bg-bg-primary pb-80px">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px">
        <div className="grid grid-cols-2 md:flex gap-x-24px gap-y-0 md:gap-24px items-start border-t border-border-default">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={`flex md:flex-1 flex-col gap-12px items-start py-24px ${
                i < items.length - 1 ? "md:border-r border-border-default" : ""
              }`}
            >
              <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
                {item.label}
              </span>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui font-normal text-text-accent text-[16px] leading-[28px] tracking-[0.08px]"
                >
                  {item.value}
                </a>
              ) : (
                <span className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
