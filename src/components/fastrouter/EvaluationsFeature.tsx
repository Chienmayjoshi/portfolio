"use client";

import { useState } from "react";
import DecisionAssetFrame from "@/components/shared/DecisionAssetFrame";
import ThemeSwap from "@/components/shared/ThemeSwap";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";

// Source of truth: Figma node 6368:54059 (FastRouter file, per CLAUDE.md).
// Feature 03: Evaluations. Four sub-blocks:
// 1. Header — Problem statement is single-line here, unlike
//    Observability's two-line version.
// 2. Rejected V1/V2 comparison — both columns here are REJECTED (V1
//    "Top Stepper" / V2 "Side Stepper"), both using the red thumbs-down
//    icon; the "shipped" counterpart isn't a third column here, it's the
//    separate full-width showcase in block 3. The "REJECTED vs shipped"
//    eyebrow label and the standalone "Two attempts. Same flaw." closing
//    line were both removed 2026-07-17, per direct feedback, folding
//    "Two Attempts. Same flaw." into the title paragraph above the
//    columns instead (as its own line, ahead of "Sequential steps for a
//    non-sequential workflow.") rather than repeating the idea twice.
// 3. "shipped version" showcase — a single wide DecisionAssetFrame-style
//    capsule showing the unified form, plus 3 "why this works" reasons
//    (green thumbs-up).
// 4. A second "KEY DECISIONS" round after a one-line reflection
//    paragraph — 2 more decisions. Figma has a 3rd, hidden duplicate of
//    content already covered in block 2; skipped, same pattern as every
//    other hidden node in this file.
//
// Container unified 2026-07-16 (was: each of the 4 sub-blocks above
// independently centered at its own width — 1016px header, 1200px for
// blocks 2/3/4, plus a one-off 1160px showcase capsule inside block 3 —
// all nested inside a shared 1280px section wrapper). Per direct
// instruction, the whole page moved to one shared 1060px section / 980px
// content width (see design-tokens.json's width primitive note and
// globals.css's --width-content) — every sub-block here now shares that
// single width like every other section, and the 1160px showcase capsule
// (which no longer fits inside a 980px column) is now fluid (`w-full`)
// instead of a fixed px value that would just get clamped by `max-w-full`
// anyway. The old Figma-matched per-block widths are superseded, not
// wrong for their time — noted here rather than silently deleted.
//
// Block 4's reflection paragraph ("The unified form solved setup for
// power users...") and its "KEY DECISIONS" label lost their
// pl-[40px]/pl-[90px] left indent 2026-07-17, per direct feedback that it
// misaligned the title — intentional reversal, not a regression: the
// indent on the label was itself added earlier per a different direct
// instruction (matching the decision rows' own number-column offset).
// Both read flush-left now, grouped visually with the decision list
// below as its own section heading rather than aligning with an indent
// meant for something else.
//
// Decision 2 in block 4 ("Two ways to read an evaluation report") has a
// real interactive element in Figma — a "Switch / Before-After" control
// in the text column that swaps the asset between two static screenshots
// (Single View / Compare). Built as actual client-side state here, not a
// static image, since it's genuinely tied to user interaction (Motion's
// territory per CLAUDE.md's animation split, though this is simple enough
// not to need the library — plain useState).
//
// Assets: two videos this scroll needed compressing (same treatment as
// the FastRouter/Observability hero videos) — fr-fast evals.mov (35MB) and
// the two "New Evaluation" screenshots' shared chrome bar. The shipped-
// version body screenshot has no user-provided asset (only the chrome bar
// was supplied), so it's a direct Figma export, paired with the user's
// chrome image the same way Scroll 4/6 pair chrome+body layers.
const painPointIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="size-24px shrink-0 text-text-error">
    <path
      d="M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z"
      fill="currentColor"
    />
  </svg>
);

const goodPointIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="size-24px shrink-0 text-text-success">
    <path
      d="M21.9375 7.51125C21.7263 7.27193 21.4666 7.08028 21.1757 6.94903C20.8847 6.81778 20.5692 6.74994 20.25 6.75H15V5.25C15 4.25544 14.6049 3.30161 13.9017 2.59835C13.1984 1.89509 12.2446 1.5 11.25 1.5C11.1107 1.4999 10.9741 1.53862 10.8555 1.61181C10.7369 1.685 10.6411 1.78977 10.5787 1.91437L7.03687 9H3C2.60218 9 2.22064 9.15804 1.93934 9.43934C1.65804 9.72064 1.5 10.1022 1.5 10.5V18.75C1.5 19.1478 1.65804 19.5294 1.93934 19.8107C2.22064 20.092 2.60218 20.25 3 20.25H19.125C19.6732 20.2502 20.2025 20.0503 20.6137 19.6878C21.0249 19.3253 21.2896 18.8251 21.3581 18.2812L22.4831 9.28125C22.523 8.9644 22.495 8.64268 22.4009 8.3375C22.3068 8.03232 22.1489 7.75066 21.9375 7.51125ZM3 10.5H6.75V18.75H3V10.5Z"
      fill="currentColor"
    />
  </svg>
);

// Column width fixed 2026-07-16: this is a separate component from
// RejectedVsShipped.tsx's ComparisonColumn (similar purpose, different
// file) — the 2026-07-16 width-compaction pass (1136/1280 -> 1060,
// content area 980px) updated ComparisonColumn's two 546px columns to
// 470px + an explicit gap-40px, but missed this same pattern here, since
// they're two independent components. Two 546px columns (1092px
// combined) no longer fit the 980px container, causing real overflow —
// same fix applied: 470px each (980 - 40px gap, split evenly), replacing
// the old `justify-between` (which relied on slack that no longer
// exists at this width) with an explicit gap-40px.
interface ComparisonColumnProps {
  label: string;
  title: string;
  chromeSrc: string;
  chromeSrcDark: string;
  bodySrc: string;
  bodySrcDark: string;
  bodyAlt: string;
  reasons: string[];
}

