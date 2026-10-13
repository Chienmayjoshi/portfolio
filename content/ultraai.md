Reference snapshot, may be stale vs Figma.

# UltraAI — Case Study Content

Draft v3 · 13 scrolls · Synced to the final Figma slides

**What changed in v3:** Figma is now the source of truth. All copy for Scrolls 5 to 12 and the closing slide was updated to match the final Figma slides, including the decision cards (now labelled Chose, Gave up, Why), the simplified Veda, Paywall and Flex chapters, and the new Design System, Illustration System, Where Things Stand and Reflections slides. Flex now has two decisions. Items with no matching Figma slide are marked in place.

## Sticky side-rail (persists across all scrolls)

| Label | Anchor | Scroll |
|---|---|---|
| The Shell | #shell | Scroll 5 |
| Veda | #veda | Scroll 6 |
| Paywall System | #paywall | Scroll 7 |
| Flex | #flex | Scroll 8 |
| Design System | #design-system | Scroll 9 |
| Illustration System | #illustration-system | Scroll 10 |
| Status | #status | Scroll 11 |
| Reflections | #reflections | Scroll 12 |

## SCROLL 1 · Hero

No feature or expert names. Domain established, nothing more.

**Eyebrow**
UltraAI · B2C · MULTI-EXPERT AI

**Project title**
UltraAI

Turning a single AI chatbot into a system nine domain experts run on.

**TL;DR**
A chatbot is only as valuable as its one conversation. UltraAI runs on domain experts, each with its own home and signature feature, as one unified app or its own standalone app.

## SCROLL 2 · At a glance

Role  Lead Product Designer
Platform  iOS · Android · Web
Team  sole design and product decision-maker, no PM
Constraint  One codebase, unified app or standalone per expert

## SCROLL 3 · Opening illustration

Concept direction only — not yet built.

Visual concept: nine silhouettes standing behind a single chat bubble, none of them visible until you look past it. Communicates the buried-expert problem before a word is read.

## SCROLL 4 · Product + Problem

**THE PROBLEM**

### Chat was the Product

The product was a chat thread, with real expertise sitting behind a static sidebar. No home screen surfaced it, no preview showed what an expert could do, and no reason existed for most users to go looking in the first place.

Visual annotations on the screens: EXPERT ACCESS, hidden / one tap deeper. Recent Chats, ranked first. Expert List, ranked second. Selected expert, same chatbox / different paint.

**THE PRODUCT**

### Experts became the product

Nine domain experts, each with its own home and its own signature feature. One navigation model, built to hold all nine or to stand alone as just one. Chat is still there, one way in, not the only one.

## SCROLL 5 · The Shell · #shell

Slides 5.1 to 5.3 and Decisions 01 to 05 match the final Figma slides.

### SLIDE 5.1

One Nav, Nine Different Apps.

The brief only asked for one app that could hold multiple experts. Nothing yet about any of them needing to stand alone.

### SLIDE 5.2

**REJECTED DIRECTION**

One Nav for Every Expert

Every expert lived in a horizontal top tab bar beside For You, all treated as equal peers, with a fixed bottom nav below it.

- **Just Another Peer**  Tapping Experts always opens For You, and stays lit no matter which expert you’re in. For You still reads as just another peer, not the orchestration layer it actually is.
- **No Cap, No Priority**  Every new expert adds another permanent tab to that top bar, which has no cap and no way to prioritize which experts matter most.
- **Nothing Reusable**  Each expert got its own second row of tabs, like Veda’s Today, Explore, Learning. None of it was reusable, nine experts meant nine separate sets to build and maintain.

Visual: two screens, Experts tab active in the bottom nav, and one expert’s tab active in the top bar.

### SLIDE 5.3

**SHIPPED DIRECTION**

One Nav, Three Contexts

The top bar switches between experts, pin up to four, rest in Explore All. The bottom nav adapts: Home, Tools, Chat in the unified app, Home, Signature, Explore, Chat inside an expert.

- **One Job Split in Two**  For You is no longer a tab. It’s what Home means in the bottom nav for the unified app, an orchestration layer that routes to every expert, not one option sitting alongside them.
- **Pin Four, Explore the Rest**  The top bar now holds up to four pinned experts, chosen by the user. Every other expert lives one tap away in Explore All.
- **No Switching, No Top Bar**  A standalone app has nothing to switch between, so there’s no top bar. The bottom nav alone carries Home, Signature, Explore, Chat.

**VISUALS — THREE SCREENS NEEDED**

- Not yet provided — Unified app, steady state. Top bar with pinned experts, bottom nav Home / Tools / Chat, populated with real content, not the first run screen.
- Not yet provided — Expert view, reached from the unified app. Inside Veda, top bar still visible, showing Veda active alongside the other experts.
- Confirmed — Standalone app screen. No top bar, bottom nav Home / Spreads / Explore / Chat.

### FIVE DECISIONS

