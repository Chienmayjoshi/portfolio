// Source of truth: Figma node 6379:57088 (Analytics file, per CLAUDE.md).
// Same structure/spacing as fastrouter/MetaBar.tsx — 4 items, 0px top /
// 80px bottom rhythm, 2x2 grid on mobile, 4-across with dividers on
// desktop. No `LIVE AT` link — Analytics is an internal tool, no public
// URL exists in the extracted Figma content.
const items = [
  { label: "ROLE", value: "Senior Product Designer" },
  { label: "TEAM", value: "2 designers · 2 PMs · mixed stakeholders" },
  { label: "USERS", value: "PMs, data analysts, senior stakeholders" },
  { label: "CONSTRAINT", value: "High data density · zero screen real estate to waste" },
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
              <span className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
