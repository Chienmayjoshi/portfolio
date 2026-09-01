import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Source of truth: Figma node 7039:61590 ("problem statement"), file
// 2aoIFdaJMyNBEWeQESBEzG.
//
// GridDepthLayer (src/components/shared/GridDepthLayer.tsx) — a subtle
// grid texture added to Figma sitting top-center of this frame, per
// direct instruction meant for reuse on other case-study pages too
// (built generic, not hardcoded to Problem's own dimensions). See that
// component's own header comment for the Figma source (node 7239:5686).
//
// AuroraShader (src/components/shared/AuroraShader.tsx) is deliberately
// not wired in here — it depends on the `ogl` package, which this sandbox
// can't install (registry.npmjs.org connection refused). Per direct
// instruction, shipping the rest of this slide without it rather than
// blocking on that dependency. The component itself is real, finished
// code, not a stub — re-add the import and `<AuroraShader
// className="absolute inset-x-0 top-0 h-[320px] opacity-60" />` (as the
// first child of the <section> below) once `npm install ogl` has been run.
//
// Body paragraph is 18px/30px per this node — Figma's own variable-defs
// metadata for the frame lists `portfolio/body` as 16px, but the node
// itself overrides it locally to 18px. Using the literal 18px (arbitrary
// value), not the `body` token — flagging, not fixing.
//
// The three pill cards: Figma repeats "No visibility into spend"
// identically three times (an obvious copy-paste artifact — a stack all
// saying the same thing has no design rationale). Using the original
// handoff doc's three distinct, already-established strings instead. Per
// direct instruction, rendered as three plain side-by-side pills this
// pass — the stacked/offset depth-cue treatment Figma shows (and the doc
// originally specified) is deferred, more detail to come later.
//
// Model-name ghost text: Figma composes this as two vertical masked
// columns flanking the centered content, not behind it (the "don't
// collide with main content" instruction is already how Figma positions
// it — see ModelMarqueeColumn below). Reproduced as an infinite
// CSS-animated vertical loop rather than Figma's static mask — an ambient
// decorative loop, so plain CSS per this project's animation split (same
// reasoning as globals.css's .hero-zoom-loop), not GSAP or Motion. Text
// color is `text-text-muted` at 40% opacity, not Figma's literal
// `#D9D9D9` — that hex reads subtle against Figma's light background but
// is bright/prominent in dark mode (light gray on near-black is high
// contrast, not subtle); `text-muted` alone was still too prominent per
// direct feedback, hence the added opacity on top of it.
//
// Both columns scroll the same direction (up), not mirrored — confirmed
// against a Figma prototype (three sequential keyframe frames measured
// directly: every position delta was upward, none reversed). `slow` picks
// a longer duration of the same animation so the two columns drift out of
// phase with each other instead of reading as one synced object, rather
// than the originally-built opposite-direction approach.
//
// List expanded from the original 9 (Figma's own ghost-text names plus
// the rest of the handoff doc's list) to 20, per direct feedback: on a
// tall viewport enough rows are visible at once that 9 items completes a
// full loop within a single screen — the doubled-list-for-seamless-loop
// technique means row 1 and row 10 read as literally the same name,
// which looks like an obvious repeat rather than a continuous stream.
// More unique, recognizable real models (not obscure ones) pushes the
// loop boundary further down than one viewport can show at once.
//
// A real layout bug also masked as "the list runs out": ModelMarqueeColumn
// (below) sets `h-full` on its own masking/overflow-hidden wrapper, but
// that div's parent — the flex row holding both marquee columns and the
// centered text block — had no explicit height of its own, only
// content-based sizing. A percentage height (`h-full` = `height:100%`)
// against an auto-sized ancestor resolves to `auto`, not a real pixel
// value — confirmed directly via the Web Animations API
// (`element.getAnimations()` + `getBoundingClientRect()`): the animated
// inner div's height and its "masking" parent's height were identical
// (2048px, the full 40-row content), meaning overflow-hidden had nothing
// left to actually clip. The whole list rendered at full size instead of
// scrolling inside a small fixed window, so once the animation had
// scrolled through it, you'd see blank space where the list "ran out" —
// not a looping bug, a missing height further up the tree. Fixed by
// adding `h-full` to that row div, giving the whole chain a real height
// to resolve against.
//
// Zigzag layout: Figma's current columns position each row's text flush
// to alternating edges (row 1 flush-right, row 2 flush-left, row 3
// flush-right...), measured directly off the node — `x + textWidth ==
// columnWidth` exactly on the "right" rows, `x = 0` on the "left" rows.
// A clean, deterministic alternation, not freeform scatter — reproduced
// via `text-right`/`text-left` alternating on `i % 2`. Column width is
// `240px` per direct instruction — Figma's own right column is still
// `300px` in this snapshot (an unintentional inconsistency, not a second
// deliberate size), standardized to `240px` on both. The alternation
// stays consistent across the doubled-list seam (list length 20 is even).
const MODEL_NAMES = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5",
  "Gemini 1.0 Ultra",
  "Llama 3",
  "Llama 2",
  "Mistral Large",
  "Mixtral 8x7B",
  "Command R+",
  "Command R",
  "Yi 1.5",
  "DeepSeek V2.5",
  "PaLM 2",
  "Grok-1",
  "Qwen 2",
  "Phi-3",
  "Falcon 180B",
  "Titan Text",
];

const PROBLEM_PILLS = [
  "No visibility into spend",
  "No way to validate quality",
  "No trusted path to a verdict",
];

