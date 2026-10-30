import GridDepthLayer from "@/components/shared/GridDepthLayer";
import PickModelGame from "@/components/fastrouter-slides/PickModelGame";

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
            className={`w-[240px] whitespace-nowrap font-ui text-[14px] text-text-muted leading-[20px] tracking-[0.07px] opacity-[0.14] ${
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

// Layout is Figma node 7233:5531 / 8189:50954: left-aligned copy ("Problem" in the
// error red) beside the pick-a-model game, with the ghost model names drifting
// behind it. The copy is unchanged. The three pills the slide used to carry are
// gone: the game's blank cost / quality / verdict dials say the same thing.
//
// The ghost columns are positioned on Figma's 1440 frame (x=750 and x=1040) and
// sit behind the game, which is why they are `absolute` and not in the flex row.
export default function ProblemSlide() {
  return (
    <section
      id="problem"
      className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden bg-bg-primary md:items-center md:justify-center"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[600px]" />

      <div className="pointer-events-none absolute inset-0 mx-auto hidden w-full max-w-[1440px] lg:block">
        <div className="absolute inset-y-0 left-[750px]">
          <ModelMarqueeColumn slow />
        </div>
        <div className="absolute inset-y-0 left-[1040px]">
          <ModelMarqueeColumn />
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-[1280px] flex-col items-start gap-32px px-20px pt-40px pb-40px md:h-full md:flex-row md:items-center md:gap-[64px] md:px-40px md:pt-0 md:pb-0">
        <div className="flex w-full max-w-[600px] shrink-0 flex-col items-start gap-24px text-left">
          <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
            The <span className="text-text-error">Problem</span>
          </h1>
          <p className="w-full font-ui font-semibold text-[24px] text-text-primary leading-[32px] tracking-[-0.1px] md:text-[28px] md:leading-[40px]">
            Every model decision was gut feel dressed up as strategy.
          </p>
          <p className="w-full font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px] md:text-[18px] md:leading-[30px] md:tracking-[0.09px]">
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
