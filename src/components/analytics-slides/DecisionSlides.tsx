import DecisionSlide, {
  type Decision,
} from "@/components/fastrouter-slides/DecisionSlide";

// The Analytics deck's eight decisions, rendered through FastRouter's own
// DecisionSlide template (ghost number, "DECISION · {feature}" eyebrow,
// headline, Chose / Gave up / Why, framed asset capsule) — same shape the
// UltraAI deck's decisions use, so nothing here is a new layout.
//
// Copy source is the Analytics Figma frame (node 6379:57064), tightened for
// skimming with the meaning kept: "Problem:" prefixes dropped, long sentences
// split, "Decision" relabelled "Chose" (the template's label), and each Why
// cut to the reasoning alone. Numbering restarts at 01 per feature, as it does
// per chapter in the FastRouter deck.
//
// Figma carries FastRouter's "Decision 05: Tabs over cards + persistent member
// strip" under every one of the four features — a copy-paste leftover with no
// Analytics meaning — so it is not rendered anywhere. Dropped by agreement
// before the build, not by omission.
//
// Every asset is a light/dark pair already in public/images/analytics, carried
// over from the vertical-scroll page this deck replaces; stills and
// recordings were matched to the decision they were exported for. The three
// recordings (depth-first, flow-state, pre-select) and the compare toggle are
// motion by nature, hence `kind: "video"`.

const METRIC_CREATION = "ON-THE-FLY METRIC CREATION";
const QUERY_BREAKDOWN = "QUERY BREAKDOWN";
const CALENDAR_COMPARE = "CALENDAR COMPARE TOGGLE";
const METRIC_TAXONOMY = "METRIC TAXONOMY";

const IMG = "/images/analytics";

export const METRIC_CREATION_DECISIONS: readonly Decision[] = [
  {
    id: "metric-creation-decision-01",
    number: "01",
    chapter: METRIC_CREATION,
    headline: "Create the missing metric mid-formula",
    highlight: "mid-formula",
    body: "People think in a chain: I need A, which needs B, which needs C. So you create C, then B, then A, and the interface now follows that order.\n\nType @ in the formula builder, and if the metric doesn't exist, create it in the same popup. It's saved before you return to the parent formula, exactly where you left it.",
    chose:
      "Create a missing metric from the formula builder's autocomplete. Type @, and if the metric doesn't exist, create it in the same popup. It's saved before you return to the parent formula, exactly where you left it.",
    gaveUp: "the top-down flow, intuitive on paper but unworkable in practice",
    why: "Depth-first matches the mental model: I need A, which needs B, which needs C. Create C, then B, then A. The interface now follows that order.",
    asset: {
      kind: "video",
      light: `${IMG}/an-depth-first-inline-creation.mp4`,
      dark: `${IMG}/an-depth-first-inline-creation-dark.mp4`,
      alt: "Creating a missing metric inline from the formula builder's @ autocomplete, without leaving the popup",
    },
  },
  {
    id: "metric-creation-decision-02",
    number: "02",
    chapter: METRIC_CREATION,
    headline: "Breadcrumb trail as location system",
    highlight: "location system",
    body: "Every popup has a breadcrumb at the top, showing the full creation chain at any depth. Chains three or four levels deep are normal, so it keeps the whole dependency structure visible while you build.",
    chose:
      "A persistent breadcrumb at the top of every popup, showing the full creation chain at any depth.",
    gaveUp: "a cleaner popup with no navigation chrome",
    why: "Chains three or four levels deep are normal. Without a location system, users lose their place. The breadcrumb keeps the whole dependency structure visible while they build.",
    asset: {
      kind: "image",
      light: `${IMG}/an-breadcrumb-trail-as-location-system.png`,
      dark: `${IMG}/an-breadcrumb-trail-as-location-system-dark.png`,
      alt: "Persistent breadcrumb at the top of a metric-creation popup, showing the full creation chain",
    },
  },
  {
    id: "metric-creation-decision-03",
    number: "03",
    chapter: METRIC_CREATION,
    headline: "Ask before closing a half-built metric",
    highlight: "before closing",
    body: "Cancel and X both ask for confirmation before closing, because a half-built dependency chain is worth protecting. An on-the-fly metric can be edited again without abandoning the parent formula.",
    chose:
      "Cancel and X both ask for confirmation before closing. An on-the-fly metric can be edited again without abandoning the parent formula. Edit permissions from the model apply inline.",
    gaveUp: "conventional close behaviour: close is close",
    why: "Protection that stops at the main flow and ignores exits is incomplete. A half-built dependency chain is worth protecting. The confirmation says the context built mid-formula matters.",
    asset: {
      kind: "video",
      light: `${IMG}/an-flow-state-protection-at-every-exit-point.mp4`,
      dark: `${IMG}/an-flow-state-protection-at-every-exit-point-dark.mp4`,
      alt: "Cancel and close both asking for confirmation before dismissing a half-built metric",
    },
  },
];

