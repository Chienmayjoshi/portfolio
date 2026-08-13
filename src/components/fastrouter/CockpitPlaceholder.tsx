// Source of truth: Figma node 6368:53641 (FastRouter file, per CLAUDE.md).
// This is a real placeholder in Figma itself — bracketed italic text
// standing in for an illustration that hasn't been dropped into the file
// yet. Reproducing that placeholder state as-is rather than inventing
// artwork. Swap for an <Image> once the real asset lands in Figma/
// public/images/fastrouter/.
//
// Two deviations from the raw Figma node, same class of issue already
// flagged in Hero: the placeholder text is bound to a dark-mode color
// (text/on-dark-muted, #888888) despite sitting on a light background —
// using the light-mode text-muted token (#6B6B6B) instead. And the
// placeholder text's font is bound to DM Sans Italic in Figma, which is
// stale per CLAUDE.md's font policy — using Google Sans Flex (synthetic
// italic via font-style, since no italic face is loaded for it).
//
// Full-bleed by design: unlike Hero/MetaBar this section has no 1136px
// container and 0px top/bottom section padding — confirmed intentional
// per CLAUDE.md's documented rhythm exception for this section.
//
// Responsive conversion (2026-07-12): fixed h-[480px] shrinks on mobile
// (still full-bleed, just shorter) since there's no illustration content
// dictating a minimum height — it's a placeholder box. Both `whitespace-
// nowrap` captions would overflow a mobile viewport, so mobile drops nowrap
// and adds side padding to let them wrap; engineering judgment, no Figma
// mobile ref.
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
