import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Feature opener shared by the Analytics and Extensions decks (one component,
// one instance per module/extension). Same family as fastrouter-slides/CouncilIntroSlide: a ghost
// number, the feature name, a display headline, on the inverted
// `chapter-intro-invert` surface (see that class in globals.css and the rail
// mode table in SlidesDeck) so crossing into a feature reads as a new section.
//
// Unlike FastRouter's title cards, each opener also carries the feature's
// problem, because there is no separate problem slide per feature:
// two or three short lines under the headline, plus an optional pull line for
// the one feature (metric creation) that has one. All copy is the Figma
// frame's (node 6379:57064), with its "Problem:" prefixes dropped and long
// paragraphs split into lines.
interface FeatureIntroSlideProps {
  id: string;
  number: string;
  name: string;
  headline: string;
  points: readonly string[];
  /** Accent pull line closing the column. */
  quote?: string;
}

export default function FeatureIntroSlide({
  id,
  number,
  name,
  headline,
  points,
  quote,
}: FeatureIntroSlideProps) {
  return (
    <section
      id={id}
      className="chapter-intro-invert relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-0 w-full [--grid-cell:24px] md:[--grid-cell:40px]" />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-[40px] px-32px py-80px md:h-full md:justify-center md:gap-32px md:px-80px md:py-0">
        <div className="flex items-start gap-16px">
          <div className="flex h-[28px] items-start justify-center overflow-hidden px-4px md:h-40px">
            <span className="font-display text-[32px] text-border-frame leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              {number}
            </span>
          </div>
          <div className="flex flex-col items-start justify-end overflow-hidden pt-8px">
            <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
              {name}
            </span>
          </div>
        </div>

        <h1 className="w-full max-w-[1000px] text-center font-display text-slide-title-sm text-text-primary md:text-slide-title">
          {headline}
        </h1>

        <ul className="flex w-full max-w-[680px] flex-col gap-12px">
          {points.map((point) => (
            <li
              key={point}
              className="flex gap-12px font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]"
            >
              <span
                aria-hidden="true"
                className="mt-[10px] block size-8px shrink-0 rounded-full bg-text-accent"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {quote && (
          <div className="w-full max-w-[680px] border-text-accent border-l-[3px] pl-20px">
            <p className="font-ui font-semibold text-slide-accent-sm text-text-primary md:text-slide-accent">
              {quote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
