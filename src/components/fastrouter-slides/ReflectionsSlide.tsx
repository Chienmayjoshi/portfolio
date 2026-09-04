import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Source of truth: Figma desktop node 7361:1353 ("reflections") / mobile node
// 7361:2182 ("reflections - mobile"), file 2aoIFdaJMyNBEWeQESBEzG. The deck's
// "Reflections" chapter — an unnumbered bookend in the rail, same as Outcomes.
//
// Two stacked groups under one header, split by a rule:
//   1. four takeaways in a 2x2 bullet grid, then the pull-quote, then the
//      border-b that closes the group (pb-32);
//   2. "How would I do differently now with AI?" + two more bullet rows.
// Mobile collapses both grids to one column and keeps the same order.
//
// Desktop measurements (node 7361:2113 "content", 1280 wide at x80/y134 in the
// 900 frame): content gap-40; header block gap-24; body gap-56 between the two
// groups; group 1 gap-24 + pb-32 + border-b border-default; each bullet row is
// py-16 with a gap-8 bullet column and a gap-8 title/body stack; the takeaway
// grid has a 24 column gap and NO row gap (rows sit flush, their py-16 does the
// separating), while group 2's grid carries gap-24 both ways.
// Mobile (node 7361:2571): 20px page padding, header gap-24, body gap-40
// between groups, single column, rows flush with the same py-16.
//
// Type, per node rather than assumed: eyebrow Geist Mono Medium 13/18/+0.78
// uppercase in text-accent; headline Season Mix 48/56/-0.48 desktop, 32/40/
// -0.32 mobile; row titles 20/26/-0.1 semibold in text-primary; row bodies
// 14/20/+0.07 medium in text-muted; pull-quote 17/28/+0.085 semibold; group-2
// heading Season Mix 28/40/+0.5 desktop, 20/28 mobile, with Figma's own
// `capitalize` transform reproduced rather than baked into the string.
//
// Three Figma notes, flagged not silently fixed:
// - Row titles are bound to DM Sans in Figma (the stale `decision-title` style,
//   see CLAUDE.md). Rendered in Google Sans Flex here, like every other title
//   in the deck.
// - The mobile headline ends in "!" and the desktop one in "." — same sentence,
//   two different marks. Desktop's period is used for both; a title card that
//   changes its punctuation at a breakpoint is a slip, not a design.
// - The group-2 heading reads "How would I do differently now with AI?" in both
//   frames — kept verbatim (copy is canonical) though it wants an "it".
//
// The quote's rule and the bullets are the accent colour and the group divider
// is border-default, so all three follow the theme toggle; no fixed hexes. Figma
// paints the quote #111 and the group-2 heading pure #000 against the headline's
// #0D0D0D — three near-identical blacks for what is one role, so all of it reads
// text-primary here (that's also what makes the slide legible in dark mode).
interface Takeaway {
  title: string;
  body: string;
}

const TAKEAWAYS: Takeaway[] = [
  {
    title: "Read the domain before you read the brief.",
    body: "Karpathy reframed the problem from output synthesis to trust architecture before designing any screen.",
  },
  {
    title: "Process visibility is proof of rigour.",
    body: "Showing how the verdict was reached did more for trust than any copy or explanation could.",
  },
  {
    title: "No existing pattern, no inherited constraints.",
    body: "Every decision reasoned from scratch. Harder to navigate, more considered than adapting an existing pattern.",
  },
  {
    title: "Holding a position is part of senior design.",
    body: "The verdict-first call was pushed back on. It shipped because I didn’t fold on the reasoning.",
  },
];

const WITH_AI: Takeaway[] = [
  {
    title: "Pressure-test layouts before handoff",
    body: "I would connect Figma MCP and test the peer-review screen with real content: short answers, long code blocks, models agreeing, models disagreeing. I only tested it with placeholder text. AI could catch broken layouts before a real question hits them.",
  },
  {
    title: "Generate preset variants faster",
    body: "I wrote all seven presets by hand — icon, title, description each. AI could generate them from a simple list of categories, so I spend time picking the best ones, not writing seven similar descriptions.",
  },
];

// One bullet row. The dot is an 8px circle inside Figma's 8x16 box, pushed down
// 8px so it centres against the first line of a 26px title rather than against
// the whole (variable-height) block — mt on the dot, not items-center on the
// row, so a three-line row keeps the dot on line one.
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

export default function ReflectionsSlide() {
  return (
    <section
      id="reflections"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* Desktop centres the block in the below-header area (pt = header height
          + justify-center), matching Figma's y134–815 band in the 900 frame. */}
      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pt-[var(--fr-header-h,0px)] md:pb-0">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24px md:gap-40px">
          {/* Header */}
          <div className="flex flex-col gap-24px">
            <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              Reflections
            </span>
            <h1 className="font-display text-[32px] text-text-primary leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              My key takeaways and learnings.
            </h1>
          </div>

          {/* Body. 56px isn't on this project's spacing scale, so the desktop
              gap is an arbitrary value — a named gap-56px silently collapses
              to 0. */}
          <div className="flex flex-col gap-40px md:gap-[56px]">
            {/* Group 1: the 2x2 takeaway grid, the pull-quote, and the rule
                that closes the group. */}
            <div className="flex flex-col gap-24px border-border-default border-b pb-32px">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-24px">
                {TAKEAWAYS.map((item) => (
                  <BulletRow key={item.title} {...item} />
                ))}
              </div>

              <blockquote className="border-text-accent border-l-[3px] pl-20px">
                <p className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
                  Getting the right answer from AI is a solved problem. Knowing
                  whether to trust it isn&rsquo;t. That&rsquo;s the design
                  problem.
                </p>
              </blockquote>
            </div>

            {/* Group 2 */}
            <div className="flex flex-col gap-24px">
              <h2 className="font-display text-[20px] text-text-primary capitalize leading-[28px] tracking-[0.5px] md:text-[28px] md:leading-[40px]">
                How would I do differently now with AI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-24px">
                {WITH_AI.map((item) => (
                  <BulletRow key={item.title} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