export const QUERY_BREAKDOWN_DECISIONS: readonly Decision[] = [
  {
    id: "query-breakdown-decision-01",
    number: "01",
    chapter: QUERY_BREAKDOWN,
    headline: "The recommended option runs by default",
    highlight: "runs by default",
    body: "The two options aren't equal, so the screen shouldn't pretend they are. Split Query comes pre-selected, with a tinted background and a countdown timer, and runs automatically if you don't override in time.\n\nQueue stays available, but needs an active choice. Anyone who needs the complete data has a window to switch.",
    chose:
      "Split Query comes pre-selected, with a tinted background and a countdown timer. If the user doesn't override in time, it runs automatically. Queue stays available, but needs an active choice.",
    gaveUp: "equal-weight options that force a choice every time",
    why: "Pre-selection and auto-run build the recommendation into the behaviour. Users who trust the default pay no decision cost. The timer gives anyone who needs the complete data a window to override. Equal weight would imply a parity that doesn't exist.",
    asset: {
      kind: "video",
      light: `${IMG}/an-pre-select-split-query-with-auto-execution.mp4`,
      dark: `${IMG}/an-pre-select-split-query-with-auto-execution-dark.mp4`,
      alt: "Split Query pre-selected with a tinted background and a countdown before it runs automatically",
    },
  },
  {
    id: "query-breakdown-decision-02",
    number: "02",
    chapter: QUERY_BREAKDOWN,
    headline: "Choose which data arrives first",
    highlight: "arrives first",
    body: "Analysts on recent trends need the latest data first. Analysts auditing history need the oldest. So Split Query has a “Run oldest / latest date first” dropdown, which lets them choose which segment arrives first without needing to know how the split works.",
    chose: "A “Run oldest / latest date first” dropdown inside Split Query.",
    gaveUp: "a fixed run order, simpler with one less decision",
    why: "Analysts on recent trends need the latest data first. Analysts auditing history need the oldest. The dropdown lets them choose which segment arrives first, without needing to know how the split works.",
    asset: {
      kind: "image",
      light: `${IMG}/an-date-direction-control.png`,
      dark: `${IMG}/an-date-direction-control-dark.png`,
      alt: "“Run oldest / latest date first” dropdown control within Split Query",
    },
  },
];

export const CALENDAR_COMPARE_DECISIONS: readonly Decision[] = [
  {
    id: "calendar-compare-decision-01",
    number: "01",
    chapter: CALENDAR_COMPARE,
    headline: "Compare toggle, off by default",
    highlight: "off by default",
    body: "Always-visible options cost every user, every time, including the ones who never compare. A toggle costs only the users who want it. So compare is off by default, and the full comparison setup appears only when it's switched on. The base calendar handles date selection cleanly for most users.",
    chose:
      "Compare is off by default. The full comparison setup appears only when it's switched on. The base calendar handles date selection cleanly for most users.",
    gaveUp:
      "an always-visible comparison tab, giving power users instant access without a toggle",
    why: "Always-visible options cost every user, every time, including those who never compare. A toggle costs only the users who want it. When most people don't need a feature, don't make them pay for its visibility.",
    asset: {
      kind: "video",
      light: `${IMG}/an-compare-toggle.mp4`,
      dark: `${IMG}/an-compare-toggle-dark.mp4`,
      alt: "Calendar with a compare toggle that reveals the comparison setup only when switched on",
    },
  },
];

