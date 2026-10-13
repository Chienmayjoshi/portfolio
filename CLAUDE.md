# Portfolio — Claude Code Brief

Senior product designer's portfolio. Four case studies: FastRouter (AI infra),
UltraAI (multi-expert AI app, B2C), Analytics (B2B enterprise), Browser
Extensions (B2C, stretch — only if time allows after the first three ship).
Build order is FastRouter, then UltraAI, then Analytics; UltraAI took
Extensions' place as "next up" in the queue, it did not add a fifth study.
Positioning: frontend-dev background, thinks in constraints, speaks engineer.
The portfolio itself should demonstrate that — hand-coded, not templated.

## Source of truth — read this before touching content or layout

- **FastRouter**: Figma is canonical for BOTH layout and copy. File key
  `2aoIFdaJMyNBEWeQESBEzG`, full layout node `6368:53594`. Content in this file
  does not change unless explicitly instructed — don't improvise or paraphrase
  copy from memory. If Figma text conflicts with any doc in `/content`, Figma
  wins; flag the conflict, don't silently pick one.
- **UltraAI**: Figma is canonical for BOTH layout and copy, same rule as
  FastRouter. See the dedicated **UltraAI** section below for file keys,
  register, and content rules specific to this case study.
- **Analytics / Extensions**: not locked in Figma the same way yet. `/content`
  docs (case study narratives) are canonical until told otherwise.
- Never invent case study copy. If content is missing for something you're
  building, stop and ask — don't fill the gap with plausible-sounding text.

## Positioning — read before making ANY aesthetic judgment call

The person's design range is NOT "Linear/Stripe/Vercel enterprise-SaaS,"
full stop. That register applies specifically to the Figma-locked B2B case
study pages (FastRouter/Analytics/Extensions) — it's correct there because
it's what those pages are already designed as, and it's the right register
for showcasing serious B2B product work to FAANG/enterprise hiring teams.
It does not describe the person or the rest of the portfolio.

**UltraAI is the deliberate exception to this register, despite also being
Figma-locked.** It's a B2C, multi-expert consumer AI app, not enterprise
SaaS — see the dedicated **UltraAI** section below for the register that
actually applies there. Figma-locked ≠ enterprise register; those are two
separate axes, and UltraAI is locked on layout/copy but not on register.

He is a versatile designer: strong product UX, classy UI, AND a genuine
illustration/painting practice — not just design taste, actual hands-on art
(visible on his Instagram, @chienmayjoshi). His stated primary creative
inspiration is nature — anatomy, mechanics, color systems in the natural
world — not SaaS or tech references. He also understands animation from
first principles, not only through tool-specific conventions.

**Practical rule**: outside the enterprise-register case study pages
(FastRouter/Analytics/Extensions) — homepage hero, About, Practice page,
UltraAI, any illustration or motion work — do not default to enterprise
restraint. Don't sand down a creative or expressive choice just because it
wouldn't fit on a Stripe landing page. If a component doesn't have a locked
Figma reference yet and isn't part of an enterprise-register case study,
ask which register applies rather than assuming the case-study one extends
everywhere.

## Two build modes — know which one applies before starting anything

1. **Case studies (Figma-locked)**: FastRouter now; UltraAI next; then
   Analytics once it's up; Extensions only if time allows once all three
   ship. Figma-first, content and layout already decided, no phase-2
   improvements until the full portfolio ships once. Build to match what's
   already there — see Source of Truth above.

   **Format, every case study after FastRouter**: the horizontal slide-deck
   mechanic with the segmented progress rail (`fastrouter-slides` /
   `SlidesDeck` / `SegmentedRail`), never the sticky-side-rail vertical-scroll
   page (`SectionRail`) FastRouter's own locked page uses. That vertical
   format is specific to FastRouter's already-shipped page — it is not the
   template going forward, for UltraAI or anything after it.
2. **Everything else (hero, Practice page, new ideas)**: function first,
   validated conceptually before visual design exists, then visual design
   locked in Figma, then motion validated separately before implementation.
   Token-compliant from the FIRST functional pass regardless — every color,
   spacing, and radius value from `design-tokens.json` even before a Figma
   reference exists for that specific component. A "basic functional"
   first pass that hardcodes values turns the visual pass into a refactor
   instead of a reskin — don't let that happen.

## Design tokens

`design-tokens.json` at project root is the single source of truth for color,
type, spacing, radius, opacity, layout. Primitive tier = raw values, semantic
tier = role-based aliases, split light/dark. Values marked `_PROPOSED` weren't
in Figma and need sign-off before being treated as final — ask before relying
on them for anything shipped.

