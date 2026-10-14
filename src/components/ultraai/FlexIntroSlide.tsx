import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Feature 4 opener for the UltraAI deck — "The Generalization Test" / Flex,
// Figma desktop node 7919:174829 ("feature 4 - flex"), file
// 2aoIFdaJMyNBEWeQESBEzG. No mobile frame was drawn; mobile is the same stack
// at the other intros' mobile metrics.
//
// Same build as VedaIntroSlide, down to the surface (`chapter-intro-invert`,
// the opposite of the reader's theme, header and rail flipping with it). The
// differences are measured off this frame: the render is 400px wide (its own
// 1200x852 ratio, 284 tall), its top 187 on the 900 frame, and it sits almost
// on the numeral row — 7px above it — because its last ~64px dissolve into the
// surface (a mask, so it fades to whichever surface is behind). Veda's sits 53
// above. The paragraph breaks after "navigation," on desktop as drawn.
//
// Headline is the deck-wide slide-title token (48px / 32px mobile) rather than
// Figma's literal 56px. Copy verbatim; the ghost "04" is the feature's own
// index, like "01" on the Shell intro and "02" on Veda's.
//
// Asset: ua-flex-hero.webp — ua_flexhero.png (transparent 1200x852) at 800px
// wide (2x the 400 it renders at), q90 with lossless alpha.
export default function FlexIntroSlide() {
  return (
    <section
      id="flex"
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-0 w-full [--grid-cell:24px] md:[--grid-cell:40px]" />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-[40px] px-32px py-80px md:h-full md:justify-center md:gap-[8px] md:px-80px md:py-0 md:pb-[20px]">
        {/* Flex. The bottom fade is a mask so it reads on either surface. */}
        <div
          className="relative aspect-[1200/852] w-[min(300px,80%)] shrink-0 md:w-[400px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
          }}
        >
          <Image
            src="/images/ultraai/ua-flex-hero.webp"
            alt="Flex, the fitness expert, saluting"
            fill
            sizes="(min-width: 768px) 400px, 300px"
            priority
          />
        </div>

        <div className="flex w-full flex-col items-center gap-[56px] md:gap-32px">
          <div className="flex items-start gap-16px">
            <div className="flex h-[28px] items-start justify-center overflow-hidden px-4px md:h-40px">
              <span className="font-display text-[32px] text-border-frame leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
                04
              </span>
            </div>
            <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
              <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
                The Generalization Test
              </span>
            </div>
          </div>

          <h1 className="w-full text-center font-display text-slide-title-sm text-text-primary md:text-slide-title">
            Flex, Prove the System Holds
          </h1>

          <p className="w-full text-center font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
            Flex is UltraAI’s fitness expert, built second to test Veda’s
            system in a new domain. Same navigation,{" "}
            <br className="hidden md:block" />
            same paywall, same data ask: if they hold here, they hold anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}
