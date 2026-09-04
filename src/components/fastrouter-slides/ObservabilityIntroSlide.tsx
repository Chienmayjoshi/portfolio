import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Chapter-06 opener for the fastrouter-slides deck — "Observability" feature
// intro, Figma desktop node 7205:102560 ("feature 2 -  Observability"), file
// 2aoIFdaJMyNBEWeQESBEzG. Sibling of CouncilIntroSlide: same centred title-card
// shape (ghost-number eyebrow, display headline, supporting line), same
// inverted surface, one slide further into the deck.
//
// NO MOBILE FIGMA FRAME EXISTS for this slide — decision 01 of the Council
// chapter and the Council intro both have one (7317:12157), this doesn't. The
// mobile treatment here is CouncilIntroSlide's, which IS Figma-derived, applied
// unchanged: same container rhythm (gap-56 / px-32 / py-80), same eyebrow
// step-down (28px crop band, 32/40 numeral, 17/28 label), same 32/40 headline,
// same 18/30 supporting line. Two sibling feature intros the reader meets in
// sequence should not diverge on mobile on the strength of a guess. Re-verify
// if a mobile frame lands.
//
// Desktop values, all verified per-node rather than assumed from the sibling:
//   eyebrow row  gap-16, ghost "02" in a 40px crop band, Season Mix 48/56 in
//                border-frame (node 7205:112037-39); label pt-8, Google Sans
//                Flex SemiBold 28/40/-0.1 in text-primary (7205:112042).
//   headline     Season Mix 56/64/-0.56, centred, TWO EXPLICIT LINES in Figma
//                (7205:112045) — hence the desktop-only <br>; block carries
//                py-40 (7205:112043).
//   supporting   Google Sans Flex Regular 16/28/+0.08, centred, also two
//                explicit lines (7205:112047); block carries pb-40
//                (7205:112046).
//   rhythm       32 between all three blocks. 48 + 32 + 208 + 32 + 96 = the
//                content frame's own 416px height (7205:112036).
// Both hard line breaks are `hidden md:block` so desktop matches Figma's
// composition exactly while mobile reflows — same technique CouncilIntroSlide
// uses for its own headline.
//
// SURFACE: `chapter-intro-invert` (globals.css) renders this slide as the
// INVERSE of the reader's global theme, so crossing into it reads as "entering
// a new feature set" — the established treatment for feature intros. Confirmed
// against Figma: this frame and the Council intro frame are both drawn on the
// dark surface with the header's *sun* toggle, i.e. the same inverted state,
// not a one-off dark slide. The slide uses normal bg-/text- tokens; the class
// re-scopes their CSS variables. The rail is marked `invert` for this slide too
// (SLIDE_RAIL_MODE in the page) so its ticks contrast correctly.
export default function ObservabilityIntroSlide() {
  return (
    <section
      id="observability-intro"
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      {/* Same grid decoration and cell sizes as CouncilIntroSlide, deliberately
          — Figma draws it here at y191/h800 with the 44.44px tiling every other
          slide uses, but the two feature intros are read back-to-back and
          matching the sibling matters more than 4px of decorative cell. */}
      <GridDepthLayer className="absolute inset-0 w-full [--grid-cell:24px] md:[--grid-cell:40px]" />

      {/* Mobile is a padded title block in the touch stack (no fixed viewport to
          centre within); desktop centres vertically. 56px isn't in this
          project's spacing scale, so it's an arbitrary value — a NAMED
          `gap-56px` silently generates nothing and collapses to 0. */}
      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-[56px] px-32px py-80px md:h-full md:justify-center md:gap-32px md:px-80px md:py-0">
        {/* Eyebrow: ghost number + feature name. Row is top-aligned; the label
            box's pt-8 drops its baseline to sit against the cropped numeral. */}
        <div className="flex items-start gap-16px">
          {/* Ghost number, cropped to a band (the "peeking numeral" — the band
              is shorter than the glyph's line box, so only its top shows). */}
          <div className="flex h-[28px] items-start justify-center overflow-hidden px-4px md:h-40px">
            <span className="font-display text-[32px] text-border-frame leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              02
            </span>
          </div>
          <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
            <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
              Observability
            </span>
          </div>
        </div>

        {/* Headline — Figma's two-line desktop composition; flows on mobile. */}
        <h1 className="w-full text-center font-display text-slide-title-sm text-text-primary md:py-40px md:text-slide-title">
          AI teams had no way to see where their{" "}
          <br className="hidden md:block" />
          money was going.
        </h1>

        {/* Supporting line — same two-explicit-lines treatment. */}
        <p className="w-full text-center font-ui font-normal text-[18px] text-text-primary leading-[30px] tracking-[0.09px] md:pb-40px md:text-[16px] md:leading-[28px] md:tracking-[0.08px]">
          AI teams couldn&rsquo;t see where their LLM spend went. The first
          investigation after a bill{" "}
          <br className="hidden md:block" />
          spike was a Slack thread, not a dashboard.
        </p>
      </div>
    </section>
  );
}
