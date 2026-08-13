import ScreenshotFrame from "@/components/shared/ScreenshotFrame";
import ThemeSwap from "@/components/shared/ThemeSwap";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";

// Source of truth: Figma node 6676:89362 ("product" frame, inside
// 6368:53648 / FastRouter file, per CLAUDE.md).
//
// Two real layers, not a single flattened screenshot: the browser chrome
// (tabs/URL bar) is a raster PNG — per CLAUDE.md's asset rule, FastRouter's
// own app chrome doesn't get rebuilt as live icon/DOM components — and the
// product hero itself is a real screen-recording video, not a static
// image. Composited here to match Figma's layout: browser frame inset
// 39px from the card top, centered, 900px wide, clipped by the outer
// ScreenshotFrame at 497px tall with the bottom faded out — same
// clip-and-fade treatment the original Figma node uses (its browser frame
// is taller than the visible card on purpose).
//
// ScreenshotFrame's gradient background was reconciled 2026-07-11 (see
// that file) — this card now shows the shared gradient/border-frame/
// radius-frame treatment instead of the flat bg it originally shipped with.
//
// The browser window's own hairline outline was originally hardcoded to
// #E9E9E9 (sampled straight from the embedded product chrome, not a
// portfolio token) — corrected 2026-07-15: that stayed frozen at the
// light-mode value once dark mode shipped, reading as a bright ring
// around the dark chrome screenshot. #E9E9E9 is only 4 units off
// border-default (#E5E5E5), the same tolerance already treated as "close
// enough to the token" elsewhere in this codebase (see FiveDecisions.tsx's
// "0N" numeral color, CouncilIntro.tsx's dark-card border) — swapped to
// border-border-default so the hairline follows the same light/dark
// values as every other frame border on the page instead of staying
// pinned to one sampled hex.
//
// Responsive conversion (2026-07-12): ScreenshotFrame now takes
// `aspectRatio="980/497"` instead of a fixed heightPx, so the card itself
// scales fluidly. The browser-frame inset was `left-1/2 top-[39px] w-[900px]`
// (fixed px against a fixed 980px card) — converted to percentages of the
// same 980px basis (39/497 top, 900/980 width) so it keeps Figma's exact
// inset proportions as the card narrows on mobile.
export default function ProductBrowserMockup() {
  return (
    <ScreenshotFrame aspectRatio="980/497" className="max-w-[980px]">
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[91.8367%] overflow-hidden rounded-[8px] border border-border-default"
        style={{ top: "7.8471%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image's
            width/height props conflict with Tailwind's preflight img{height:auto}
            reset here (false-positive size-mismatch warning); a plain img with
            explicit attributes sidesteps it for this fixed decorative asset. */}
        <ThemeSwap
          light={
            <img
              src="/images/fastrouter/fr-browser-chrome.webp"
              alt=""
              width={900}
              height={80}
              className="block w-full h-auto"
              style={{ aspectRatio: "900/80" }}
            />
          }
          dark={
            <img
              src="/images/fastrouter/fr-browser-chrome-dark.webp"
              alt=""
              width={900}
              height={80}
              className="block w-full h-auto"
              style={{ aspectRatio: "900/80" }}
            />
          }
        />
        <ThemeAwareVideo
          className="block w-full object-cover aspect-[900/395]"
          lightSrc="/images/fastrouter/fr-product-hero.mp4"
          darkSrc="/images/fastrouter/fr-product-hero-dark.mp4"
          aria-label="FastRouter homepage hero, screen recording"
        />
      </div>
    </ScreenshotFrame>
  );
}