export const METRIC_TAXONOMY_DECISIONS: readonly Decision[] = [
  {
    id: "metric-taxonomy-decision-01",
    number: "01",
    chapter: METRIC_TAXONOMY,
    headline: "Broken metrics stay visible",
    highlight: "stay visible",
    body: "Showing broken metrics gives users a data-integrity signal before they build a report on them. Most tools hide this, which optimises for looking clean, not for being trustworthy.\n\nSo metrics are sorted by how they're built: Base, Calculated, Filtered, Transformed, Percentile and Faulty. Faulty is visible and filterable. Custom metrics are blue, and system metrics default to dark.",
    chose:
      "A taxonomy built from how metrics are actually constructed: Base, Calculated, Filtered, Transformed, Percentile and Faulty. Faulty is a visible, filterable category, not hidden. Custom metrics are blue, system metrics default dark.",
    gaveUp: "a cleaner panel that shows only healthy metrics",
    why: "Showing broken metrics gives users a data-integrity signal before they build a report on them. Most tools hide this. Hiding optimises for looking clean, not for being trustworthy.",
    asset: {
      kind: "image",
      light: `${IMG}/an-six-categories-from-scratch.png`,
      dark: `${IMG}/an-six-categories-from-scratch-dark.png`,
      alt: "Six-category metric taxonomy panel, with a separate Faulty toggle",
    },
  },
  {
    id: "metric-taxonomy-decision-02",
    number: "02",
    chapter: METRIC_TAXONOMY,
    headline: "No more stacked popups",
    highlight: "stacked popups",
    body: "Metric popups are interlinked: each one links to another metric that references it. Following those links used to stack overlapping popups, with no limit on how many. Now there's one popup with a breadcrumb trail, so navigation is sequential inside a single contained surface.\n\nIt's the same problem as on-the-fly creation, users losing their place in a nested workflow, solved the same way.",
    chose:
      "Metric popups are interlinked, and following the links used to stack overlapping popups with no limit. Now there's one popup with a breadcrumb trail, so navigation is sequential inside a single contained surface.",
    gaveUp: "a separate popup per metric level, simpler to build but unworkable at depth",
    why: "Same root cause as on-the-fly creation: users losing their place in a nested workflow. Same mechanism, different problem. Consistent by intent, not by repetition.",
    asset: {
      kind: "image",
      light: `${IMG}/an-multi-popup-replaced-with-breadcrumb-navigation.png`,
      dark: `${IMG}/an-multi-popup-replaced-with-breadcrumb-navigation-dark.png`,
      alt: "A single popup with a breadcrumb trail showing the full metric dependency chain, replacing cascading overlapping popups",
    },
  },
];

export const MetricCreationDecision01 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={METRIC_CREATION_DECISIONS[0]} active={active} />
);
export const MetricCreationDecision02 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={METRIC_CREATION_DECISIONS[1]} active={active} />
);
export const MetricCreationDecision03 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={METRIC_CREATION_DECISIONS[2]} active={active} />
);
export const QueryBreakdownDecision01 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={QUERY_BREAKDOWN_DECISIONS[0]} active={active} />
);
export const QueryBreakdownDecision02 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={QUERY_BREAKDOWN_DECISIONS[1]} active={active} />
);
export const CalendarCompareDecision01 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={CALENDAR_COMPARE_DECISIONS[0]} active={active} />
);
export const MetricTaxonomyDecision01 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={METRIC_TAXONOMY_DECISIONS[0]} active={active} />
);
export const MetricTaxonomyDecision02 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={METRIC_TAXONOMY_DECISIONS[1]} active={active} />
);