**01**
Home stays in the bottom nav

**Chose**  The first bottom nav tab changed from "Experts" to "Home." It always takes you back to where you started, the For You hub or an expert’s own dashboard.
**Gave up**  "Experts" just meant you were somewhere in that section. It looked the same whether you were on the main hub or deep inside an expert.
**Why**  People need one fast way back to their starting point, from anywhere in the app.

**02**
The nav adapts to where you are

**Chose**  One nav component, two shapes. On For You it shows Home, Tools, Chat. Inside an expert it shows Home, Signature, Explore, Chat. Standalone apps only use the second shape.
**Gave up**  Building a separate standalone nav later, whenever the business decided to launch one.
**Why**  A user is either on For You or inside an expert, so the unified app needs two shapes. Standalone has no For You, so it only needs the one.

**03**
Expert pinning, capped at four

**Chose**  Pinning already existed as an uncapped list in the sidebar. It moved into the top bar and now caps at four.
**Gave up**  An unlimited pinned list tucked behind the menu.
**Why**  A hidden, unlimited list is hard to find and can still grow out of control. The top bar is where people switch experts, and four keeps it easy to scan.

**04**
Color as wayfinding, not branding

**Chose**  Every expert gets its own accent color, used consistently on buttons, chips, and icons.
**Gave up**  One shared brand color for the whole app, with experts told apart only by their avatar and name.
**Why**  With nine experts in one app, color is the fastest way to know who you’re talking to, faster than reading a label every time.

**05**
Ask for data when it’s needed.

**Chose**  Every expert asks for data only when a feature needs it. Veda’s first features need just a sun sign, so she starts light. Flex’s first feature needs body metrics, so he asks on day one.
**Gave up**  One onboarding flow for every expert.
**Why**  Asking less is not always better. Veda is useful with almost nothing, while a workout plan is useless without body metrics. Asking at the point of need gives people value sooner.

**ANIMATED DIAGRAM (no matching slide in the final Figma yet)**
Same nav component, three states: orchestration layer, expert context, standalone root. Scroll-triggered, built from the real expert icons and accent tokens.

**HONEST FAILURE (no matching slide in the final Figma yet)**
The accent-color rule almost didn’t survive its first real components. Veda’s purple got hardcoded directly into the shared Button and Chip components, so every expert built after her inherited that color by default, regardless of its own token. Fix: both components rebuilt to take an accent prop instead of a fixed fill. Lesson: a platform rule isn’t real until it’s been tested against a shared component, not just stated as a principle.

## SCROLL 6 · Veda · #veda

Condensed.

**THE REFERENCE BUILD**

### Veda, Prove Value First

Veda was built first, so she set the bar for every expert after her: show value before asking for personal details, and keep the first tap free.

**01**
Onboarding by intent

**Chose**  Onboarding starts with what you came for. Your focus areas set what shows up first, and your experience level sets how Veda talks to you. Every expert starts this way.
**Gave up**  One long signup screen asking for birth date, time, and location before showing anything.
**Why**  Full birth details are more personal than a sun sign. Veda asks for them later, only when a feature like the birth chart needs them.

**02**
Tarot’s credit economy

**Chose**  Tarot is Veda’s signature feature. Drawing a card is free and unlimited, and only the AI insight on a card costs a credit. The cost shows on the button before you tap.
**Gave up**  Charging a credit for every action, including the draw.
**Why**  Free draws give people a reason to come back every day. The credit sits only on the interpretation, the one moment worth paying for.

**VISUALS**
- Full onboarding flow, four screens
- Tarot flow — draw, insight request, Codex
- Handover index screenshot — 112 screens, zero dead links, verified programmatically

## SCROLL 7 · The Paywall System · #paywall

Condensed.

**THE SHARED SYSTEM**

### One Paywall, Not Nine

One paywall system, three screen formats and five fixed placements. Built once for Veda, and every expert after it follows it.

**01**
Three templates, real intent trigger

**Chose**  Every paywall uses one of three formats: a bottom sheet for one blocked action, a feature paywall for a bigger ask, or a full subscribe screen. None of them appear until someone hits a real wall.
**Gave up**  One upgrade screen used everywhere, and prompts shown before someone has anything to lose.
**Why**  A paywall that appears too early feels like an interruption. One that appears right after a real wall feels fair, because the person already knows what they’re missing.

**02**
The paywall shows in five places only

**Chose**  The paywall appears in only five places: a feature’s detail page, a chip on an expert’s home screen, when chat credits run out, right after onboarding, and on the profile page.
**Gave up**  Adding an upgrade prompt wherever a screen felt empty.
**Why**  Five is a limit. Leaving other tempting spots out on purpose keeps the paywall from chasing people around the app.

**VISUALS**
- Three-template comparison, annotated
- Placement map across the app

