import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";

// Third slide of the fastrouter-slides horizontal format — "Product" /
// "What is Fastrouter?". Source of truth: Figma nodes 7070:61815 (desktop
// "product", 1440x900) and 7275:2 ("the product-mobile", 390x864), file
// 2aoIFdaJMyNBEWeQESBEzG. Same responsive-single-component pattern as
// HeroSlide/ProblemSlide: `h-full` fills the fixed-height pointer carousel
// cell and resolves to content height inside the touch scroll stack (see
// fastrouter-slides/page.tsx).
//
// Typography, verified per-node against get_design_context (not assumed):
//   headline  Season Mix (font-display): desktop 56/64/-0.56 (node
//             7070:61851), mobile 32/40/-0.32 (node 7275:390).
//   subhead   Google Sans Flex SemiBold: desktop 28/40/-0.1 (7070:61854),
//             mobile 24/32/-0.1 (7275:391).
//   body      Google Sans Flex Regular 18/30/+0.09 on BOTH (7070:61856 /
//             7275:392) — no responsive size change here, unlike the
//             headline/subhead. Two paragraphs.
// Figma emits `fontVariationSettings` GRAD/ROND/wdth defaults on the Google
// Sans Flex nodes; omitted here to match every other slide (defaults are
// the same as not setting them). Season Mix is static, so no variation
// settings on the display headline either (CLAUDE.md).
//
// Alignment differs by axis, straight from Figma: desktop centers all three
// text blocks (headline/subhead/body), mobile left-aligns the subhead and
// body while the headline stays centered (node 7275:390 is text-center;
// 7275:391/392 are not). Kept as Figma has it rather than normalizing.
//
// COPY ARTIFACT (flagging, NOT fixing per CLAUDE.md — Figma is canonical for
// FastRouter copy): the body's "controlsurface" is a missing space, almost
// certainly meant to read "control surface". It appears that way on BOTH the
// desktop and mobile Figma frames, so it's reproduced verbatim. Fix it in
// Figma first, then here.
//
// Vertical rhythm: desktop uses Figma's own margin-wrapper spacing (headline
// py-40, subhead pt-40/pb-24, body pb-40 — an asymmetric 80/24/40 cadence
// between blocks), mobile uses a flat gap-40 between every block (node
// 7275:389). Implemented as md: paddings on each block with gap-0 on desktop
// vs. gap-40 with no per-block padding on mobile.
//
// Background is bg-bg-primary (Figma #f9f9f7 = the bg-primary token), so it
// flips with the light/dark toggle — which is why this slide is marked
// theme-following in page.tsx's SLIDE_BACKGROUND_FOLLOWS_THEME (the rail
// tracks the same toggle). The product recording follows the toggle too, via
// ThemeAwareVideo's light/dark sources (see the screenshot block below), so
// unlike the earlier still there's no dark-mode gap here.
export default function ProductSlide() {
  return (
    <section
      id="product"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      {/* Grid-depth decoration behind the headline. Desktop grid (node
          7260:7342: x-80 y10, 1600x800 — bleeds past the 1440 frame, with a
          top-center radial fade) and mobile grid (node 7275:3: top-36 h-200)
          are the same generic GridDepthLayer, positioned via className the
          same way ProblemSlide does. 36 rounded to the 32px mobile rhythm
          used by Hero/Problem; large decorative heights (200/800) stay
          bracket values, not spacing-scale tokens. */}
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full [--grid-cell:24px] md:top-0 md:h-[800px] md:[--grid-cell:40px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-start gap-40px px-20px pt-40px md:items-center md:gap-0 md:px-0 md:pt-0">
        {/* Headline — left-aligned on mobile to match the Problem slide (per
            direct ask, overriding Figma node 7275:390's text-center),
            centered on desktop. Desktop wrapper rhythm is py-40 (node
            7070:61849). */}
        <h1 className="w-full font-display text-text-primary text-[32px] leading-[40px] tracking-[-0.32px] md:w-[680px] md:py-40px md:text-center md:text-[56px] md:leading-[64px] md:tracking-[-0.56px]">
          What is Fastrouter?
        </h1>

        {/* Sub-headline — mobile left-aligned, desktop centered. Desktop
            rhythm pt-40/pb-24 (node 7070:61852). */}
        <p className="w-full font-ui font-semibold text-text-primary text-[24px] leading-[32px] tracking-[-0.1px] md:w-[680px] md:pt-40px md:pb-24px md:text-center md:text-[28px] md:leading-[40px]">
          One API across 100+ models.
        </p>

        {/* Body — 18/30 on both sizes; mobile left, desktop centered and
            padded px-80/pb-40 (node 7070:61855). Two paragraphs, matching
            Figma's own two-<p> split (7070:61856): the hard line break falls
            after "runs through it." with no gap between the lines (leading
            carries the rhythm, no paragraph margin). "controlsurface"
            verbatim (see file header). */}
        <div className="w-full md:px-80px md:pb-40px">
          <p className="font-ui font-normal text-text-primary text-[18px] leading-[30px] tracking-[0.09px] md:text-center">
            Intelligent routing by cost, latency, or quality. Real-time
            visibility into every request that runs through it.
          </p>
          <p className="font-ui font-normal text-text-primary text-[18px] leading-[30px] tracking-[0.09px] md:text-center">
            FastRouter gives AI teams the controlsurface their products were
            missing.
          </p>
        </div>

        {/* Product representation — built to Figma's own treatment (nodes
            7071:61924 desktop / 7279:434 mobile), NOT the shared
            ScreenshotFrame's gradient bezel: a browser mockup inside a grey
            container, with the recording fading off the BOTTOM edge (a
            full-width vertical fade, not the bezel's corner mask). Per-slide
            treatment rather than a fork of the shared frame, per direct ask.
            Layers:
            - Grey container: bg-bg-light (Figma #f5f5f5), top corners rounded
              24, clips its contents. Desktop insets the mockup 20px (px/pt);
              mobile runs it full-bleed (Figma has no inset there — the
              near-identical bg-light vs bg-primary means the container reads
              the same either way).
            - Browser mockup: the FastRouter homepage hero, a real screen
              RECORDING (not a still) — the Figma frame uses a video here too.
              Reuses the same product-hero clips the live route's
              ProductBrowserMockup uses, via the shared ThemeAwareVideo (one
              <video>, src picked from ThemeProvider) so light/dark is handled
              — fr-product-hero.mp4 / fr-product-hero-dark.mp4. URL-bar layer
              is hidden in Figma, so no chrome bar composited on top (unlike
              the live route). border-default hairline; corners rounded 24
              (per direct ask, up from 8). object-cover object-top so the crop
              deepens on the narrower mobile box (aspect 350/187 vs desktop's
              native 900/395).
            - Fade: a full-width band over the bottom 100px fading to
              bg-primary (per direct ask — the recording dissolves into the
              PAGE colour, not the container's near-identical bg-light).
              Inline gradient (the codebase's gradient convention — see
              ScreenshotFrame/GridDepthLayer), not a Tailwind gradient class. */}
        <div className="flex w-full justify-center">
          <div className="relative w-full max-w-[940px] overflow-hidden rounded-tl-[24px] rounded-tr-[24px] bg-bg-light md:px-20px md:pt-20px">
            <div className="w-full overflow-hidden rounded-[24px] border border-border-default">
              <ThemeAwareVideo
                className="block aspect-[350/187] w-full object-cover object-top md:aspect-[900/395]"
                lightSrc="/images/fastrouter/fr-product-hero.mp4"
                darkSrc="/images/fastrouter/fr-product-hero-dark.mp4"
                aria-label="FastRouter homepage hero, screen recording"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[100px]"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--color-bg-primary))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
