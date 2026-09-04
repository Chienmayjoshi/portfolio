import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Chapter-07 opener for the fastrouter-slides deck — "Evaluations" feature
// intro. Third and last of the three feature title cards, sibling of
// CouncilIntroSlide (feature 1) and ObservabilityIntroSlide (feature 2), and
// built to their shape: ghost-number eyebrow, centred display headline,
// supporting line, inverted surface, same GridDepthLayer decoration.
//
// NO FIGMA FRAME FOR THIS SLIDE — unlike its two siblings (7145:75694 desktop /
// 7317:12157 mobile for Council, 7205:102560 for Observability), the deck has no
// "feature 3 - Evaluations" frame that could be located; the file's page list
// isn't enumerable over MCP right now, so this is "not found", not "confirmed
// absent". Structure and every type value below are therefore ObservabilityIntro
// -Slide's, applied unchanged rather than re-invented — three feature intros the
// reader meets in sequence must not diverge on the strength of a guess. Re-verify
// against Figma if a feature-3 frame turns up.
//
// COPY is canonical, not improvised: headline and supporting line are lifted
// verbatim (including the two-line desktop composition of the headline) from the
// long-form page's own Evaluations header — EvaluationsFeature.tsx, Figma node
// 6368:54059 — which is where the same chapter's opener already lives. The
// long-form's "Problem:" lead-in is dropped here: on a title card the supporting
// line IS the problem statement, and the siblings' equivalent line carries no
// label either.
//
// The supporting line has no forced desktop break, unlike both siblings. Theirs
// come from explicit two-line Figma text nodes; this sentence is a single short
// line in the long-form source, so it flows rather than inventing a break point.
//
// SURFACE: `chapter-intro-invert` (globals.css) renders this slide as the
// INVERSE of the reader's global theme, so crossing into it reads as "entering a
// new feature set" — the established treatment for feature intros. The slide uses
// normal bg-/text- tokens; the class re-scopes their CSS variables. The rail is
// marked `invert` for this slide too (SLIDE_RAIL_MODE in the page) so its ticks
// contrast correctly, and the header follows the same flag.
export default function EvaluationsIntroSlide() {
  return (
    <section
      id="evaluations-intro"
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      {/* Same grid decoration and cell sizes as the other two feature intros. */}
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
              03
            </span>
          </div>
          <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
            <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
              Evaluations
            </span>
          </div>
        </div>

        {/* Headline — the long-form header's two-line composition; flows on
            mobile. */}
        <h1 className="w-full text-center font-display text-slide-title-sm text-text-primary md:py-40px md:text-slide-title">
          Model selection was gut feel{" "}
          <br className="hidden md:block" />
          dressed up as a decision.
        </h1>

        {/* Supporting line — the long-form's problem statement, unlabelled. */}
        <p className="w-full text-center font-ui font-normal text-[18px] text-text-primary leading-[30px] tracking-[0.09px] md:pb-40px md:text-[16px] md:leading-[28px] md:tracking-[0.08px]">
          Teams had no systematic way to validate which model actually performed
          best.
        </p>
      </div>
    </section>
  );
}