**OUTCOME (no matching slide in the final Figma yet)**
None of this got rebuilt for Flex. Same three templates, same five-placement rule, carried over unchanged — only the specific gates moved. That’s the actual test of whether this was a system or a well-designed screen that happened to work once.

## SCROLL 8 · Flex · #flex

Condensed.

**THE GENERALIZATION TEST**

### Flex, Prove the System Holds

Flex is UltraAI’s fitness expert, built second to test Veda’s system in a new domain. Same navigation, same paywall, same data ask: if they hold here, they hold anywhere.

**01**
Every expert gets a signature slot

**Chose**  Each expert has one signature feature, in the same bottom nav slot. Tarot for Veda, Workout Session for Flex. Same nav component, different feature behind it.
**Gave up**  Custom navigation for each expert’s main feature.
**Why**  People learn where an expert’s main feature lives once, and it works for every expert after. Flex proves it: a very different domain, same slot.

**02**
Flex asks for body metrics on day one

**Chose**  Flex asks for body metrics, like height and weight, at the start of onboarding. It is the same data ask rule as Veda’s, with the opposite result.
**Gave up**  Asking gradually, the way Veda does.
**Why**  A workout plan doesn’t work without body metrics, so Flex needs them on day one. Veda’s first features need almost nothing, so she asks later. The rule stays the same and the answer follows the feature.

**VISUALS**
- Decision 01: animated nav loop, Home to the Workout tab to a running session
- Decision 02: animated onboarding loop, five steps with a drawer that resizes to fit each step

## SCROLL 9 · Design System · #design-system

**THE DESIGN SYSTEM**

### One system for all nine experts.

I used AI to generate the first pass of the tokens for color, type, and spacing while designing Veda, then refined them by hand. Flex reused every token without changes. A new expert plugs in its own accent tokens instead of building a UI from scratch.

- First pass of tokens generated with AI, then tuned by hand in Figma
- Flex reused every token and changed only its accent
- Shared components (Empty State, Paywall, Onboarding) keep the same structure, with only accent and copy changing
- Light and dark mode run off the same tokens

AI got the system started and my judgment shaped it, so a new expert now costs a set of tokens, not a new UI.

## SCROLL 10 · Illustration System · #illustration-system

**THE ILLUSTRATION SYSTEM**

### One style guide for every AI tool

Every image in UltraAI is AI generated, and three things keep it looking like one product.

**Many AI tools, one style**
ChatGPT and Gemini make the tarot cards, icons, banners, and empty states. One shared style guide sits behind all of them.

**A fixed prompt template**
The same template runs in every tool, so images match across all nine experts and in light and dark mode.

**An icon for every expert**
Crescent for Veda, dumbbell for Flex, chef’s hat for Luca. Color plus icon makes each expert easy to recognize.

Any new asset comes out in the product’s style on the first prompt.

## SCROLL 11 · Status · #status

**WHERE THINGS STAND**

**Solo**
No PM. I made every product and design decision.

**2 experts designed**
Veda and Flex are done. The rest follow the same system.

**1 shared template**
Every expert follows one template for onboarding and paywall.

**All experts visible, launched one at a time**
The full product shows from day one, and each expert goes live only when it’s ready.

**Show all nine from day one**
Veda is live and fully usable. The other eight are marked Soon, so early users see the whole product.

**One launch at a time**
Veda went first and Flex second. Each expert goes live only when its own flow is finished.

Visual: onboarding screen showing Veda live, remaining experts marked Soon.

## SCROLL 12 · Reflections · #reflections

**REFLECTIONS**

### My Key Takeaways and Learnings

- Give every expert a signature feature.
  Veda has Tarot, Flex has Session, right there in the nav. That’s what makes each one feel like its own person, not just a different color.
- Ask for data when it’s needed.
  Veda waits for birth details until a reading needs them. Flex asks for body metrics first, because a plan can’t work without them.
- Build the system once.
  Tokens and components made for Veda carried into Flex, so a new expert only brings its own accent.
- Cover shared states once.
  Empty, error, and payment states use one set of components. Only the accent and copy change per expert.

Nine experts, one system: each new expert brings its own accent and its own signature feature.

**How would I do differently now with AI?**

- Stress test new experts against locked rules
  I checked every platform rule by hand, which doesn’t scale. An AI pass could check each new expert against the locked rules before handoff.
- Investigate patterns before building
  Flex found its real shape mid build. AI could run the same competitor and platform rule check for experts like Sage and Kaia upfront, before a screen gets designed.

## SCROLL 13 · Close · Share · Next

- Thanks for reading. That’s the thinking, start to finish.
- You read the whole thing. Most people don’t. I mean that.
- If you want to dig into anything I skimmed over, process, edge cases, the tradeoffs that didn’t fit on the page, reply by email or send this to a teammate.
- Buttons: Let’s talk → [email link] · Give Quick Feedback
- Read next → Figma still shows the FastRouter Analytics placeholder card. Swap in the real next case study.
- Prev ← FastRouter
