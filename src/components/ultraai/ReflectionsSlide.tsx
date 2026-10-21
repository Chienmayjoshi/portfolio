import GridDepthLayer from "@/components/shared/GridDepthLayer";

// "Reflections" for the UltraAI deck — Figma desktop node 7951:277469 ("ultra
// AI - reflections"), file 2aoIFdaJMyNBEWeQESBEzG. Rail tick: "reflections".
// Text only, so no assets. No mobile frame was drawn; it collapses the way
// fastrouter-slides' ReflectionsSlide does.
//
// This is that slide's layout, node for node (the two Figma frames are the
// same component): header (accent eyebrow + headline), a 2x2 bullet grid, a
// pull-quote with an accent rule, a hairline, then "How would I do differently
// now with AI?" over two more bullet rows. Measurements, type and the
// token-only colour decisions are documented on that file and carried over
// as-is — it is not shared yet because the copy and the group sizes differ
// (four takeaways + quote here as there; two AI rows as there), but nothing
// else does, so extracting it is the next step if a third study needs it.
//
// Copy is from the frame, including straight apostrophes ("That's",
// "it's", "doesn't") — FastRouter's slide used curly ones in places; Figma
// canonical here — and the group-2 heading "How would I do differently now
// with AI?" which wants an "it" but is what both studies' frames say.
// Takeaways 1 and 4 were rewritten on request after the frame was drawn:
// 1 is now "Fixed placement builds muscle memory." with its new description,
// 4 is retitled "Reuse shared components." (its body is unchanged).
// The pull-quote is a statement about the system and carries no figure that
// isn't Figma's.
interface Takeaway {
  title: string;
  body: string;
}

const TAKEAWAYS: Takeaway[] = [
  {
    title: "Fixed placement builds muscle memory.",
    body: "Tarot for Veda, Session for Flex, both in the second tab of the bottom nav. People learn where to look once, for every expert.",
  },
  {
    title: "Ask for data when it's needed.",
    body: "Veda waits for birth details until a reading needs them. Flex asks for body metrics first, because a plan can't work without them.",
  },
  {
    title: "Build the system once.",
    body: "Tokens and components made for Veda carried into Flex, so a new expert only brings its own accent.",
  },
  {
    title: "Reuse shared components.",
    body: "Empty, error, and payment states use one set of components. Only the accent and copy change per expert.",
  },
];

const WITH_AI: Takeaway[] = [
  {
    title: "Stress test new experts against locked rules",
    body: "I checked every platform rule by hand, which doesn't scale. An AI pass could check each new expert against the locked rules before handoff.",
  },
  {
    title: "Investigate patterns before building",
    body: "Flex found its real shape mid build. AI could run the same competitor and platform rule check for experts like Sage and Kaia upfront, before a screen gets designed.",
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

export default function UltraAIReflectionsSlide() {
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
            <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
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
                  Nine experts, one system: each new expert brings its own
                  accent and its own signature feature.
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
