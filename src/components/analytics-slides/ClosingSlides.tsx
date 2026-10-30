import {
  ImpactSlide as SharedImpact,
  HonestFailureSlide as SharedHonestFailure,
  ReflectionsSlide as SharedReflections,
  ThanksSlide as SharedThanks,
  type ImpactStat,
  type Takeaway,
} from "@/components/shared/CaseStudyClosingSlides";
import ReadNextSlide, {
  ANALYTICS_NEXT,
} from "@/components/fastrouter-slides/ReadNextSlide";

// Analytics' copy for the shared closing slides (layout lives in
// shared/CaseStudyClosingSlides.tsx). Copy is the Analytics Figma frame's
// (node 6379:57064), tightened for skimming with the meaning kept.
//
// Left out of the frame on purpose, both FastRouter leftovers:
// - "Key takeaways": five items ("Verdict-first", "Education disguised as UX",
//   "Trust is an architecture decision") that describe FastRouter, and do the
//   same job as Reflections.
// - Reflections' "Getting the right answer from AI is a solved problem…" line.
//   The Friction line that sits next to it is Analytics' own and closes the
//   slide instead.
//
// Impact's three figures are shown as the frame has them. "Zero" and
// "Minutes" are descriptions, not measurements, and no metrics were supplied;
// nothing here is invented to firm them up.

const STATS: ImpactStat[] = [
  {
    number: "Zero",
    label: "Exit-and-return loops",
    body: "Metric creation no longer interrupts itself. No context switches.",
  },
  {
    number: "Minutes",
    label: "Time to first data",
    body: "Analysts get partial results before the full query finishes. No more waiting on the queue.",
  },
  {
    number: "100+",
    label: "Metrics made navigable",
    body: "A taxonomy built from scratch. PMs and analysts both find what they need, with no tribal knowledge.",
  },
];

export const ImpactSlide = () => (
  <SharedImpact
    headline="Four features. One compounding fix."
    intro={
      <>
        The team&rsquo;s question changed from &ldquo;why does this take so
        long&rdquo; to &ldquo;how do we get more from the data we have.&rdquo;
      </>
    }
    stats={STATS}
  />
);

export const HonestFailureSlide = () => (
  <SharedHonestFailure
    headline="The taxonomy came after the metrics. It should have come with them."
    body="Classify metrics inside the creation flow from day one, so every new metric arrives already sorted. Retrofitting structure always costs more than building with it."
  />
);

const REFLECTIONS: Takeaway[] = [
  {
    title: "The rejected direction teaches more than the shipped one.",
    body: "Top-down creation was intuitive. It failed on technical reality. That failure is what makes the shipped solution make sense.",
  },
  {
    title: "Constraints redirect good design. They don’t block it.",
    body: "The backend ID requirement forced depth-first. The constraint and the mental model pointed the same way.",
  },
  {
    title: "Surface what others hide.",
    body: "The Faulty category was the most deliberate call. Visible broken things build more confidence than invisible clean ones.",
  },
  {
    title: "Defaults are a statement about who you built it for.",
    body: "The calendar toggle isn’t a convenience feature. It’s a decision about whose experience gets optimised.",
  },
];

export const ReflectionsSlide = () => (
  <SharedReflections
    items={REFLECTIONS}
    quote={
      <>
        Friction at high frequency isn&rsquo;t a minor inconvenience.
        It&rsquo;s a compounding cost on every user, every session, every day.
      </>
    }
  />
);

export const ThanksSlide = () => <SharedThanks slug="analytics" />;

export function ReadNext({ active = false }: { active?: boolean }) {
  return <ReadNextSlide active={active} next={ANALYTICS_NEXT} />;
}