// Mobile-only (node 7249:6413, "problem statement-mobile") — the fan/
// depth-cascade treatment the original handoff doc specified and desktop
// explicitly deferred (see this file's own header comment) turned up for
// real on this mobile frame, so it's built here, scoped to mobile only —
// desktop's flat row stays exactly as deferred, not extended to match.
// Same "Figma repeats one string 3x" copy-paste pattern already flagged
// above for the desktop row — reuses the same three distinct PROBLEM_PILLS
// strings instead, front-to-back matching primary-to-tertiary. Border
// colors are Figma's literal hex (#D9D9D9/#6B6B6B/#0D0D0D, a light-to-dark
// depth step), not semantic tokens — this project's border scale only has
// two steps (default/frame), nothing that maps to a three-step cascade.
// Not verified for dark mode: the front card's near-black (#0D0D0D) border
// would nearly disappear against a dark bg-bg-primary, and no dark-mode
// version of this Figma frame exists to check against — flagging rather
// than inventing a reversed-order treatment with no reference.
function ProblemPillStack() {
  return (
    <div className="relative h-[78px] w-[263px] md:hidden">
      <div className="-translate-x-1/2 absolute top-8px left-1/2 w-[263px] rounded-xl border border-[#D9D9D9] bg-bg-primary px-40px py-24px">
        <span className="whitespace-nowrap font-ui font-semibold text-[14px] text-text-primary leading-[20px]">
          {PROBLEM_PILLS[2]}
        </span>
      </div>
      <div className="-translate-x-1/2 absolute top-4px left-1/2 w-[253px] rounded-xl border border-[#6B6B6B] bg-bg-primary px-40px py-24px">
        <span className="whitespace-nowrap font-ui font-semibold text-[14px] text-text-primary leading-[20px]">
          {PROBLEM_PILLS[1]}
        </span>
      </div>
      <div className="absolute top-0 left-10px rounded-xl border border-[#0D0D0D] bg-bg-primary px-40px py-24px">
        <span className="whitespace-nowrap font-ui font-semibold text-[14px] text-text-primary leading-[20px]">
          {PROBLEM_PILLS[0]}
        </span>
      </div>
    </div>
  );
}

function ModelMarqueeColumn({ slow = false }: { slow?: boolean }) {
  return (
    <div
      className="pointer-events-none hidden h-full w-[240px] shrink-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] lg:block"
      aria-hidden="true"
    >
      <div
        className={`flex flex-col gap-40px ${
          slow ? "model-marquee-up-slow" : "model-marquee-up"
        }`}
      >
        {[...MODEL_NAMES, ...MODEL_NAMES].map((name, i) => (
          <span
            key={i}
            className={`w-[240px] whitespace-nowrap font-ui text-[14px] text-text-muted leading-[20px] tracking-[0.07px] opacity-30 ${
              i % 2 === 0 ? "text-right" : "text-left"
            }`}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProblemSlide() {
  return (
    // Mobile is top-anchored (pt-40, matches Hero's own mobile content
    // start), not vertically centered like desktop — a real architecture
    // difference confirmed against node 7249:6791, not a scaled-down
    // version of desktop's centered layout.
    <section
      id="problem"
      className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden bg-bg-primary md:items-center md:justify-center"
    >
      {/* Mobile grid-layer size/position (top-32, h-200) matches Hero's
          own mobile grid node exactly (7249:6414 vs 7255:6866 — identical
          x/y/w/h) — genuinely the same decoration at the same size here,
          not a coincidence worth re-deriving. Desktop unchanged. */}
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[600px]" />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-start gap-40px px-20px pt-40px md:h-full md:flex-row md:items-center md:justify-center md:gap-40px md:px-40px md:pt-0">
        <ModelMarqueeColumn />

        <div className="flex w-full max-w-[680px] flex-col items-start gap-40px text-left md:items-center md:gap-24px md:text-center">
          {/* Mobile size (32/40/-0.32) matches Hero's own mobile headline
              exactly, node 7249:6792 — desktop unchanged (56/64/-0.56).
              The old base fallback (40/46/-0.4) predated this mobile
              frame, same situation as Hero's headline before it. */}
          <h1 className="w-full font-display text-text-primary text-[32px] leading-[40px] tracking-[-0.32px] md:pb-40px md:text-[56px] md:leading-[64px] md:tracking-[-0.56px]">
            The Problem
          </h1>

          {/* Mobile size (24/32/-0.1, node 7249:6826) sits between the old
              base/md fallback values (22px and 28px) — neither matched,
              corrected to the real measured value. Desktop (28/40/-0.1)
              unchanged. */}
          <p className="w-full font-ui font-semibold text-[24px] text-text-primary leading-[32px] tracking-[-0.1px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
            Every model decision was gut feel dressed up as strategy.
          </p>

          {/* Mobile leading (28px, node 7249:6828) differs from the old
              base fallback (26px) — corrected. Desktop (18/30/0.09)
              unchanged. */}
          <p className="w-full font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px] md:text-[18px] md:leading-[30px] md:tracking-[0.09px]">
            Enterprise AI teams were making expensive model decisions on gut
            feel, with no visibility into cost, no way to validate model
            quality, and no systematic path to a trusted output.
          </p>

          <ProblemPillStack />

          {/* Desktop's flat row — hidden on mobile in favor of
              ProblemPillStack above (md:hidden on that component). */}
          <div className="mt-16px hidden flex-wrap items-center justify-center gap-12px md:flex">
            {PROBLEM_PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-xl border border-border-default bg-bg-primary px-24px py-16px font-ui font-semibold text-[14px] text-text-primary leading-[20px]"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <ModelMarqueeColumn slow />
      </div>
    </section>
  );
}
