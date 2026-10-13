import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Feature 1 opener for the UltraAI deck — "The Shell", Figma desktop node
// 7675:129240 / mobile 7686:151393 ("feature 1 - The Shell"), file
// 2aoIFdaJMyNBEWeQESBEzG. The next built slide after Problem: the Product
// slide (node 7610:93241) is deliberately skipped for now while its assets
// are still in progress, so the rail's "product" tick stays inert.
//
// Same anatomy as fastrouter-slides/CouncilIntroSlide (ghost numeral +
// feature name, display headline, one-line meta), same `chapter-intro-invert`
// surface: it renders as the inverse of the reader's global theme as a
// "entering a new feature" signal, and the deck flips the header and rail
// with it. Figma draws this frame dark because the reader's default is
// light; in dark mode it comes out light.
//
// Copy is verbatim from both frames (they agree). The body has a hard line
// break after "about" on desktop in Figma (two paragraph layers in the 1280
// column) — reproduced as a desktop-only <br>; mobile wraps naturally at its
// 326px column, which lands on the same three lines Figma shows. Headline is
// the deck-wide slide-title token (48px / 32px mobile), not Figma's literal
// 56px — the established deck divergence documented in CLAUDE.md.
export default function ShellIntroSlide() {
  return (
    <section
      id="shell"
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-0 w-full [--grid-cell:24px] md:[--grid-cell:40px]" />

      {/* 56px gap isn't in the spacing scale (a named gap-56px collapses to
          0), so it's an arbitrary value, same as CouncilIntroSlide. */}
      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-[56px] px-32px py-80px md:h-full md:justify-center md:gap-32px md:px-80px md:py-0">
        <div className="flex items-start gap-16px">
          <div className="flex h-[28px] items-start justify-center overflow-hidden px-4px md:h-40px">
            <span className="font-display text-[32px] text-border-frame leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              01
            </span>
          </div>
          <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
            <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
              The Shell
            </span>
          </div>
        </div>

        <h1 className="w-full text-center font-display text-slide-title-sm text-text-primary md:text-slide-title">
          One Nav, Nine Different Apps.
        </h1>

        <p className="w-full text-center font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
          The brief only asked for one app that could hold multiple experts.
          Nothing yet about <br className="hidden md:block" />
          any of them needing to stand alone.
        </p>
      </div>
    </section>
  );
}
