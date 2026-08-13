import Image from "next/image";
import ThemeSwap from "@/components/shared/ThemeSwap";

// Source of truth: Figma node 6368:53682 (FastRouter file, per CLAUDE.md).
// This is the "Council intro stack" CLAUDE.md already documents: brief ->
// tension -> conceptual grounding -> reframe, 5 top-level blocks / 4 gaps.
// Figma shows 56px between them; per CLAUDE.md this is confirmed drift —
// using 64px (blockGapLarge) to match the doubling rhythm used everywhere
// else, same as the other already-resolved Council gap.
//
// "CONCEPTUAL GROUNDING" card title is bound to DM Sans in Figma — stale
// per CLAUDE.md's font policy, using Google Sans Flex.
//
// The dark card is a deliberate dark callout inside an otherwise light
// page, not a mode switch — wrapped in `dark` locally so its bg/text/
// border utilities resolve through the existing dark-mode CSS vars instead
// of hardcoding hex. One real deviation from Figma there: the card's
// border in Figma is a solid #D9D9D9; the scoped border-border-default
// token resolves to the PROPOSED translucent rgba(217,217,217,0.16)
// instead. Went with the systematic (if unconfirmed) token over the
// one-off literal value, consistent with the radius-frame call on
// ScreenshotFrame — flagging since border-default_PROPOSED still needs
// sign-off per design-tokens.json.
//
// The tweet is a real screenshot (Andrej Karpathy's actual tweet, cited as
// the conceptual reference) — kept as a raster image rather than rebuilt
// as live Twitter/X UI, same reasoning as FastRouter's own browser chrome.
// The dashed connector between the two cards is portfolio-native
// annotation (not embedded product UI), so it's inlined as live SVG.
const howItWorks = [
  "Multiple models respond to the same query independently",
  "Each model ranks the others' answers — anonymously",
  "A chairman model synthesises the final verdict",
];

// Responsive conversion (2026-07-12): engineering judgment, no mobile
// Figma ref. The two-line 48px headline drops `whitespace-nowrap` and
// scales down on mobile. The dashed SVG connector between the dark card
// and the tweet card is a fixed-pixel decorative annotation tied to an
// 80px left-padding column — rather than re-deriving its coordinates for a
// smaller padding value, it's hidden below `md` and the tweet card's
// indent shrinks to a plain 24px, keeping the reframe/tweet content intact
// without the annotation.
// `id` (2026-07-15): optional SectionRail.tsx anchor — see Hero.tsx for
// why this is a prop, not a hardcoded string.
interface CouncilIntroProps {
  id?: string;
}

