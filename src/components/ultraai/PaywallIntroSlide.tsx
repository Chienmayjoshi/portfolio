import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Feature 3 opener for the UltraAI deck — "The Shared System" / the Paywall,
// Figma desktop node 7897:144559 ("feature 3 - Paywall"), file
// 2aoIFdaJMyNBEWeQESBEzG. No mobile frame was drawn; mobile is the same stack
// at the Shell and Veda intros' mobile metrics, with the art scaled down.
//
// Same family as VedaIntroSlide / ShellIntroSlide and the same
// `chapter-intro-invert` surface (the opposite of the reader's theme, with the
// header and rail flipping with it).
//
// The art is a 500x277 frame read off Figma: three avatar cards, and
// "UNLOCK FULL ACCESS" set BEHIND their lower edge. The text starts 213 down —
// 25px up into the cards, 64 line — Google Sans Flex Black 40px, uppercase,
// faded to nothing downwards by a mask (Figma masks it with an SVG gradient).
// Colour is text-muted: Figma uses a one-off status/neutral icon #606367,
// there is no token for it and text-muted is the nearest.
//
// The two supplied exports are cropped differently — light is tight on the
// cards (1096x834), dark has glow margin around them (1314x948) — so each is
// sized so its CARDS span the same 337px (cards are 945 source px wide in
// both: light 1096 -> 391px, dark 1314 -> 469px) and their top edges share one
// line (dark pulled up 40). An earlier pass sized the light one off its
// shadow (354px), which made the cards smaller and put them at a different
// height against the text. Positions are percentages of the 500x277 frame and
// the text uses container units, so the whole piece scales into the mobile
// slot.
//
// Stack under it, from the frame: art, 40 gap (Figma's 10 read as cramped —
// widened on request),
// ghost "03" + "The Shared System", 32, headline (deck slide-title token,
// 48px / 32px mobile, rather than Figma's 56), 40, paragraph. Copy verbatim.
// Figma draws the headline near-white on the light frame — an artifact of
// that frame, it is text-primary here like the other intros.
//
// THEME: the art is chosen by the SURFACE, not the reader's theme. This slide
// is the inverse of the global theme, so a dark reader sees a LIGHT slide and
// gets the light export (and vice versa) — the `dark:` classes below are
// swapped on purpose.
//
// Assets: ua-paywall-intro[-dark].webp — the supplied PNGs at 2x their render
// width, q90, lossless alpha.
export default function PaywallIntroSlide() {
  return (
    <section
      id="paywall"
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-0 w-full [--grid-cell:24px] md:[--grid-cell:40px]" />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-[56px] px-32px py-80px md:h-full md:justify-center md:gap-[40px] md:px-80px md:py-0">
        <div
          className="relative aspect-[500/277] w-[min(340px,100%)] shrink-0 [container-type:inline-size] md:w-[500px]"
          role="img"
          aria-label="Avatar cards of three experts in front of the words Unlock full access"
        >
          {/* Behind the cards, as in Figma (its text layer is first). */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-[76.9%] text-center font-ui font-black text-[8cqw] text-text-muted uppercase leading-[1.6] whitespace-nowrap"
            style={{
              maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
          >
            Unlock full access
          </span>
          <div className="absolute left-[10.9%] top-0 hidden w-[78.2%] dark:block">
            <Image
              src="/images/ultraai/ua-paywall-intro.webp"
              alt=""
              width={708}
              height={539}
              sizes="(min-width: 768px) 391px, 270px"
              className="h-auto w-full"
            />
          </div>
          <div className="absolute left-[3.1%] top-[-14.4%] w-[93.8%] dark:hidden">
            <Image
              src="/images/ultraai/ua-paywall-intro-dark.webp"
              alt=""
              width={938}
              height={677}
              sizes="(min-width: 768px) 469px, 320px"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[56px] md:gap-[32px]">
          <div className="flex items-start gap-16px">
            <div className="flex h-[28px] items-start justify-center overflow-hidden px-4px md:h-40px">
              <span className="font-display text-[32px] text-border-frame leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
                03
              </span>
            </div>
            <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
              <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
                The Shared System
              </span>
            </div>
          </div>

          <h1 className="w-full text-center font-display text-slide-title-sm text-text-primary md:text-slide-title">
            One Paywall, Not Nine
          </h1>

          <p className="w-full text-center font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px] md:mt-[8px]">
            One paywall system, three screen formats and five fixed placements.
            Built once for Veda, and every expert after it follows it.
          </p>
        </div>
      </div>
    </section>
  );
}