function RejectedColumn({
  label,
  title,
  chromeSrc,
  chromeSrcDark,
  bodySrc,
  bodySrcDark,
  bodyAlt,
  reasons,
}: ComparisonColumnProps) {
  return (
    <div className="flex flex-col w-full md:w-[470px]">
      <div className="flex flex-col gap-4px items-start">
        <span className="font-ui font-medium text-text-error text-[13px] uppercase tracking-[0.78px]">
          {label}
        </span>
        <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
          {title}
        </p>
      </div>

      <div className="mt-24px rounded-[8px] border border-border-default overflow-hidden w-full md:w-[470px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <ThemeSwap
          light={
            <img
              src={chromeSrc}
              alt=""
              width={546}
              height={80}
              className="block w-full h-auto"
              style={{ aspectRatio: "546/80" }}
            />
          }
          dark={
            <img
              src={chromeSrcDark}
              alt=""
              width={546}
              height={80}
              className="block w-full h-auto"
              style={{ aspectRatio: "546/80" }}
            />
          }
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <ThemeSwap
          light={
            <img
              src={bodySrc}
              alt={bodyAlt}
              width={546}
              height={588}
              className="block w-full h-auto"
            />
          }
          dark={
            <img
              src={bodySrcDark}
              alt={bodyAlt}
              width={546}
              height={588}
              className="block w-full h-auto"
            />
          }
        />
      </div>

      <div className="mt-24px flex flex-col items-start w-full">
        {reasons.map((reason, i) => (
          <div
            key={reason}
            className={`flex gap-16px items-center p-16px w-full ${
              i < reasons.length - 1
                ? "border-b border-border-default"
                : "rounded-xl"
            }`}
          >
            {painPointIcon}
            <p className="font-ui font-normal text-text-primary text-[14px] leading-[20px] tracking-[0.07px] flex-1">
              {reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const shippedReasons = [
  "Full config visible in one scrollable left panel — name, dataset, models, metrics, API key",
  "Data preview persistent on the right — configure and validate simultaneously",
  "Run button always in view — no wizard gates, no forced sequence",
];

function EvalReportToggle() {
  const [mode, setMode] = useState<"single" | "compare">("single");

  return (
    <div className="order-2 md:order-none flex flex-col gap-16px items-start w-full md:w-[500px] md:shrink-0">
      <div className="flex items-center bg-[var(--color-border-frame)] h-[44px] p-4px rounded-full">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`flex items-center justify-center w-[130px] h-[36px] rounded-[18px] font-ui text-text-primary text-[14px] leading-[20px] tracking-[0.07px] transition-colors ${
            mode === "single"
              ? "bg-bg-surface font-medium shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]"
              : "font-normal"
          }`}
        >
          Single View
        </button>
        <button
          type="button"
          onClick={() => setMode("compare")}
          className={`flex items-center justify-center w-[130px] h-[36px] rounded-[18px] font-ui text-text-primary text-[14px] leading-[20px] tracking-[0.07px] transition-colors ${
            mode === "compare"
              ? "bg-bg-surface font-medium shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]"
              : "font-normal"
          }`}
        >
          Compare Mode
        </button>
      </div>

      <DecisionAssetFrame>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <ThemeSwap
          light={
            <img
              src={
                mode === "single"
                  ? "/images/fastrouter/fr-evals-report-single.png"
                  : "/images/fastrouter/fr-evals-report-compare.png"
              }
              alt={
                mode === "single"
                  ? "Evaluation report in Single View, showing one model's run in detail"
                  : "Evaluation report in Compare mode, showing four models side by side"
              }
              className="block size-full object-cover object-top"
            />
          }
          dark={
            <img
              src={
                mode === "single"
                  ? "/images/fastrouter/fr-evals-report-single-dark.png"
                  : "/images/fastrouter/fr-evals-report-compare-dark.png"
              }
              alt={
                mode === "single"
                  ? "Evaluation report in Single View, showing one model's run in detail"
                  : "Evaluation report in Compare mode, showing four models side by side"
              }
              className="block size-full object-cover object-top"
            />
          }
        />
      </DecisionAssetFrame>
    </div>
  );
}

// `id` (2026-07-15): optional SectionRail.tsx anchor — see Hero.tsx for
// why this is a prop, not a hardcoded string.
interface EvaluationsFeatureProps {
  id?: string;
}

export default function EvaluationsFeature({ id }: EvaluationsFeatureProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        {/* Header */}
        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              FEATURE 03
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              EVALUATIONS
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2
              className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]"
            >
              <span className="block">Model selection was gut feel</span>
              <span className="block">dressed up as a decision.</span>
            </h2>
          </div>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              Teams had no systematic way to validate which model actually
              performed best.
            </span>
          </p>
        </div>

        {/* Rejected V1 vs V2 comparison */}
        <div className="w-full flex flex-col pt-64px">
          <p className="font-ui font-semibold text-text-primary text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] tracking-[-0.1px] max-w-[784px]">
            <span className="block">Two Attempts. Same flaw.</span>
            <span className="block">Sequential steps for a non-sequential workflow.</span>
          </p>

          <div className="pt-32px flex flex-col md:flex-row gap-32px md:gap-40px items-start w-full">
            <RejectedColumn
              label="REJECTED - V1"
              title="Top Stepper"
              chromeSrc="/images/fastrouter/fr-evals-rejected-chrome.png"
              chromeSrcDark="/images/fastrouter/fr-evals-rejected-chrome-dark.png"
              bodySrc="/images/fastrouter/fr-evals-rejected-top-stepper.png"
              bodySrcDark="/images/fastrouter/fr-evals-rejected-top-stepper-dark.png"
              bodyAlt="Rejected: a horizontal top stepper with three tabs — Import Logs, Test Criteria, Review"
              reasons={[
                "Config split across three tabs — dataset, models, and metrics never visible together",
                "Wizard framing suits one-time setup — Evaluations runs on every model change",
                "Next button gates progress — can't see data preview while configuring",
              ]}
            />
            <RejectedColumn
              label="REJECTED - V2"
              title="Side Stepper"
              chromeSrc="/images/fastrouter/fr-evals-rejected-chrome.png"
              chromeSrcDark="/images/fastrouter/fr-evals-rejected-chrome-dark.png"
              bodySrc="/images/fastrouter/fr-evals-rejected-side-stepper.png"
              bodySrcDark="/images/fastrouter/fr-evals-rejected-side-stepper-dark.png"
              bodyAlt="Rejected: a vertical side stepper labeled Step 1/4, with a data preview panel alongside it"
              reasons={[
                "Four sequential steps for what the shipped version does in one scrollable form",
                "Step 1/4 framing implies a long process — raises barrier before user starts",
                "Stepping back to edit means losing forward context",
              ]}
            />
          </div>
        </div>

        {/* Shipped version showcase */}
        <div className="w-full flex flex-col pt-64px">
          <span className="font-ui font-medium text-text-success text-[13px] uppercase tracking-[0.78px]">
            shipped version
          </span>
          <p className="pt-32px font-ui font-semibold text-text-primary text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] tracking-[-0.1px] max-w-[784px]">
            <span className="block">Unified form.</span>
            <span className="block">Not a wizard. A workspace you return to.</span>
          </p>

          <div className="pt-48px w-full">
            <div className="rounded-[8px] border border-border-default overflow-hidden w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <ThemeSwap
                light={
                  <img
                    src="/images/fastrouter/fr-evals-shipped-chrome.png"
                    alt=""
                    width={1160}
                    height={80}
                    className="block w-full h-auto"
                  />
                }
                dark={
                  <img
                    src="/images/fastrouter/fr-evals-shipped-chrome-dark.png"
                    alt=""
                    width={1160}
                    height={80}
                    className="block w-full h-auto"
                  />
                }
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <ThemeSwap
                light={
                  <img
                    src="/images/fastrouter/fr-evals-shipped-body.png"
                    alt="Shipped Evaluations form: a single scrollable page with Evaluation Name, Dataset, Models to Compare, and Evaluation Metrics on the left, and a live Data preview on the right"
                    width={1160}
                    height={706}
                    className="block w-full h-auto"
                  />
                }
                dark={
                  <img
                    src="/images/fastrouter/fr-evals-shipped-body-dark.png"
                    alt="Shipped Evaluations form: a single scrollable page with Evaluation Name, Dataset, Models to Compare, and Evaluation Metrics on the left, and a live Data preview on the right"
                    width={1160}
                    height={706}
                    className="block w-full h-auto"
                  />
                }
              />
            </div>
          </div>

          <div className="mt-32px flex flex-col items-start w-full">
            {shippedReasons.map((reason, i) => (
              <div
                key={reason}
                className={`flex gap-16px items-center p-16px w-full ${
                  i < shippedReasons.length - 1
                    ? "border-b border-border-default"
                    : "rounded-xl"
                }`}
              >
                {goodPointIcon}
                <p className="font-ui font-normal text-text-primary text-[14px] leading-[20px] tracking-[0.07px] flex-1">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Second round of key decisions */}
        <div className="w-full flex flex-col pt-64px border-t border-border-default">
          <p className="font-ui font-semibold text-text-primary text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] tracking-[-0.1px] max-w-[874px]">
            The unified form solved setup for power users. For someone
            running their first evaluation, it was still overwhelming.
          </p>

          <span className="pt-32px font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            KEY DECISIONS
          </span>

          <div className="flex flex-col items-start w-full">
            {/* Mobile reading order (2026-07-12, explicit request):
                title -> asset -> decision/gave-up/why. Uses the flexbox
                `contents` + `order` technique — see FiveDecisions'
                DecisionRow for why the original CSS Grid version (row-
                spanning the asset) had a row-track-inflation bug that grew
                with asset height, and why plain flexbox avoids it. */}
            <div className="flex flex-col md:flex-row gap-32px md:gap-40px items-start md:items-center pt-40px md:pt-80px pb-40px md:pb-80px border-b border-border-default w-full">
              <div className="contents md:flex md:flex-col md:w-[440px] md:shrink-0 md:items-start">
                <div className="order-1 md:order-none flex items-center w-full">
                  <span
                    className="flex flex-col w-[90px] shrink-0 font-display font-bold text-[48px] leading-[56px] tracking-[-0.48px] text-border-frame"
                  >
                    01
                  </span>
                  <span className="font-ui font-semibold text-text-primary text-[20px] leading-[26px] flex-1">
                    Fast Evals as the on-ramp
                  </span>
                </div>

                <div className="order-3 md:order-none flex flex-col gap-12px items-start w-full md:pt-20px">
                  <div className="flex items-start w-full">
                    <span className="block w-[70px] md:w-[90px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                      DECISION
                    </span>
                    <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                      Pre-fills everything from your activity logs. One
                      choice: Smart or Custom. Run immediately.
                    </p>
                  </div>
                  <div className="hidden items-start w-full">
                    <span className="block w-[70px] md:w-[90px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                      GAVE UP
                    </span>
                    <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                      Requiring users to configure dataset, models, and
                      metrics before seeing any result.
                    </p>
                  </div>
                  <div className="flex items-start w-full">
                    <span className="block w-[70px] md:w-[90px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                      WHY
                    </span>
                    <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                      The full form is powerful but front-loaded. Fast
                      Evals builds the habit the powerful path rewards.
                    </p>
                  </div>
                </div>
              </div>

              <DecisionAssetFrame className="order-2 md:order-none md:w-[500px] md:shrink-0">
                <ThemeAwareVideo
                  className="block size-full object-cover object-top"
                  lightSrc="/images/fastrouter/fr-fast-evals.mp4"
                  darkSrc="/images/fastrouter/fr-fast-evals-dark.mp4"
                  aria-label="Fast Evals flow, pre-filled from activity logs with a Smart or Custom choice, running immediately"
                />
              </DecisionAssetFrame>
            </div>

            {/* Same mobile-reorder technique. The toggle buttons travel
                with the asset frame (EvalReportToggle wraps both as one
                unit) — see its own definition for the matching order/
                contents classes. */}
            <div className="flex flex-col md:flex-row gap-32px md:gap-40px items-start md:items-center pt-40px md:pt-80px w-full">
              <div className="contents md:flex md:flex-col md:w-[440px] md:shrink-0 md:items-start">
                <div className="order-1 md:order-none flex items-center w-full">
                  <span
                    className="flex flex-col w-[90px] shrink-0 font-display font-bold text-[48px] leading-[56px] tracking-[-0.48px] text-border-frame"
                  >
                    02
                  </span>
                  <span className="font-ui font-semibold text-text-primary text-[20px] leading-[26px] flex-1">
                    Two ways to read an evaluation report
                  </span>
                </div>

                <div className="order-3 md:order-none flex flex-col gap-12px items-start w-full md:pt-20px">
                  <div className="flex items-start w-full">
                    <span className="block w-[70px] md:w-[90px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                      DECISION
                    </span>
                    <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                      Two distinct report modes, each answering a
                      different question.
                    </p>
                  </div>
                  <div className="hidden items-start w-full">
                    <span className="block w-[70px] md:w-[90px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                      GAVE UP
                    </span>
                    <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                      A single combined view — all models, all prompts,
                      all scores on one screen.
                    </p>
                  </div>
                  <div className="flex items-start w-full">
                    <span className="block w-[70px] md:w-[90px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                      WHY
                    </span>
                    <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                      Each mode serves a user at a different stage.
                      Mixing them forces everyone to filter out what
                      they don&rsquo;t need every time.
                    </p>
                  </div>
                </div>
              </div>

              <EvalReportToggle />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