Tailwind wiring lives in `src/app/globals.css` (`@theme` block — Tailwind v4,
no `tailwind.config.ts`). Two naming conventions there are deliberate, not
mistakes:
- Color utilities look redundant (`bg-bg-primary`, `text-text-primary`,
  `border-border-frame`) — this is intentional, keeps every class name
  greppable straight back to `design-tokens.json` with no translation layer.
- Spacing scale uses `px`-suffixed keys (`p-8px`, `gap-60px`, not `p-8`,
  `gap-60`) — Tailwind's default spacing scale is a rem multiplier where `p-8`
  already means 32px. Never add a bare-number spacing key; it silently
  overrides a real Tailwind default across every spacing-driven utility in
  the framework, not just the one you meant to touch.

Fonts: exactly two families, no others. **Season Mix** (display/headings)
and **Google Sans Flex** (everything else — body, label, caption, UI,
including `decision-title`). If you see DM Sans referenced anywhere (old
spec docs, or Figma's current binding on `decision-title`), that's stale —
Google Sans Flex is correct, confirmed directly by the person, not
inferred.

Season Mix (swapped in from Fraunces 2026-07-14, per direct instruction)
is a trial font (Displaay Type Foundry), not on Google Fonts — self-hosted
via `next/font/local` from `public/fonts/SeasonMix-TRIAL-Heavy.ttf`. It's
a **static** font: a single Heavy/900 weight, no variable axes at all. Two
things that follow from that:
- Don't add `fontVariationSettings` anywhere on `font-display` text —
  Fraunces' old `'"SOFT" 0, "WONK" 1'` axes were removed everywhere they
  appeared (17 call sites) since Season Mix has no `fvar`/`gvar`/`STAT`
  table to respond to them.
- Anything requesting `font-semibold` (600) alongside `font-display`
  (three spots: the "stat" pull-quote style in `FiveDecisions.tsx`,
  `Impact.tsx`, `HonestFailure.tsx`) renders at the same 900 face
  regardless — a static font can't be thinned down. Expected, not a bug,
  until/unless a second (lighter) weight file is added.

## Known Figma/code sync gaps — don't treat Figma as ground truth on these specific points until fixed there

- `decision-title` text style is still bound to DM Sans in Figma. Code uses
  Google Sans Flex. Figma needs updating to match, not the other way round.
- The "ONE HONEST FAILURE" section (Council) has 64px top/bottom padding in
  Figma; should be 60px like every other section. Code already normalizes
  this to 60.
- The four gaps in the Council intro stack (brief → tension → conceptual
  grounding → reframe) are 56px in Figma; should be 64px to match the
  established doubling rhythm (32 standard / 64 emphasis). Code uses 64.
- Same "ONE HONEST FAILURE" section has two non-grid internal gaps (10.7px,
  18.5px) between label/paragraph/pull-quote. Code rounds these to 10px and
  20px. That whole component was built off-system in Figma — treat it as
  the least reliable reference point in the file until it's cleaned up there.

- The `fastrouter-slides` deck's slide title is 48px in code, 56px in Figma,
  and its decision-template accent line (decision 01's pull-quote, decision
  02's subtitle) is 24px in code, 28px in Figma. Both are direct-instruction
  changes from 2026-09-04, not drift — Figma needs updating to match. They
  live in `globals.css`'s `@theme` as `--text-slide-title` /
  `--text-slide-accent` (each with a `-sm` mobile companion), so a further
  size change is one edit, not fourteen class strings. All 14 slide titles
  are on the token, including the five that were already 48px. Everything else in the
  project still carries literal `text-[Npx] leading-[Npx] tracking-[Npx]`
  triples; don't tokenize more of them speculatively.

- The closing "thanks" slide (node `7468:21634`) labels its secondary button
  "Give Quick Feedback" in title case; the code says "Give quick feedback",
  which is what the shared `CaseStudyFeedback` row renders on all three
  vertical case studies too. One label, one component — the deck slide is a
  presentation variant of that same row, not its own button, so the sentence
  case wins and Figma wants updating. Same frame draws a decorative 8-tick
  rail mock; `SegmentedRail`'s `CHAPTERS` table (10 ticks since the Closing
  chapter was added 2026-09-07) is the tick count, not that mock.

- The mobile nav pill's collapsed state (node `7400:30189`) draws its left
  glyph with Figma's stock `Status` component — a SPINNER: a fixed 75% arc
  starting at 3 o'clock, rotating -1080 -> 0 on a 2s infinite loop. Code
  renders a scroll-PROGRESS ring instead: arc length driven by how far
  through the page the reader is, no rotation, starting at 12 o'clock and
  filling clockwise. Direct instruction, 2026-09-08 — the ring is a readout
  of position, which is the whole reason it replaced the old static map
  icon, and a spinner says "busy," not "you are here." The 3 o'clock start
  only meant anything while it was rotating. Figma wants updating on all
  three points; the caret that was added on the right in the same frame is
  matched exactly.

  Both icon slots stay 24px in code where that frame has 20px glyphs. Not
  drift — the pill's OPEN state (unchanged, per the same instruction) keeps
  its 24px close icon, so 20px slots would make the pill 44px tall collapsed
  and 48px open and it would visibly resize on every tap. The 20px glyphs sit
  centred in 24px boxes, so Figma's glyph size is honoured and the geometry
  is identical in both states.

- The `fastrouter-slides` HeroSlide headline has a DEFINED line layout per
  breakpoint rather than a free wrap, expressed as toggled `<br>` elements
  (display:none suppresses a break, so exactly one pair is live at any width —
  and the sentence stays in the document once, no duplicate h1 text). The
  canonical arrangement and the measurements behind it live in
  `src/components/shared/caseStudyEnterLines.ts`; keep that file and the markup
  in step. Figma's deck node has it as one free-wrapping string.

  Direct instruction, 2026-09-05/06. Two reasons. The case study enter
  animation (node 7438:44091) builds its big title on the `md` lines and flies
  the words onto this `<h1>`, so the two must agree at every width. And the free
  wrap was itself drift: at 48px in that 760px column it broke "...were flying /
  blind on every model decision.", splitting the phrase at "flying" — a
  side effect of the 56 -> 48px change above, since Figma's own 56px wraps that
  column to three lines. Measured against the real face, not inferred.

  One set cannot serve every width: the desktop arrangement's widest line is
  366px at the deck's mobile 32px, against the 350px a 390px phone offers.
  Hence two sets, split on `md`. The `md` set differs by one word from the live
  vertical Hero's, which stays locked to its own Figma node — deliberate, the
  deck follows the animation reference because the deck is what it lands on.

## UltraAI

UltraAI is the multi-expert AI app case study — a B2C product where a single
chatbot became a system nine domain experts run on. The Shell is the shared
navigation system (not itself an expert); Paywall System is the shared
monetization system reused across every expert (also not an expert). Veda
and Flex are the two experts actually designed so far; seven more are
undesigned (the expert-icon set hints at names like Luca for a
chef-hat-themed one, but that's not confirmed as designed).

- **Source of truth**: Figma is canonical for BOTH layout and copy, same
  rule as FastRouter.
  - Case study deck (the actual slides to build): same file as FastRouter,
    key `2aoIFdaJMyNBEWeQESBEzG`, root node `7518:5207`.
  - Veda dev handover master: key `zkRBe4ulKLfqh3kbeCfXBW`, node `18148:64`.
    Real Veda product UI at dev-handover fidelity (~24 flows — Homepage,
    Onboarding, Tarot Spreads, Paywall, Profile, etc.), **not** more
    case-study slides — this is asset source material the deck's
    screenshots get cropped from.
  - All Experts WIP: key `JiMnXUrWxrxv4WG371ygvi`, node `6:8`. A messier,
    deeper working file covering the same Veda product ground (moon phase,
    panchang, kundali, zodiac compatibility, etc.) plus the expert-icon set
    and planning notes. Same role as the Veda master — reference/source
    material, not slides. Don't pull raw screens from either file on your
    own initiative; asset exports come from the person per-slide.
  - `content/ultraai.md` is a **reference snapshot that may be stale** —
    the copy kept being edited after this doc was written, while the Figma
    slides were being built. Use it only for context on a scroll that has
    no finished Figma node yet, and say so explicitly whenever you do. If a
    scroll has no finished Figma node, stop and ask — don't build from the
    doc alone. Flag every conflict between the doc and Figma; never pick
    silently.
- **Register**: UltraAI is NOT in the enterprise-restraint lane (see
  Positioning above) — it gets its own visual register, closer to the
  consumer product's own personality. Format mechanics follow the standard
  rule in Two Build Modes above (slide-deck, not sticky side-rail). Register
  changes, structure doesn't.
- **Never name the collaborator** who built the original UltraAI app, in
  copy or code — not in strings, comments, or asset names. Describe their
  contribution as an inherited navigation proposal from a collaborator.
- **No live metrics exist yet.** The closing beat is Status, not Impact —
  don't reuse FastRouter/Analytics' stat-highlight "Impact" pattern here.
  Never invent numbers to fill the gap.
- **Honest failure** is a pull-quote component living inside an existing
  chapter (The Shell), not its own standalone chapter/slide the way
  FastRouter's Council section has one.
- **Flex is male** — he/him, in copy and code comments.
- **Copy voice**: short, simple, skimmable, direct. No rhetorical
  inversions, no poetic closers — a plainer voice than FastRouter's.
- **Asset prefix**: `ua`, using the existing `{prefix}-{feature}-{state}`
  convention (see Assets below).

## Animation — GSAP vs Motion, don't mix on one element

- **Motion** (`import { motion } from "motion/react"` — formerly Framer
  Motion, same engine Framer itself runs on): anything tied to React state —
  mount/unmount, gestures, layout transitions, spring physics.
- **GSAP + ScrollTrigger**: anything scroll-scrubbed or pinned — the sticky
  side-rail, the four-stage Council deliberation arc, annotation labels
  building in on scroll, the Observability before/after slider drag.
- Never let both touch the same element's timeline.
- If asked to replicate a Framer-native interaction: Framer's own animations
  run on Motion under the hood, so it's very likely reconstructable close to
  1:1 with Motion primitives — not a blind reverse-engineering problem.

## Reusable components

- `ScreenshotFrame` (`src/components/shared/`) — gradient background,
  bordered bezel (`border-frame` token, `radius-frame` = 30px, confirmed
  real value not a proposed one), CSS `mask-image` fade on the screenshot
  edge. Confirmed reusable across case studies — build it once, don't fork
  it per case study.
- Component folder convention: `src/components/fastrouter/`,
  `ultraai/`, `analytics/`, `extensions/`, `shared/`.

## Build order — do not deviate

FastRouter ships completely — every scroll, real assets, real animation —
before UltraAI gets touched. UltraAI then ships completely before Analytics
gets touched. Extensions is a stretch goal — touched only if time remains
after all three ship. Don't build shared infrastructure speculatively
across case studies before it's proven working on one. Scroll 1 (Hero)
first, fully correct, before Scroll 2 opens. If work has jumped ahead of
this rule (e.g. later-scroll components built before an earlier scroll was
confirmed correct), that's a deliberate person-directed exception, not a
default to repeat — check before assuming it's fine to keep skipping the
gate.

The already-built `analytics/` vertical-scroll page (`SectionRail`, 15
components, mirrors `fastrouter/page.tsx`'s structure) predates the
slide-deck rule above and is now superseded — don't use it as a structural
reference when Analytics' turn in the queue comes. It needs rebuilding in
the slide-deck format, not extending as-is.

## Copy principles (when writing or touching any case study text)

- Short and scannable over explanatory paragraphs.
- No generic SaaS language — "invisible interface," "trustworthy data," or
  "trust" framing where the actual problem was workflow interruption, not
  data trust.
- Flag if two sections are doing the same job.
- Cross-reference actual shipped screens when copy claims something about
  what was built — don't take the copy's word for it.

## Assets

`public/images/{case-study}/` — naming convention is `{prefix}-{feature}-
{state}`, no number, e.g. `fr-observability-exploration.png`. Two-letter
case-study prefix (`fr`, `ua`, `an`, `ex`), then feature, then state (e.g.
`-dark` for dark-mode variant; omit for light/default). Existing numbered
files (`fr-01-...`, `fr-04-decision-02-...`) were migrated to this
convention on 2026-07-31 — number stripped from the prefix position only;
numbers that are part of a feature name itself (e.g. `decision-01` through
`decision-04`, identifying which of five decisions) were left alone since
they carry meaning, not sequence cruft from the old convention. Every
in-repo reference (`src/components/fastrouter/`) was updated to match at
the same time.

Format decision: `.mp4` for motion/interaction demos (size and playback
performance — video codecs compress far better than an image sequence or
GIF for this content). `.webp` is the fallback for stills (compressed,
current default for screenshots). `.png` appears on some earlier
FastRouter stills predating the webp switch — legacy, not the standard to
match for new assets.

Screenshots are raster images — don't try to rebuild embedded
product-UI screens (e.g. FastRouter's own app chrome inside a screenshot)
as live components. Only the portfolio's own shell/chrome gets built live.
