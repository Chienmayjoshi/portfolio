"use client";

import { useState } from "react";
import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import DecisionAssetFrame from "@/components/shared/DecisionAssetFrame";

// Reusable TEMPLATE for a single "decision" slide in the fastrouter-slides
// deck, plus the decisions themselves — four for Council, two for
// Observability. Figma desktop nodes
// 7202:99233 / 100116 / 100926 / 101754 (decisions 01-04) and mobile 7295:1742,
// file 2aoIFdaJMyNBEWeQESBEzG. Every decision follows the same shape (a ghost
// number, a "DECISION · {chapter}" eyebrow, a headline, a Chose / Gave up / Why
// rationale, and a product-screenshot capsule), with two optional slots that
// only some frames use — see `subtitle` and `quote` below.
//
// MOBILE: Figma has a mobile frame for decision 01 ONLY (7295:1742); 02-04 are
// desktop-only frames. The mobile treatment is therefore the template's,
// verified against 01's frame and applied to all four — not four separate
// pixel matches. If mobile frames land for 02-04 later, re-verify rather than
// assuming this held.
//
// Layout differs by breakpoint: desktop is two columns (text left 520px,
// capsule right), mobile stacks the capsule inline in the text column. Both
// vertically centred on desktop, a top-anchored stack on mobile.
//
// Desktop vertical rhythm, measured off decision 02's content frame
// (7202:100877, the one exercising every slot): number+eyebrow block -> 24 ->
// headline -> 24 -> subtitle, then 56 to the rationale group, whose three
// blocks sit 24 apart. Matches what the template already did for 01.
//
// CAPSULE FRAMING: uses the shared DecisionAssetFrame — the exact gradient
// box + stroke ring + right-edge fade the vertical-scroll case study uses on
// its decision screenshots (FiveDecisions.tsx). The frame is token-driven
// (bg-surface / bg-primary / border-frame), so it adapts to the theme on its
// own; the asset inside is a plain light/dark pair. Same 720×460 capsule
// proportion on mobile too (the frame is responsive), matching the vertical
// scroll rather than a bespoke mobile crop.
//
// Two of the four assets are SCREEN RECORDINGS, not stills (decisions 02 and
// 04 — the whole point of both is motion over time: stages appearing as
// deliberation runs, and a strip that stays put as panels collapse). Hence
// `asset.kind`: "image" goes through ThemeSwap (CSS-only, no flash), "video"
// through ThemeAwareVideo (one <video>, src picked from context, so only the
// active theme's file is fetched). Same split, same files, as the
// vertical-scroll route's FiveDecisions.tsx.
//
// FIGMA INCONSISTENCY (flagged, normalized — not silently picked): decision
// 01's frame labels the third rationale block "WHY?" while 02, 03 and 04 all
// label it "WHY", as does the shipped vertical-scroll case study. Normalized
// to "Why" here on that 3-frames-plus-shipped-route majority. Decision 01's
// Figma frame is the outlier and should lose the question mark there.
// A single theme-aware source: one file per theme plus its description.
interface AssetSource {
  light: string;
  dark: string;
  alt: string;
}

// One switchable mode on a "toggle" asset — a source plus the word on its
// button.
interface AssetMode extends AssetSource {
  label: string;
}

// Three kinds of capsule content. "image" and "video" are the original two.
// "toggle" (added for Evaluations decision 02) puts a segmented control above
// the capsule and swaps the asset between two stills — the reader operates it,
// which is exactly the case Figma draws for that decision and the vertical
// -scroll route already builds as real state (EvaluationsFeature.tsx's
// EvalReportToggle). Two modes, not N: the control is a two-up pill, and a
// third mode would need a different control, so the type says two.
type DecisionAsset =
  | ({ kind: "image" | "video" } & AssetSource)
  | { kind: "toggle"; modes: readonly [AssetMode, AssetMode] };

interface Decision {
  id: string;
  number: string;
  chapter: string;
  headline: string;
  /** Accented line directly under the headline — same treatment as `quote`,
   * different slot. Only decision 02 has one. */
  subtitle?: string;
  chose: string;
  gaveUp: string;
  why: string;
  /** Accented pull-quote closing the column. Only decision 01 has one. */
  quote?: string;
  asset: DecisionAsset;
}

