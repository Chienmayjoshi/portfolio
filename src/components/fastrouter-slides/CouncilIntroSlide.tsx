import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Chapter-05 opener for the fastrouter-slides deck — "Model Council" feature
// intro, Figma desktop node 7145:75694 / mobile 7317:12157 ("feature 1 - llm
// council - mobile"), file 2aoIFdaJMyNBEWeQESBEzG. Sits right after the Feature
// Overview slide (FeaturesSlide) and introduces the Council chapter that the
// DecisionSlide(s) then walk through — both share the "council" rail tick (see
// SLIDE_CHAPTER_IDS in the page).
//
// A centred title card: a ghost-number eyebrow ("01 · Model Council"), a big
// display headline, and a one-line meta strip. No imagery — the GridDepthLayer
// behind it is the same subtle grid decoration every other slide uses.
//
// The "01" ghost number matches Figma exactly (canonical for copy — CLAUDE.md);
// it's the feature's own local index, not the chapter number (05) the rail
// shows. Ghost-number band + colour (text-border-frame, so it adapts to dark
// mode) reuse the exact treatment from DecisionSlide's peeking numeral.
//
// Headline breaks vary by breakpoint, straight from the two frames: desktop is
// two explicit lines ("…where" / "AI judges AI.", node 7145:85173 composes them
// as separate lines that overflow the 680px column symmetrically), mobile is one
// flowing paragraph that wraps naturally at 326px. Hence the desktop-only <br>.
//
// SURFACE: `chapter-intro-invert` (globals.css) renders this slide as the
// INVERSE of the reader's global theme — light reader -> dark card, dark reader
// -> light card — so crossing into it reads as "entering a new feature set."
// The slide still uses the normal bg-/text- tokens; the class just re-scopes
// their CSS variables to the opposite set. The rail treats this slide as
// `invert` too (SLIDE_RAIL_MODE in the page) so its ticks contrast correctly.
export default function CouncilIntroSlide() {
  return (
    <section
      id="council-intro"
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      {/* Grid pattern behind the content — covers the whole slide (not just a
          top band) so it reads behind the centred title in the inverted/dark
          state too, at the smaller cell size the denser sections use
          (24px mobile / 40px desktop, matching ProductSlide). Its lines are the
          border-default token, which the chapter-intro-invert surface flips, so
          it shows in both themes. */}
      <GridDepthLayer className="absolute inset-0 w-full [--grid-cell:24px] md:[--grid-cell:40px]" />

      {/* Mobile is a padded title block in the touch stack (no fixed viewport to
          centre within); desktop centres vertically on the true viewport centre
          — md:pb offsets the below-header stage, same as Problem/Decision.
          Gap 56 → 32 and px 32 → 80 both match Figma per breakpoint. 56px and
          28px aren't in this project's spacing scale (…48, 60, 64…), so they're
          written as arbitrary values — a NAMED `gap-56px`/`h-28px` silently
          generates nothing and collapses to 0 (that was the mobile cramping). */}
      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-[56px] px-32px py-80px md:h-full md:justify-center md:gap-32px md:px-80px md:py-0">
        {/* Eyebrow: ghost number + feature name. Row is top-aligned; the label
            box's pt-8 drops its baseline to sit against the cropped numeral. */}
        <div className="flex items-start gap-16px">
          {/* Ghost number, cropped to a band (the "peeking numeral" — the band
              is shorter than the glyph's line box, so only its top shows). */}
          <div className="flex h-[28px] items-start justify-center overflow-hidden px-4px md:h-40px">
            <span className="font-display text-[32px] text-border-frame leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              01
            </span>
          </div>
          <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
            <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
              Model Council
            </span>
          </div>
        </div>

        {/* Headline — full-width centred, wraps naturally on mobile; the <br>
            forces Figma's two-line desktop composition (hidden on mobile so the
            line flows "where AI judges AI" there). */}
        <h1 className="w-full text-center font-display text-[32px] text-text-primary leading-[40px] tracking-[-0.32px] md:text-[56px] md:leading-[64px] md:tracking-[-0.56px]">
          Designing trust in a system where{" "}
          <br className="hidden md:block" />
          AI judges AI.
        </h1>

        {/* Meta strip — one line on desktop, wraps to two on mobile. */}
        <p className="w-full text-center font-ui font-normal text-[18px] text-text-primary leading-[30px] tracking-[0.09px] md:text-[16px] md:leading-[28px] md:tracking-[0.08px]">
          4 weeks, brief to shipping · No existing UX pattern
        </p>
      </div>
    </section>
  );
}
