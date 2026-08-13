// Source of truth: Figma node 6408:824 (Extensions file, per CLAUDE.md).
// Structure/copy identical to fastrouter/Footer.tsx — mirrored exactly.
// The footer logo mark (IMG_2065) sits inside a `hidden="true"` frame in
// Figma — stays unbuilt, matching the codebase's existing convention of
// not building hidden Figma layers.
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