// Copy is verbatim from each decision's own Figma frame — which differs in
// places from the vertical-scroll route's wording of the same decisions (e.g.
// 02's "Chose" names the three stages here and doesn't there). The slide
// frames are canonical for the slides; the two were not reconciled.
export const COUNCIL_DECISIONS: readonly Decision[] = [
  {
    id: "council-decision-01",
    number: "01",
    chapter: "LLM COUNCIL",
    headline: "Verdict-first layout",
    chose: "Final verdict at the top. Arguments and peer review stacked below.",
    gaveUp: "Chronological order — the narrative journey the team expected.",
    why: "If users read arguments first they form an opinion before the verdict arrives. Showing the verdict cold preserves its objectivity as an independent signal.",
    quote: "“The team pushed back. I held the position.”",
    asset: {
      kind: "image",
      light: "/images/fastrouter/fr-decision-01-verdict-first.png",
      dark: "/images/fastrouter/fr-decision-01-verdict-first-dark.png",
      alt: "FastRouter Model Council — Final Verdict card above Peer Rankings",
    },
  },
  {
    id: "council-decision-02",
    number: "02",
    chapter: "LLM COUNCIL",
    headline: "Progressive step visibility",
    subtitle: "Arguments → Peer Review → Verdict",
    chose:
      "Each stage visible as it runs — Arguments → Peer Review → Final Verdict. Sticky status bar tracks the active stage.",
    gaveUp: "Loading spinner → result. Less complexity, faster implementation.",
    why: "Without visible stages the verdict is a black box. The three-stage visibility manages the wait and teaches users how Council works just by watching it run. Process visibility is proof of rigour.",
    asset: {
      kind: "video",
      light: "/images/fastrouter/fr-decision-02-progressive-steps.mp4",
      dark: "/images/fastrouter/fr-decision-02-progressive-steps-dark.mp4",
      alt: "Council UI stepping through Stage 1 of 3 (Initial Discussions) while deliberation runs",
    },
  },
  {
    id: "council-decision-03",
    number: "03",
    chapter: "LLM COUNCIL",
    headline: "Presets as onboarding strategy",
    chose:
      "A curated preset library is the first thing users see — predefined councils for specific use cases, ready to run.",
    gaveUp: "Blank canvas with a Create Council button.",
    why: "Council is a genuinely novel concept. A blank canvas fails when the concept itself is unfamiliar. Presets let users experience what Council does before they configure it. Post-launch: more presets were requested — the strategy worked.",
    asset: {
      kind: "image",
      light: "/images/fastrouter/fr-decision-03-presets.png",
      dark: "/images/fastrouter/fr-decision-03-presets-dark.png",
      alt: "Multi-Model Council preset gallery — a grid of predefined council cards like Job Interview Preparation and College Admissions Strategy",
    },
  },
  {
    id: "council-decision-04",
    number: "04",
    chapter: "LLM COUNCIL",
    headline: "Tabs over cards + persistent member strip",
    chose:
      "Each council member as a tab. Persistent strip shows all members, visible even when the config panel is collapsed.",
    gaveUp:
      "Card grid showing all models at once — mirrors the Playground layout.",
    why: "Cards signal parallel comparison. In peer review you're reading each member's independent evaluation sequentially. Tabs signal that correctly. The strip removes mid-session anxiety about which models are active.",
    asset: {
      kind: "video",
      light: "/images/fastrouter/fr-decision-04-persistent-strip.mp4",
      dark: "/images/fastrouter/fr-decision-04-persistent-strip-dark.mp4",
      alt: "Council UI with a persistent member-avatar strip visible above the Peer Rankings stage",
    },
  },
];

