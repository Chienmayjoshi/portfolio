import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Feature 2 opener for the UltraAI deck — "The Reference Build" / Veda, Figma
// desktop node 7885:117817 ("feature 2 - Veda"), file 2aoIFdaJMyNBEWeQESBEzG.
// No mobile frame was drawn; mobile is the same stack at the shell intro's
// mobile metrics.
//
// Same family as ShellIntroSlide (ghost numeral + feature name, display
// headline, one-line paragraph, the grid behind) and the same
// `chapter-intro-invert` surface: it renders as the inverse of the reader's
// global theme as a "entering a new feature" signal, and the deck flips the
// header and rail with it.
//
// What is different: the Veda render sits above the title block. Read off the
// frame: a 366x284 box (the image's own 1098x852 ratio), centred, whose top is
// 140 on the 900 frame and whose bottom dissolves into the surface over its
// last ~64px — a mask, so it fades to whatever the invert surface is, not to
// a fixed colour. It is 53 above the numeral row. The headline is the
// deck-wide slide-title token (48px / 32px mobile) rather than Figma's literal
// 56px, and the paragraph breaks after "details," on desktop as drawn.
//
// Copy verbatim from the frame. The ghost "02" is the feature's own index,
// like the Shell intro's "01".
//
// Asset: ua-veda-hero.webp — ua_veda_hero.png (transparent 1098x852) at 732px
// wide (2x the 366 it renders at), q90 with lossless alpha.
export default function VedaIntroSlide() {
  return (
    <section
      id="veda"
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-0 w-full [--grid-cell:24px] md:[--grid-cell:40px]" />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-[40px] px-32px py-80px md:h-full md:justify-center md:gap-[56px] md:px-80px md:py-0 md:pb-[40px]">
        {/* Veda. The bottom fade is a mask so it reads on either surface. */}
        <div
          className="relative aspect-[1098/852] w-[min(280px,72%)] shrink-0 md:w-[366px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
          }}
        >
          <Image
            src="/images/ultraai/ua-veda-hero.webp"
            alt="Veda, the astrology and tarot expert, eyes closed"
            fill
            sizes="(min-width: 768px) 366px, 280px"
            priority
          />
        </div>

        <div className="flex w-full flex-col items-center gap-[56px] md:gap-32px">
          <div className="flex items-start gap-16px">
            <div className="flex h-[28px] items-start justify-center overflow-hidden px-4px md:h-40px">
              <span className="font-display text-[32px] text-border-frame leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
                02
              </span>
            </div>
            <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
              <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
                The Reference Build
              </span>
            </div>
          </div>

          <h1 className="w-full text-center font-display text-slide-title-sm text-text-primary md:text-slide-title">
            Veda, Prove Value First
          </h1>

          <p className="w-full text-center font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
            Veda was built first, so she set the bar for every expert after her:
            show value before asking for personal details,{" "}
            <br className="hidden md:block" />
            and keep the first tap free.
          </p>
        </div>
      </div>
    </section>
  );
}