export default function CouncilIntro({ id }: CouncilIntroProps) {
  return (
    <section id={id} className="w-full py-80px flex flex-col items-center">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px flex flex-col gap-64px w-full">
        {/* Header: eyebrow + h2. The "4 weeks, brief to shipping" /
            "No existing UX pattern" badges that used to sit under the
            headline were removed 2026-07-17, per direct feedback, to
            give this section more breathing room. */}
        <div className="flex flex-col gap-32px items-start w-full">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              FEATURE 01
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              LLM COUNCIL
            </span>
          </div>

          <div className="flex flex-col gap-24px items-start w-full">
            <h2
              className="font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]"
            >
              <span className="block md:whitespace-nowrap">
                Designing trust in a system where
              </span>
              <span className="block md:whitespace-nowrap">AI judges AI.</span>
            </h2>
          </div>
        </div>

        {/* The Brief */}
        <div className="flex flex-col gap-24px items-start w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            THE BRIEF
          </span>
          <div className="bg-bg-surface border-l-[3px] border-[var(--color-text-accent)] rounded-tr-sm rounded-br-sm pl-24px pr-24px py-24px flex flex-col gap-12px w-full">
            <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              &ldquo;LLMs are better at synthesizing and judging than
              generating content. We want to show how a council of models
              can produce a better output by mixing their responses.&rdquo;
            </p>
            <p className="font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
              — Engineering brief, verbatim
            </p>
          </div>
        </div>

        {/* Tension */}
        <div className="flex flex-col gap-16px items-start w-full">
          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            That&rsquo;s an engineering observation. The question it doesn&rsquo;t
            answer:
          </p>
          <h3 className="font-ui font-semibold text-text-primary text-[28px] leading-[40px] tracking-[-0.1px]">
            <span className="block">If AI is judging AI,</span>
            <span className="block">why would a user trust the verdict?</span>
          </h3>
        </div>

        {/* Conceptual grounding + tweet */}
        <div className="flex flex-col items-start w-full">
          <div className="pb-24px w-full">
            <div className="dark bg-bg-primary border border-border-default rounded-[24px] p-24px flex flex-col gap-8px w-full">
              <h4 className="font-ui font-semibold text-white text-[20px] leading-[26px]">
                CONCEPTUAL GROUNDING
              </h4>

              <div className="flex flex-col gap-40px items-start w-full pt-16px">
                <p className="font-ui font-normal text-text-primary text-[14px] leading-[20px] tracking-[0.07px]">
                  Reference: Andrej Karpathy&rsquo;s llm-council — a personal
                  experiment in multi-model deliberation.
                </p>

                <div className="flex flex-col gap-16px items-start w-full">
                  <span className="font-ui font-medium text-text-primary text-[13px] uppercase tracking-[0.78px]">
                    How it works:
                  </span>
                  <div className="flex flex-col gap-8px items-start w-full">
                    {howItWorks.map((step) => (
                      <div key={step} className="flex gap-10px items-start w-full">
                        <div className="flex flex-col items-start pt-8px w-6px shrink-0">
                          <div className="bg-[var(--color-text-accent)] rounded-full size-6px shrink-0" />
                        </div>
                        <p className="font-ui font-normal text-white text-[16px] leading-[28px] tracking-[0.08px] flex-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-16px items-start w-full">
                  <span className="font-ui font-medium text-text-primary text-[13px] uppercase tracking-[0.78px]">
                    The insight that changed the design:
                  </span>
                  <p className="font-ui font-semibold text-white text-[17px] leading-[28px] tracking-[0.085px]">
                    Models were willing to rank another model&rsquo;s response
                    above their own — but only when anonymous. Remove
                    authorship, remove bias. Not one model&rsquo;s opinion. A
                    structured deliberation with the bias problem designed
                    out.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-10px items-start pl-24px md:pl-80px w-full">
            <svg
              className="hidden md:block absolute left-24px -top-[26px] h-[85px] w-[57px] text-text-muted"
              viewBox="0 0 57 85.0083"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="85"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1="0"
                y1="84.0083"
                x2="57"
                y2="84.0083"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            <div className="bg-bg-surface border border-border-default rounded-[24px] p-24px w-full">
              <ThemeSwap
                light={
                  <Image
                    src="/images/fastrouter/fr-karpathy-tweet.png"
                    alt="Tweet from Andrej Karpathy (@karpathy) describing his llm-council project: multiple models respond independently, review each other's anonymized answers, and a chairman model produces the final response."
                    width={936}
                    height={504}
                    className="w-full h-auto rounded-[12px]"
                  />
                }
                dark={
                  <Image
                    src="/images/fastrouter/fr-karpathy-tweet-dark.png"
                    alt="Tweet from Andrej Karpathy (@karpathy) describing his llm-council project: multiple models respond independently, review each other's anonymized answers, and a chairman model produces the final response."
                    width={936}
                    height={504}
                    className="w-full h-auto rounded-[12px]"
                  />
                }
              />
            </div>
          </div>
        </div>

        {/* The Reframe */}
        <div className="border-b border-border-default flex flex-col gap-32px items-start pb-40px w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            THE REFRAME
          </span>
          <div className="flex flex-col gap-16px items-start w-full">
            <div className="flex gap-24px items-start w-full">
              <span className="font-ui font-semibold text-text-muted text-[14px] leading-[20px] min-w-[40px] shrink-0 pt-4px">
                From:
              </span>
              <span className="font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px] line-through">
                Build a UI for multi-model output synthesis.
              </span>
            </div>
            <div className="flex gap-24px items-start w-full">
              <span className="font-ui font-semibold text-text-accent text-[14px] leading-[20px] min-w-[40px] shrink-0 pt-4px">
                To:
              </span>
              <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
                Build a deliberation surface that makes the verdict
                trustworthy — because if users don&rsquo;t trust the process,
                they won&rsquo;t trust the output.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