// Observability's two decisions. Numbering restarts at 01 per chapter (the
// eyebrow names which chapter, so 01/02 here doesn't collide with Council's
// 01-04), and both assets are screen recordings for the same reason two of
// Council's are: the point of each is something happening over time — a filter
// being layered onto the dashboard without disturbing the global one, and the
// section order revealing itself as you travel down the page.
//
// Copy is NOT new. All six strings are verbatim from the vertical-scroll
// route's own Observability section (fastrouter/ObservabilityIntro.tsx:45-76),
// including both aria-labels, so the two routes describe the same two
// decisions identically. That's deliberate: unlike the Council decisions —
// where the slide frames and the vertical route word the same decision
// differently and were left unreconciled — there is no separate slide-frame
// wording for these, so there was nothing to reconcile and nothing to invent.
// The one difference is the label above the first block: the vertical route
// calls it "Decision", this template calls it "Chose" across all six slides,
// since the eyebrow directly above already reads "DECISION · OBSERVABILITY".
export const OBSERVABILITY_DECISIONS: readonly Decision[] = [
  {
    id: "observability-decision-01",
    number: "01",
    chapter: "OBSERVABILITY",
    headline: "Two filter layers — global + card-level",
    chose:
      "Global filters control the whole dashboard. Card-level filters allow tactical investigation without changing global context.",
    gaveUp: "Single filter layer — simpler to build and explain.",
    why: "Strategic analysis and tactical investigation are different cognitive modes. One filter for both forces constant context-switching.",
    asset: {
      kind: "video",
      light: "/images/fastrouter/fr-observability-filters.mp4",
      dark: "/images/fastrouter/fr-observability-filters-dark.mp4",
      alt: "Observability dashboard showing the Provider filter panel, a card-level filter layered on top of the global date-range filter",
    },
  },
  {
    id: "observability-decision-02",
    number: "02",
    chapter: "OBSERVABILITY",
    headline: "Information hierarchy as priority stack",
    chose:
      "Section order follows the user's question sequence: what's consuming usage → how much overall → how it's trending → how fast and reliable.",
    gaveUp: "Conventional layout ordered by visual balance.",
    why: "A user arriving after an unexpected bill spike hits the most relevant information first, not buried three scrolls down.",
    asset: {
      kind: "video",
      light: "/images/fastrouter/fr-observability-dashboard.mp4",
      dark: "/images/fastrouter/fr-observability-dashboard-dark.mp4",
      alt: "Full observability dashboard showing All Keys, All Models, All Providers, All Tags, All Projects, and Gateway vs BYOK Costs panels",
    },
  },
];

// A still inside the capsule. `object-top` so the crop keeps the header + Final
// Verdict in view (same as FiveDecisions.tsx).
function CapsuleImage({ source }: { source: AssetSource }) {
  return (
    <ThemeSwap
      light={
        <Image
          src={source.light}
          alt={source.alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 767px) 100vw, 720px"
        />
      }
      dark={
        <Image
          src={source.dark}
          alt={source.alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 767px) 100vw, 720px"
        />
      }
    />
  );
}

