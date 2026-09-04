import GridDepthLayer from "@/components/shared/GridDepthLayer";

// "The Reframe" slide — closes the Council intro stack (brief → tension →
// conceptual grounding → reframe). Figma desktop node 7187:98325 / mobile
// 7322:16130, file 2aoIFdaJMyNBEWeQESBEzG.
//
// A centred display title over a two-part statement: the FROM (the original
// brief, struck through) and the TO (the reframed one, held inside a pair of
// large square brackets). The brackets are the only non-type element.
//
// Both Figma frames are structurally IDENTICAL — same nodes, same order, only
// the type scale and the column width differ (desktop 730px content / 56px
// title / 28px body; mobile 350px / 32px / 20px). So this is one markup with
// `md:` variants rather than the duplicated desktop+mobile blocks the earlier
// Council slides needed, where the layouts genuinely diverge.
//
// Brackets: Figma draws each as three 4px bars (a 224px stem + two 40px arms)
// inside a 40×226 box. Reproduced as one div with 4px borders on three sides —
// same mark, no nested rotated bars. `self-stretch` instead of a hardcoded
// 226px height so the brackets still wrap the statement when it reflows to a
// width Figma doesn't have a frame for; the text's own py (31px desktop /
// 13px mobile) is what reproduces Figma's exact 226px at the Figma widths.

// The struck-through FROM line and the bracketed TO line, verbatim from Figma.
const FROM_TEXT = "Build a UI for multi-model output synthesis.";
const TO_TEXT =
  "Build a deliberation surface that makes the verdict trustworthy — because if users don't trust the process, they won't trust the output.";

// FROM / TO eyebrow — accent, same size at both breakpoints.
function Label({ children }: { children: string }) {
  return (
    <p className="w-full font-ui font-semibold text-[17px] text-text-accent leading-[28px] tracking-[0.085px]">
      {children}
    </p>
  );
}

// One half of the square bracket pair. 4px bars on the stem side + top and
// bottom; the open side has no border.
function Bracket({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`w-40px shrink-0 self-stretch border-border-frame border-y-4 ${
        side === "left" ? "border-l-4" : "border-r-4"
      }`}
    />
  );
}

export default function ReframeSlide() {
  return (
    <section
      id="council-reframe"
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-bg-primary pb-40px md:pb-0"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 flex w-full max-w-[730px] flex-col items-center px-20px md:px-0">
        {/* Title — 40px of air above and below (Figma's div:margin padding). */}
        <div className="py-40px">
          <h1 className="whitespace-nowrap text-center font-display text-slide-title-sm text-text-primary md:text-slide-title">
            The Reframe
          </h1>
        </div>

        {/* Statement. The empty 16px spacer between the two halves is Figma's
            own node — with the 24px column gap either side it makes the
            FROM→TO separation 64px, the deck's emphasis rhythm. */}
        <div className="flex w-full flex-col gap-24px">
          <div className="flex w-full flex-col gap-16px text-center">
            <Label>FROM</Label>
            {/* Muted + struck through: the brief as originally written.
                Figma's desktop frame inks this #AAA and its mobile frame
                #6B6B6B (= text-muted) — the frames disagree, so this takes the
                token both to stay theme-aware and to match the mobile frame
                exactly. Flagged rather than silently picked. */}
            <p className="w-full font-ui font-semibold text-[20px] text-text-muted leading-[26px] tracking-[-0.1px] line-through decoration-from-font [text-decoration-skip-ink:none] md:text-[28px] md:leading-[40px]">
              {FROM_TEXT}
            </p>
          </div>

          <div aria-hidden="true" className="h-16px w-full" />

          <div className="flex w-full items-center">
            <Bracket side="left" />
            <div className="flex min-w-px flex-1 flex-col justify-center gap-16px py-[13px] text-center md:py-[31px]">
              <Label>TO</Label>
              <p className="w-full font-ui font-semibold text-[20px] text-text-primary leading-[26px] tracking-[-0.1px] md:text-[28px] md:leading-[40px]">
                {TO_TEXT}
              </p>
            </div>
            <Bracket side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
