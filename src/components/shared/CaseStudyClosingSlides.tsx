import GridDepthLayer from "@/components/shared/GridDepthLayer";
import CaseStudyFeedback from "@/components/shared/CaseStudyFeedback";
import {
  feedbackQuestions,
  type CaseStudySlug,
} from "@/components/shared/feedbackQuestions";

// Closing slides shared by the Analytics and Extensions decks (and any deck
// after them): Impact, One honest failure, Reflections, Thanks. Lifted out of
// analytics-slides/ClosingSlides.tsx once Extensions needed the same four, per
// CLAUDE.md's prove-on-one-then-share rule; each deck now supplies its own copy
// and these hold the layout. Copy rules both decks follow: short and skimmable,
// meaning kept from the Figma frame.

export interface ImpactStat {
  number: string;
  label: string;
  body: string;
}

export function ImpactSlide({
  headline,
  intro,
  stats,
}: {
  headline: string;
  intro: React.ReactNode;
  stats: readonly ImpactStat[];
}) {
  return (
    <section
      id="impact"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pt-[var(--fr-header-h,0px)] md:pb-0">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-32px md:gap-40px">
          <div className="flex flex-col gap-24px">
            <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              Impact
            </span>
            <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
              {headline}
            </h1>
            <p className="max-w-[760px] font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
              {intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-24px md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-8px rounded-md border border-bg-light bg-bg-surface p-32px"
              >
                <p className="font-display text-[32px] text-text-primary leading-[44px] tracking-[0.5px]">
                  {stat.number}
                </p>
                <p className="font-ui font-semibold text-[20px] text-text-primary leading-[26px]">
                  {stat.label}
                </p>
                <p className="pt-8px font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                  {stat.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HonestFailureSlide({
  id = "honest-failure",
  headline,
  body,
}: {
  id?: string;
  headline: string;
  body: string;
}) {
  return (
    <section
      id={id}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 flex w-full max-w-[880px] flex-col items-start gap-32px px-20px py-80px md:items-center md:px-80px md:py-0 md:text-center">
        <span className="font-mono font-medium text-[13px] text-text-error uppercase leading-[18px] tracking-[0.78px]">
          One honest failure
        </span>
        <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
          {headline}
        </h1>
        <p className="font-ui font-normal text-[18px] text-text-primary leading-[30px] tracking-[0.09px]">
          {body}
        </p>
      </div>
    </section>
  );
}

export interface Takeaway {
  title: string;
  body: string;
}

function BulletRow({ title, body }: Takeaway) {
  return (
    <div className="flex gap-8px py-16px">
      <span
        aria-hidden="true"
        className="mt-8px block size-8px shrink-0 rounded-full bg-text-accent"
      />
      <div className="flex min-w-0 flex-col gap-8px">
        <h3 className="font-ui font-semibold text-[20px] text-text-primary leading-[26px] tracking-[-0.1px]">
          {title}
        </h3>
        <p className="font-ui font-medium text-[14px] text-text-muted leading-[20px] tracking-[0.07px]">
          {body}
        </p>
      </div>
    </div>
  );
}

export function ReflectionsSlide({
  items,
  quote,
}: {
  items: readonly Takeaway[];
  quote: React.ReactNode;
}) {
  return (
    <section
      id="reflections"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pt-[var(--fr-header-h,0px)] md:pb-0">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24px md:gap-40px">
          <div className="flex flex-col gap-24px">
            <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              Reflections
            </span>
            <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
              What this taught me
            </h1>
          </div>

          <div className="flex flex-col gap-24px">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-24px">
              {items.map((item) => (
                <BulletRow key={item.title} {...item} />
              ))}
            </div>

            <blockquote className="border-text-accent border-l-[3px] pl-20px">
              <p className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
                {quote}
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

// The closing card UltraAI introduced (see ultraai/ThanksSlide.tsx for the
// reasoning on the centred row, the overlay stepper and the contact step), keyed
// by case-study slug so the feedback is filed and asked per study.
export function ThanksSlide({ slug }: { slug: CaseStudySlug }) {
  return (
    <section
      id="thanks"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 flex w-full flex-col px-20px pt-32px pb-40px md:h-full md:overflow-y-auto md:px-80px md:py-40px md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-40px md:my-auto md:gap-16px">
          <div className="flex flex-col items-start gap-24px md:items-center">
            <span className="text-left font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px] md:text-center">
              Thanks for reading
            </span>
            <h1 className="w-full text-left font-display text-slide-title-sm text-text-primary md:text-center md:text-slide-title">
              That&rsquo;s the thinking, start to finish.
            </h1>
          </div>

          <div className="flex flex-col gap-40px">
            <p className="w-full text-left font-ui font-normal text-[14px] text-text-muted leading-[20px] tracking-[0.07px] md:text-center md:text-[16px] md:leading-[28px] md:tracking-[0.08px]">
              <span className="md:block">
                If you want to dig into anything I skimmed over, like process,
                edge cases, or the trade-offs that didn&rsquo;t fit on the
                page,{" "}
              </span>
              <span className="md:block">
                reply by email or send this to a teammate.
              </span>
            </p>

            <div className="mx-auto w-full max-w-[720px]">
              <CaseStudyFeedback
                caseStudySlug={slug}
                singleSelectQuestion={feedbackQuestions[slug]}
                variant="centered"
                overlay
                collectContact
                submitLabel="Send it to Chinmay"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
