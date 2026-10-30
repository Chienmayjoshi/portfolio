import GridDepthLayer from "@/components/shared/GridDepthLayer";
import PickModelGame from "@/components/fastrouter-slides/PickModelGame";

// Test page for the interactive Problem slide: Figma node 7233:5531 (left-aligned
// copy, "Problem" in the error red) with the pick-a-model game in
// the right column. Not wired into the deck. Left column copy is the existing
// Problem slide's, unchanged.

export default function ProblemGameLab() {
  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-bg-primary">
      <GridDepthLayer className="absolute inset-x-0 top-0 h-[600px] w-full" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-start justify-center gap-48px px-20px py-48px md:flex-row md:items-center md:gap-[64px] md:px-40px">
        <div className="flex w-full max-w-[600px] shrink-0 flex-col items-start gap-24px text-left">
          <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
            The <span className="text-text-error">Problem</span>
          </h1>
          <p className="font-ui font-semibold text-[24px] text-text-primary leading-[32px] tracking-[-0.1px] md:text-[28px] md:leading-[40px]">
            Every model decision was gut feel dressed up as strategy.
          </p>
          <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px] md:text-[18px] md:leading-[30px] md:tracking-[0.09px]">
            Enterprise AI teams were making expensive model decisions on gut
            feel, with no visibility into cost, no way to validate model
            quality, and no systematic path to a trusted output.
          </p>
        </div>

        <PickModelGame />
      </div>
    </section>
  );
}
