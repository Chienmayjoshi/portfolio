# Portfolio — Claude Code Brief

Senior product designer's portfolio. Three case studies: FastRouter (AI infra),
Analytics (B2B enterprise), Browser Extensions (B2C). Positioning: frontend-dev
background, thinks in constraints, speaks engineer. The portfolio itself should
demonstrate that — hand-coded, not templated.

## Source of truth — read this before touching content or layout

- **FastRouter**: Figma is canonical for BOTH layout and copy. File key
  `2aoIFdaJMyNBEWeQESBEzG`, full layout node `6368:53594`. Content in this file
  does not change unless explicitly instructed — don't improvise or paraphrase
  copy from memory. If Figma text conflicts with any doc in `/content`, Figma
  wins; flag the conflict, don't silently pick one.
- **Analytics / Extensions**: not locked in Figma the same way yet. `/content`
  docs (case study narratives) are canonical until told otherwise.
- Never invent case study copy. If content is missing for something you're
  building, stop and ask — don't fill the gap with plausible-sounding text.

## Positioning — read before making ANY aesthetic judgment call

The person's design range is NOT "Linear/Stripe/Vercel enterprise-SaaS,"
full stop. That register applies specifically to the three locked case
study pages (FastRouter/Analytics/Extensions) — it's correct there because
it's what those pages are already designed as, and it's the right register
for showcasing serious B2B product work to FAANG/enterprise hiring teams.
It does not describe the person or the rest of the portfolio.

He is a versatile designer: strong product UX, classy UI, AND a genuine
illustration/painting practice — not just design taste, actual hands-on art
(visible on his Instagram, @chienmayjoshi). His stated primary creative
inspiration is nature — anatomy, mechanics, color systems in the natural
world — not SaaS or tech references. He also understands animation from
first principles, not only through tool-specific conventions.

**Practical rule**: outside the three locked case study pages — homepage
hero, About, Practice page, any illustration or motion work — do not
default to enterprise restraint. Don't sand down a creative or expressive
choice just because it wouldn't fit on a Stripe landing page. If a
component doesn't have a locked Figma reference yet and isn't part of a
case study, ask which register applies rather than assuming the case-study
one extends everywhere.

## Two build modes — know which one applies before starting anything

1. **Case studies (Figma-locked)**: FastRouter now; Analytics and
   Extensions once their Figma locks. Figma-first, content and layout
   already decided, no phase-2 improvements until the full portfolio ships
   once. Build to match what's already there — see Source of Truth above.
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
  edge. Confirmed reusable across all three case studies — build it once,
  don't fork it per case study.
- Component folder convention: `src/components/fastrouter/`,
  `analytics/`, `extensions/`, `shared/`.

## Build order — do not deviate

FastRouter ships completely — every scroll, real assets, real animation —
before Analytics or Extensions get touched. Don't build shared
infrastructure speculatively across all three case studies before it's
proven working on one. Scroll 1 (Hero) first, fully correct, before Scroll 2
opens. If work has jumped ahead of this rule (e.g. later-scroll components
built before an earlier scroll was confirmed correct), that's a deliberate
person-directed exception, not a default to repeat — check before assuming
it's fine to keep skipping the gate.

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
case-study prefix (`fr`, `an`, `ex`), then feature, then state (e.g.
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