// The segmented control for a "toggle" asset, with its capsule underneath.
//
// Its own component rather than a branch inside DecisionCapsule so the useState
// lives on a path that always renders it — a hook can't sit behind an
// `asset.kind` check.
//
// CHROME IS DELIBERATELY IDENTICAL to the vertical-scroll route's
// EvalReportToggle (EvaluationsFeature.tsx): same 44px pill on border-frame,
// same 130x36 buttons, same rounded-18, same active treatment (bg-surface +
// medium weight + the 1px/4px shadow). Same control, same decision, two routes
// — they should not drift. Not extracted into shared/ yet: the two differ in
// width and in how they order themselves against their column, so a shared
// component would today be chrome plus two layout props. If a third caller
// appears, extract then.
//
// The buttons are real buttons with aria-pressed rather than a radio group:
// nothing is submitted, and the pressed/unpressed pair is what the visual
// already communicates.
function ToggleCapsule({
  modes,
  className,
}: {
  modes: readonly [AssetMode, AssetMode];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`flex flex-col items-start gap-16px ${className ?? ""}`}>
      <div
        role="group"
        aria-label="Report mode"
        className="flex h-[44px] items-center rounded-full bg-border-frame p-4px"
      >
        {modes.map((mode, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={mode.label}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveIndex(i)}
              className={`flex h-[36px] w-[130px] items-center justify-center rounded-[18px] font-ui text-[14px] text-text-primary leading-[20px] tracking-[0.07px] transition-colors ${
                active
                  ? "bg-bg-surface font-medium shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]"
                  : "font-normal"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <DecisionAssetFrame>
        <CapsuleImage source={modes[activeIndex]} />
      </DecisionAssetFrame>
    </div>
  );
}

// Evaluations' two decisions. Numbering restarts at 01 per chapter, same as
// Observability's.
//
// Copy is NOT new, and none of it was written here. All eight strings are
// verbatim from the vertical-scroll route's own Evaluations decisions
// (fastrouter/EvaluationsFeature.tsx), including both "Gave up" blocks and
// both aria/alt descriptions — same treatment as the Observability pair above,
// and for the same reason: there is no separate slide-frame wording for these,
// so there was nothing to reconcile and nothing to invent.
//
// WORTH KNOWING about those two "Gave up" blocks: in the vertical route both
// are marked `hidden` (EvaluationsFeature.tsx) — present in the DOM, never
// shown. They are shown here, on the reference the person supplied, which is
// where the Gave-up copy is visible. If the vertical route's `hidden` is
// deliberate rather than stale, these two blocks are the place that disagrees.
//
// Decision 02's asset is the deck's first "toggle" capsule — Single View vs
// Compare Mode over the same evaluation report. The two report modes ARE the
// decision, so a static still of either one would be arguing the point with
// half the evidence.
export const EVALUATIONS_DECISIONS: readonly Decision[] = [
  {
    id: "evaluations-decision-01",
    number: "01",
    chapter: "EVALUATIONS",
    headline: "Fast Evals as the on-ramp",
    chose:
      "Pre-fills everything from your activity logs. One choice: Smart or Custom. Run immediately.",
    gaveUp:
      "Requiring users to configure dataset, models, and metrics before seeing any result.",
    why: "The full form is powerful but front-loaded. Fast Evals builds the habit the powerful path rewards.",
    asset: {
      kind: "video",
      light: "/images/fastrouter/fr-fast-evals.mp4",
      dark: "/images/fastrouter/fr-fast-evals-dark.mp4",
      alt: "Fast Evals flow, pre-filled from activity logs with a Smart or Custom choice, running immediately",
    },
  },
  {
    id: "evaluations-decision-02",
    number: "02",
    chapter: "EVALUATIONS",
    headline: "Two ways to read an evaluation report",
    chose: "Two distinct report modes, each answering a different question.",
    gaveUp:
      "A single combined view — all models, all prompts, all scores on one screen.",
    why: "Each mode serves a user at a different stage. Mixing them forces everyone to filter out what they don’t need every time.",
    asset: {
      kind: "toggle",
      modes: [
        {
          label: "Single View",
          light: "/images/fastrouter/fr-evals-report-single.png",
          dark: "/images/fastrouter/fr-evals-report-single-dark.png",
          alt: "Evaluation report in Single View, showing one model's run in detail",
        },
        {
          label: "Compare Mode",
          light: "/images/fastrouter/fr-evals-report-compare.png",
          dark: "/images/fastrouter/fr-evals-report-compare-dark.png",
          alt: "Evaluation report in Compare mode, showing four models side by side",
        },
      ],
    },
  },
];

// The framed, theme-aware asset capsule. DecisionAssetFrame supplies the
// gradient box + stroke ring + right fade.
function DecisionCapsule({
  asset,
  className,
}: {
  asset: DecisionAsset;
  className?: string;
}) {
  if (asset.kind === "toggle") {
    return <ToggleCapsule modes={asset.modes} className={className} />;
  }

  return (
    <DecisionAssetFrame className={className}>
      {asset.kind === "video" ? (
        <ThemeAwareVideo
          className="block size-full object-cover object-top"
          lightSrc={asset.light}
          darkSrc={asset.dark}
          aria-label={asset.alt}
        />
      ) : (
        <CapsuleImage source={asset} />
      )}
    </DecisionAssetFrame>
  );
}

// One "Chose / Gave up / Why" block: a mono label over a body paragraph.
function Rationale({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-8px">
      <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
        {label}
      </span>
      <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
        {children}
      </p>
    </div>
  );
}

// The 3px-accent-bordered line. Two slots use the identical treatment — the
// subtitle under decision 02's headline and the pull-quote closing decision
// 01 — so it's one component, placed differently.
function AccentLine({ children }: { children: string }) {
  return (
    <div className="border-text-accent border-l-[3px] pl-20px">
      <p className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
        {children}
      </p>
    </div>
  );
}

export default function DecisionSlide({
  decision = COUNCIL_DECISIONS[0],
}: {
  decision?: Decision;
}) {
  return (
    <section
      id={decision.id}
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* Desktop centres the two-column row vertically; mobile is a normal
          top-anchored stack.

          ONE capsule, reordered — not one per breakpoint. Mobile puts the
          capsule between the headline and the rationale; desktop puts it in a
          right-hand column. The obvious encoding (two DecisionCapsules, one
          `md:hidden` and one `hidden md:block`) renders the asset TWICE in the
          DOM, which for the two video decisions means two autoplaying decoders
          each — and the pointer deck keeps all 12 slides mounted at once, so
          nothing unmounts them offscreen. Instead the text column is
          `display: contents` on mobile, flattening its children into this flex
          column so `order` can interleave a single capsule between them; on
          desktop it becomes a real column again and order goes back to source
          order. Same technique the vertical-scroll route uses for the same
          layout (FiveDecisions.tsx). */}
      <div className="relative z-10 w-full px-20px pt-32px md:flex md:h-full md:items-center md:px-80px md:pt-0">
        <div className="flex w-full flex-col gap-24px md:mx-auto md:max-w-[1280px] md:flex-row md:items-center md:gap-40px">
          {/* Text column. 24px rhythm on mobile (inherited from the parent,
              since this is `contents` there), 56px on desktop. */}
          <div className="contents md:flex md:w-[520px] md:shrink-0 md:flex-col md:gap-[56px]">
            {/* Number + eyebrow + headline (+ subtitle, decision 02 only) */}
            <div className="order-1 flex flex-col gap-24px md:order-none">
              <div className="flex flex-col gap-4px">
                {/* Ghost number, cropped to a 40px band (the "peeking numeral"
                    Figma frame). border-frame token → adapts to dark mode. */}
                <div className="flex h-40px w-fit items-start justify-center overflow-hidden px-4px">
                  <span className="font-display text-[48px] text-border-frame leading-[56px] tracking-[-0.48px]">
                    {decision.number}
                  </span>
                </div>
                <span className="font-mono font-medium text-[13px] text-text-accent uppercase tracking-[0.78px]">
                  DECISION · {decision.chapter}
                </span>
              </div>
              <h1 className="font-display text-[32px] text-text-primary leading-[40px] tracking-[-0.32px] md:text-[56px] md:leading-[64px] md:tracking-[-0.56px]">
                {decision.headline}
              </h1>
              {decision.subtitle && (
                <AccentLine>{decision.subtitle}</AccentLine>
              )}
            </div>

            {/* Chose / Gave up / Why */}
            <div className="order-3 flex flex-col gap-24px md:order-none">
              <Rationale label="Chose">{decision.chose}</Rationale>
              <Rationale label="Gave up">{decision.gaveUp}</Rationale>
              <Rationale label="Why">{decision.why}</Rationale>
            </div>

            {decision.quote && (
              <div className="order-4 md:order-none">
                <AccentLine>{decision.quote}</AccentLine>
              </div>
            )}
          </div>

          {/* The single capsule — between headline and rationale on mobile
              (order-2), right column on desktop. 520 + 40 gap + 720 = the
              1280px row; below that it bleeds off the right edge, as Figma
              has it, clipped by the section's overflow-hidden. */}
          <DecisionCapsule
            asset={decision.asset}
            className="order-2 md:order-none md:w-[720px] md:shrink-0"
          />
        </div>
      </div>
    </section>
  );
}

// One bound slide per decision, so the deck registry in
// fastrouter-slides/page.tsx stays a flat list of zero-prop components rather
// than carrying decision data of its own.
export function CouncilDecision01() {
  return <DecisionSlide decision={COUNCIL_DECISIONS[0]} />;
}
export function CouncilDecision02() {
  return <DecisionSlide decision={COUNCIL_DECISIONS[1]} />;
}
export function CouncilDecision03() {
  return <DecisionSlide decision={COUNCIL_DECISIONS[2]} />;
}
export function CouncilDecision04() {
  return <DecisionSlide decision={COUNCIL_DECISIONS[3]} />;
}
export function ObservabilityDecision01() {
  return <DecisionSlide decision={OBSERVABILITY_DECISIONS[0]} />;
}
export function ObservabilityDecision02() {
  return <DecisionSlide decision={OBSERVABILITY_DECISIONS[1]} />;
}
export function EvaluationsDecision01() {
  return <DecisionSlide decision={EVALUATIONS_DECISIONS[0]} />;
}
export function EvaluationsDecision02() {
  return <DecisionSlide decision={EVALUATIONS_DECISIONS[1]} />;
}
