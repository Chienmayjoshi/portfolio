// Source of truth: Figma node 6368:54410 (FastRouter file, per CLAUDE.md).
// Built FastRouter-scoped for now, not in shared/, per CLAUDE.md's build
// order (don't build cross-case-study infra before it's proven on one) —
// promote to shared/ once Analytics/Extensions need the same footer.
//
// Width changed 2026-07-16, per direct feedback: was
// max-w-[var(--width-content)] (1060px, matching the rest of the case
// study), now max-w-[1440px] — the footer spans the full page-level
// wrapper width (see page.tsx, where it's rendered as a sibling of the
// [rail|main|placeholder] row rather than nested inside <main>, which is
// fixed at 1060px) instead of matching the narrower content column.
//
// Only "Email" has a real destination (mailto, same address as the
// "Let's talk" button). LinkedIn / AI Practices / Design Taste / Store
// have no URLs specified anywhere in Figma or content docs — rendered as
// inert text rather than fabricated links, per CLAUDE.md's "never invent"
// rule extended to link destinations. Needs real URLs before shipping.
const navLinks = ["LinkedIn", "AI Practices", "Design Taste", "Store"];

export default function Footer() {
  return (
    <footer className="w-full py-80px flex justify-center">
      <div className="max-w-[1440px] w-full px-[var(--edge-padding)] md:px-40px flex flex-col">
        <div className="pb-32px border-b border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-24px w-full">
          <div className="flex flex-col gap-12px">
            <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Chinmay Joshi
            </p>
            <p className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              lead product designer
            </p>
          </div>

          <div className="flex flex-wrap gap-16px sm:gap-32px items-center">
            <a
              href="mailto:chinmay.joshi02@gmail.com"
              className="font-ui font-normal text-text-muted text-[14px] leading-[20px] tracking-[0.07px] hover:text-text-primary transition-colors"
            >
              Email
            </a>
            {navLinks.map((label) => (
              <span
                key={label}
                className="font-ui font-normal text-text-muted text-[14px] leading-[20px] tracking-[0.07px]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-32px flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8px w-full">
          <p className="capitalize font-ui font-normal text-text-muted text-[12px] leading-[18px] tracking-[0.06px]">
            © 2026 Chinmay Joshi
          </p>
          <p className="capitalize font-ui font-normal text-text-muted text-[12px] leading-[18px] tracking-[0.06px]">
            Coded by AI. Designed by me. Architects don&rsquo;t pour
            concrete.
          </p>
        </div>
      </div>
    </footer>
  );
}
