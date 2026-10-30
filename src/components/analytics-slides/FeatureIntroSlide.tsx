import FeatureIntroSlide from "@/components/shared/FeatureIntroSlide";

// Analytics' four feature openers. Layout lives in shared/FeatureIntroSlide.tsx;
// copy is the Analytics Figma frame's (node 6379:57064), with the "Problem:"
// prefixes dropped and long paragraphs split into lines.

export const MetricCreationIntro = () => (
  <FeatureIntroSlide
    id="metric-creation"
    number="01"
    name="On-the-fly metric creation"
    headline="Mid-formula, users hit a wall the interface wasn’t built to handle."
    points={[
      "Metrics are built from other metrics: a calculated metric can use a filtered one, which uses a base one. Chains run several levels deep.",
      "Mid-formula, a needed metric often didn’t exist yet. Old flow: abandon the formula, open metric management, create the metric, come back, rebuild context.",
      "On a two- or three-level chain, that happened several times before one formula was done.",
    ]}
    quote="The mental model was moving forward. The interface kept forcing it backward."
  />
);

export const QueryBreakdownIntro = () => (
  <FeatureIntroSlide
    id="query-breakdown"
    number="02"
    name="Query breakdown"
    headline="Analysts needed data to start working. The queue wasn’t giving them any."
    points={[
      "Large queries went to Queue, which only ran jobs when server capacity freed up.",
      "Queues stalled for hours. No partial data, no sign of when results would arrive, nothing to do but wait.",
      "Analysis was blocked until the full dataset returned, or didn’t.",
    ]}
  />
);

export const CalendarCompareIntro = () => (
  <FeatureIntroSlide
    id="calendar-compare"
    number="03"
    name="Calendar compare toggle"
    headline="Removing comparison complexity from users who aren’t comparing."
    points={[
      "Date selection and period comparison sat side by side as two equal tabs, always visible.",
      "Most users, most of the time, are doing one thing: setting a date range.",
      "Everyone paid for the comparison UI on every calendar open.",
    ]}
  />
);

export const MetricTaxonomyIntro = () => (
  <FeatureIntroSlide
    id="metric-taxonomy"
    number="04"
    name="Metric taxonomy"
    headline="Making 100+ metrics and dimensions navigable for users who think about data differently."
    points={[
      "The metrics and dimensions panel was one undifferentiated list.",
      "Analysts who knew metric names could search. PMs who think in business outcomes had no reliable way in.",
      "At 100+ entries, the list worked only by luck or tribal knowledge.",
    ]}
  />
);
