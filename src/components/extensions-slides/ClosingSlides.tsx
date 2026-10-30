import GridDepthLayer from "@/components/shared/GridDepthLayer";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";
import {
  ImpactSlide as SharedImpact,
  HonestFailureSlide as SharedHonestFailure,
  ReflectionsSlide as SharedReflections,
  ThanksSlide as SharedThanks,
  type ImpactStat,
  type Takeaway,
} from "@/components/shared/CaseStudyClosingSlides";
import ReadNextSlide, {
  EXTENSIONS_NEXT,
} from "@/components/fastrouter-slides/ReadNextSlide";

// Extensions' copy for the shared closing slides (layout lives in
// shared/CaseStudyClosingSlides.tsx), plus the "five more extensions" slide.
// Copy is the Extensions Figma frame's (node 6408:8), tightened for skimming
// with the meaning kept.
//
// Left out of the frame on purpose, both FastRouter leftovers:
// - "Key takeaways": five items ("Verdict-first", "Education disguised as UX",
//   "Trust is an architecture decision") that describe FastRouter, and do the
//   same job as Reflections.
// - Reflections' "Getting the right answer from AI is a solved problem…" line.
//   The "Anyone can design for the install…" line next to it is Extensions' own
//   and closes the slide instead.
// - The "EVALUATIONS" tag on the five-more section's eyebrow (a FastRouter
//   chapter name).
//
// FLAGGED, merged: the five-more section's intro paragraph and Impact's are
// word-for-word the same in Figma. Said once on each slide here: the "one
// became seven" half with the cards, the stakeholder half with the results.

const MORE = [
  {
    title: "Game Universe",
    category: "Gaming platform",
    description:
      "Open-source games rethemed to match the extension's visual identity using AI. Visual heaviness as a design requirement.",
  },
  {
    title: "Package Tracker",
    category: "Shipment tracking",
    description:
      "A dashboard tracking up to 50 parcels. Status, carrier and ETA at a glance across a dense list.",
  },
  {
    title: "Utility",
    category: "Widget dashboard",
    description:
      "Six widget types in a constrained viewport, with connections between them: a note becomes an email, a to-do schedules to calendar.",
  },
  {
    title: "News",
    category: "News reader",
    description:
      "An article feed with category filters and AI summaries, plus weather and sports widgets alongside the editorial content.",
  },
  {
    title: "Manual Hunt",
    category: "Product manuals",
    description:
      "Search by product, category and brand, with an AI chatbot for faster troubleshooting. Search and browse in a constrained viewport.",
  },
];

export function MoreExtensionsSlide() {
  return (
    <section
      id="more-extensions"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pt-[var(--fr-header-h,0px)] md:pb-0">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24px md:gap-32px">
          <div className="flex flex-col gap-16px">
            <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              Five more extensions
            </span>
            <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
              Seven domains. One designer. No shared system.
            </h1>
            <p className="max-w-[760px] font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
              The project started with one extension. It became seven because
              the quality of the first made the next ones a foregone
              conclusion.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-16px md:grid-cols-3 md:gap-24px">
            {MORE.map((card) => (
              <li
                key={card.title}
                className="flex flex-col gap-16px rounded-xl border border-bg-light bg-bg-surface p-24px"
              >
                <div className="h-[72px] w-full overflow-hidden rounded-md">
                  <AssetPlaceholder label={`[ ${card.title} thumbnail ]`} />
                </div>
                <div className="flex flex-col gap-4px">
                  <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
                    {card.category}
                  </span>
                  <h2 className="font-ui font-semibold text-[20px] text-text-primary leading-[26px] tracking-[-0.1px]">
                    {card.title}
                  </h2>
                </div>
                <p className="font-ui font-normal text-[14px] text-text-muted leading-[20px] tracking-[0.07px]">
                  {card.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const STATS: ImpactStat[] = [
  {
    number: "7",
    label: "Extensions shipped",
    body: "11 months, one designer across all seven.",
  },
  {
    number: "3–5",
    label: "Days per extension",
    body: "Research through final screens. Speed didn't trade off quality.",
  },
  {
    number: "0",
    label: "Exit loops in the interaction",
    body: "The ATF principle held across all seven without structural rework.",
  },
];

export const ImpactSlide = () => (
  <SharedImpact
    headline="Seven extensions shipped. Scope expanded. Quality held."
    intro="Stakeholders explicitly recognised the premium design and UX quality, and called delivery pace a strength, not a trade-off."
    stats={STATS}
  />
);

export const HonestFailureSlide = () => (
  <SharedHonestFailure
    id="maps-honest-failure"
    headline="The permissions screen listed what we access, not what it unlocks."
    body="Collecting every permission upfront was the right compliance call. But the copy read like a legal requirement: each permission listed with no mention of the feature it enables. It needed one line per permission saying what it enables, not just what it accesses. The trust cost of that gap was real."
  />
);

const REFLECTIONS: Takeaway[] = [
  {
    title: "The brief determines the design philosophy.",
    body: "Retention and conversion aren’t two framings of one problem. They’re different problems entirely.",
  },
  {
    title: "Hard constraints clarify more than they restrict.",
    body: "Viewport limits, performance budgets and compliance each removed options and sharpened the decision.",
  },
  {
    title: "Fast delivery doesn’t excuse craft. It demands more of it.",
    body: "At 3–5 days per extension, visual decisions aren’t revisited after shipping. They ship as designed. That’s a different kind of discipline, not a trade-off.",
  },
  {
    title: "No design system forced sharper decisions.",
    body: "Each extension was designed independently. With no inherited patterns to lean on, every choice had to be justified from scratch.",
  },
];

export const ReflectionsSlide = () => (
  <SharedReflections
    items={REFLECTIONS}
    quote="Anyone can design for the install. The harder problem is designing for every tab open after it."
  />
);

export const ThanksSlide = () => <SharedThanks slug="extensions" />;

export function ReadNext({ active = false }: { active?: boolean }) {
  return <ReadNextSlide active={active} next={EXTENSIONS_NEXT} />;
}
