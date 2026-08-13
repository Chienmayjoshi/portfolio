// Source of truth: Figma node 6368:53945 ("ONE HONEST FAILURE" callout,
// FastRouter file, per CLAUDE.md). CLAUDE.md already flags this exact
// component as "built off-system in Figma... the least reliable reference
// point in the file" and documents the corrections to apply:
// - 64px top/bottom section padding in Figma -> 60px (standard rhythm).
// - mb-60px added 2026-07-12, not from Figma: the bg-light callout box was
//   sitting flush against Feature 02 below it with only its own internal
//   padding separating them, so the color/section boundary read as
//   continuous rather than a self-contained callout. The margin adds an
//   actual gap of page background between the two.
// - Two non-grid internal gaps (10.7px, 18.5px) -> round to nearest grid
//   value. Label->paragraph is the 10.7px gap, rounded to 10px (space-10).
//   Paragraph->quote is the 18.5px gap; Figma also adds a further 12px of
//   padding inside the quote's own wrapper on top of that gap, making two
//   adjacent spacing decisions for one visual gap. Simplified to a single
//   32px margin (space-32, already a confirmed token) rather than
//   reproduce a redundant gap+padding split that isn't a deliberate
//   design decision — just an artifact of this component's off-system
//   Figma construction.
export default function HonestFailure() {
  return (
    <section className="w-full bg-bg-light py-80px mb-60px flex items-start justify-center">
      <div className="max-w-[680px] w-full flex flex-col items-start px-[var(--edge-padding)] md:px-0">
        <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
          ONE HONEST FAILURE
        </span>

        <p className="pt-10px font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
          <span className="block">
            The cog icon for the council composition panel wasn&rsquo;t
            discoverable. Fix: default the
          </span>
          <span className="block">
            panel open on first entry. Lesson: novel features shouldn&rsquo;t
            inherit conventional
          </span>
          <span className="block">
            navigation patterns. The configuration is the feature.
          </span>
        </p>

        <div className="pt-32px w-full">
          <div className="flex items-start border-l-[3px] border-[var(--color-text-accent)] pl-20px">
            <p
              className="font-display font-semibold text-text-primary text-[20px] leading-[32px]"
            >
              The configuration IS the feature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
