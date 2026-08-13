// Source of truth: Figma node 6379:57122 (Analytics file, per CLAUDE.md).
//
// FLAGGED: both the bracketed placeholder text and the caption below it
// are byte-for-byte identical to fastrouter/CockpitPlaceholder.tsx's copy
// ("[ Procreate illustration — cockpit with no instruments ]" / "The AI
// product making decisions at scale — with no instruments to read from.")
// — this reads as an uncustomized copy-paste from the FastRouter file
// rather than Analytics-specific content. Built verbatim per direct
// instruction (Figma is canonical, don't invent replacement copy); worth
// fixing at the source once the Analytics illustration/caption are
// authored for real.
//
// Structure identical to fastrouter/CockpitPlaceholder.tsx — full-bleed,
// no section container, 0px top/bottom padding.
export default function CockpitPlaceholder() {
  return (
    <section className="w-full bg-bg-surface flex flex-col items-center">
      <div className="w-full h-[220px] md:h-[480px] bg-bg-light flex items-center justify-center px-[var(--edge-padding)]">
        <p
          className="font-ui font-normal italic text-text-muted text-[14px] leading-[21px] text-center md:whitespace-nowrap"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          [ Procreate illustration — cockpit with no instruments ]
        </p>
      </div>
      <div className="pt-20px px-[var(--edge-padding)]">
        <p className="font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px] text-center md:whitespace-nowrap">
          The AI product making decisions at scale — with no instruments to
          read from.
        </p>
      </div>
    </section>
  );
}
