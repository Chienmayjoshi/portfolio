// Source of truth: Figma node 6408:359 (Extensions file, per CLAUDE.md).
// Reuses fastrouter/HonestFailure.tsx's exact structure/spacing
// (bg-bg-light, py-80px, mb-60px, label -> 10px -> paragraph). That file's
// pull-quote sub-block is dropped here — only a label+paragraph were
// captured in this section's extracted Figma content, no separate
// standalone quote line, so one isn't invented to fill the slot.
export default function OneHonestFailure() {
  return (
    <section className="w-full bg-bg-light py-80px mb-60px flex items-start justify-center">
      <div className="max-w-[680px] w-full flex flex-col items-start px-[var(--edge-padding)] md:px-0">
        <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
          ONE HONEST FAILURE
        </span>

        <p className="pt-10px font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
          Permission screen copy. Collecting all permissions upfront was the
          right compliance decision. But the copy treated it as a legal
          requirement. Each permission listed without explaining what
          feature it unlocks. Should have added one line per permission:
          what it enables, not just what it accesses. The trust cost of
          that gap was real.
        </p>
      </div>
    </section>
  );
}
