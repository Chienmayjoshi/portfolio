"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  useHeaderCaseStudyPill,
  useHeaderInvertSurface,
} from "@/components/shared/HeaderProvider";

// Case-study routes get "← Back" (to "/", the project listing) in the left
// slot instead of the site logo — you're inside one project, not browsing
// the index, so the exit path matters more than the identity mark there.
// "/fastrouter-slides" is covered by the same "/fastrouter" prefix, no
// separate entry needed. Route-matched via usePathname rather than a
// per-page context registration (like the center pill uses) — this only
// ever depends on which page you're on, never on scroll/slide position
// within a page, so there's no need for the heavier per-page-opt-in
// machinery HeaderProvider's pill already has.
const CASE_STUDY_ROUTE_PREFIXES = ["/fastrouter", "/analytics", "/extensions"];

// TEMPORARY inline icon — per direct instruction, new icons should use
// Phosphor (`@phosphor-icons/react`) going forward, but that package isn't
// installed yet (`npm install @phosphor-icons/react` hit the same
// registry-connection block `ogl` did for AuroraShader.tsx — this sandbox
// can't reach registry.npmjs.org). Unlike AuroraShader, Header is global
// (every route renders it via the root layout), so a broken import here
// would 500 the entire site, not just one component — building with this
// stand-in now rather than leaving the feature blocked. Swap for
// `import { ArrowLeft } from "@phosphor-icons/react"` and `<ArrowLeft
// size={20} />` once the install has actually been run.
function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-20px"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// Same TEMPORARY-inline-icon situation as ArrowLeftIcon above — swap for
// `<List size={20} />` / `<X size={20} />` from @phosphor-icons/react once
// installed. Mobile-only trigger (see NAV_ITEMS below): the site-nav list
// the pill shows inline on desktop has nowhere to live at 390px, so Figma's
// mobile header (node 7255:7230) moves it behind a second 40x40 icon button
// next to the theme toggle. No "menu open" state exists in that file to
// match pixel-for-pixel — this dropdown is a function-first build, not a
// Figma-locked one (see CLAUDE.md's two build-mode split).
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-20px"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  );
}

// Shared by both the desktop pill's inline nav and the mobile hamburger
// dropdown, so the four items can't drift out of sync between the two
// surfaces. "Work" is the only real destination; the rest are inert, same
// convention Footer.tsx uses for its own unresolved nav items.
const NAV_ITEMS: { label: string; href: string | null }[] = [
  { label: "Work", href: "/" },
  { label: "AI Practices & Taste", href: null },
  { label: "About", href: null },
  { label: "Contact", href: null },
];

// Global navbar — replaces TempHeader.tsx (explicit placeholder scaffolding)
// and absorbs SlideHeader.tsx (fastrouter-slides-only header, now deleted).
// No Figma frame exists for this yet and no personal logo/wordmark exists
// anywhere in the repo either — built function-first per CLAUDE.md's
// process for undesigned chrome ("everything else": function first,
// token-compliant, Figma-lock later), text wordmark rather than a graphic
// mark, per direct instruction.
//
// Height kept at the same ~64px TempHeader already established (12px
// padding top/bottom + the 40px ThemeToggle) — four other places
// (fastrouter/page.tsx's HEADER_OFFSET, globals.css's .practice-snap,
// practice/BuildCard.tsx) hardcode that exact number with no shared
// constant, so changing it here would require updating all of them too.
//
// Center pill has two states, driven by HeaderProvider's context rather
// than props (Header lives above the page tree at the root layout, so
// pages can't hand it props directly — see HeaderProvider.tsx):
// - Default: sitewide nav (Work/AI Practices & Taste/About/Contact).
//   "Work" is the only real destination (home) — the rest render as inert
//   text, same convention Footer.tsx already uses for its own unresolved
//   nav items (LinkedIn/AI Practices/Design Taste/Store). Note: Footer's
//   copy splits "AI Practices" and "Design Taste" as two separate items;
//   this pill's combined "AI Practices & Taste" is a pre-existing
//   inconsistency inherited from SlideHeader's own Figma source, not
//   reconciled here — see IMPLEMENTATION_LOG.md.
// - Case-study: project logo + business + domain, once a reader is past
//   that case study's intro (set via useCaseStudyIntroPill.ts on
//   vertical-scroll pages, or SegmentedRail.tsx on fastrouter-slides).
//
// Pill transition (added once a second fastrouter-slides slide made the
// swap actually visible in practice, not just theoretical): `motion.nav
// layout` lets Motion measure the old/new natural width and interpolate
// between them automatically (FLIP), rather than the pill instantly
// snapping to its new size. `AnimatePresence mode="popLayout"` handles the
// content crossfade — the exiting branch is taken out of layout flow
// (hence `relative` on the nav, its positioning anchor) so the incoming
// one can settle into its final layout immediately instead of waiting for
// the old one to finish fading. No new state — this only changes how the
// existing `caseStudyPill` context value renders.
//
// Outer row is a 3-column grid (`1fr auto 1fr`), not `flex justify-between`
// — flagged directly: with justify-between, the middle pill only lands on
// the true page center when the left (logo) and right (theme toggle) items
// happen to have equal widths, which they don't ("Chinmay Joshi" text vs.
// a 40px circle). Two equal `1fr` flanking columns force the middle
// column — and the pill inside it — to sit at true center regardless of
// how wide the logo or toggle are.
export default function Header() {
  const { caseStudyPill } = useHeaderCaseStudyPill();
  const { invertSurface } = useHeaderInvertSurface();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCaseStudyPage = CASE_STUDY_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  return (
    // `chapter-intro-invert` (globals.css) re-scopes this subtree's color
    // tokens to the INVERSE of the global theme so the header's CHROME (pill,
    // toggle, back link, mobile scrim — all token-driven) matches a slide that
    // inverts, instead of leaving light chrome stranded over a dark slide.
    // Driven per-slide by the deck via HeaderProvider; empty on normal pages
    // leaves the header at the global theme.
    //
    // The header stays BACKGROUND-TRANSPARENT (no bg utility). The
    // fastrouter-slides deck is pulled up to full-viewport height behind this
    // header (see page.tsx), so the slide's own background shows THROUGH the
    // header — including, mid-transition, a clean vertical split when a light
    // and a dark slide are side by side. That's the reference's (zainabkabira)
    // technique: a transparent fixed nav over full-height panels, only its text
    // colour swapping. So there's no background band to keep in sync here; this
    // class only flips the chrome colour. The token-consuming children keep
    // their own color<->color transition-colors so the chrome fades.
    <header
      className={`sticky top-0 z-50 w-full ${
        invertSurface ? "chapter-intro-invert" : ""
      }`}
    >
      {/* Mobile-only gradient scrim (Figma reference node 7284:440). On small
          screens the page content scrolls up under this sticky header and the
          bare icons (back arrow, toggle, menu) were getting lost in it. A
          backdrop blur was tried first but looked wrong when a line of text
          sat half-under the header (a sharp blurred band) — flagged directly.
          A gradient that fades bg-primary (opaque, behind the icons) down to
          transparent dissolves the rising content into the page colour
          instead, with no hard edge. `-z-10` keeps it above the page content
          it's covering but below the header's own icons; inset-0 spans the
          header's own height so content just below the header stays crisp.
          Uses the bg-primary token so it flips with the light/dark toggle.
          md:hidden — desktop layouts don't scroll content under the header.
          Inline gradient, matching this codebase's gradient convention
          (ScreenshotFrame/GridDepthLayer). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-bg-primary) 0%, var(--color-bg-primary) 50%, transparent 100%)",
        }}
      />
      {/* Mobile padding (pt-32px/pb-8px/px-20px) is a real, measured value
          from Figma's mobile header (node 7255:7230) — not the generic
          edgePadding_PROPOSED token, and not symmetric top/bottom like
          desktop's py-12px. Desktop values (px-40px/py-12px) unchanged.

          Every direct child gets an explicit col-start-N. Without it, CSS
          Grid's implicit auto-placement skips a display:none item (the
          center nav, hidden below md whenever there's no case-study pill)
          entirely rather than collapsing its track to zero width — the
          two visible children then auto-place into the first two tracks
          in DOM order, so the right icon group lands in the middle
          (auto-sized-to-its-own-content) track instead of the actual
          rightmost one, leaving the true right column empty. Confirmed
          directly via CDP: grid-template-columns still reported all three
          tracks (129px/92px/129px), but the icon group's own rect sat at
          the middle track's x-range, not flush against the right edge —
          exactly this failure mode. Explicit placement makes each child's
          column fixed regardless of a sibling's display state. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-20px pt-32px pb-8px md:px-40px md:py-12px">
        {isCaseStudyPage ? (
          <Link
            href="/"
            className="col-start-1 flex items-center gap-8px justify-self-start font-ui text-[16px] text-text-primary tracking-[0.08px] hover:text-text-accent transition-colors shrink-0"
          >
            <ArrowLeftIcon />
            {/* Figma's mobile Back button hides the text node, icon-only —
                matched here rather than reproducing its exact 40/32/24
                nested-frame padding, which doesn't carry meaning beyond
                hit-target sizing. */}
            <span className="hidden md:inline">Back</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="col-start-1 justify-self-start font-display font-bold text-text-primary text-[20px] tracking-[-0.3px] shrink-0"
          >
            Chinmay Joshi
          </Link>
        )}

        <motion.nav
          layout
          transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          aria-label="Site"
          className="col-start-2 relative hidden items-center justify-self-center overflow-hidden rounded-full border border-border-default bg-bg-surface px-24px py-12px font-ui text-[16px] text-text-primary tracking-[0.08px] transition-colors duration-300 md:flex"
        >
          {/* Unconditionally hidden below md — corrected from an earlier
              "shows once a case-study identity exists" assumption that
              turned out to be an unverified extrapolation, not something
              Figma actually confirmed. Real bug once Problem's mobile
              frame set a real caseStudyPill: the full-width desktop pill
              (logo + business + domain, gap-12px, generous padding) tried
              to render on a 390px header and broke the layout, pushing
              the icon group around. Neither mobile frame checked so far
              (Hero's node 7255:7236, Problem's node 7249:6413) ever shows
              a populated pill — both keep the center slot empty — so
              staying hidden here is the conservative, actually-verified
              default until a mobile frame exists that shows what a
              populated state should look like. The "default" site-nav
              branch below stays desktop-only regardless, moved to the
              hamburger dropdown on mobile instead (NAV_ITEMS, shared by
              both). */}
          <AnimatePresence mode="popLayout" initial={false}>
            {caseStudyPill ? (
              <motion.div
                key="case-study"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-12px"
              >
                {caseStudyPill.logo}
                <span className="text-text-muted">·</span>
                <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
                  {caseStudyPill.business}
                </span>
                <span className="text-text-muted">·</span>
                <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
                  {caseStudyPill.domain}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-40px"
              >
                {NAV_ITEMS.map((item) =>
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="hover:text-text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span key={item.label}>{item.label}</span>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        <div className="col-start-3 flex items-center gap-12px justify-self-end">
          <ThemeToggle />

          {/* Hamburger — mobile only (Figma's second 40x40 right-side icon
              button, gap-12px from the theme toggle, same measured value
              this row now uses). Reuses ThemeToggle's own button chrome
              (size-40px rounded-lg border-border-default bg-bg-surface)
              rather than inventing a second style, since Figma shows both
              buttons sharing identical treatment. */}
          <div className="relative flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex items-center justify-center size-40px shrink-0 rounded-lg border border-border-default bg-bg-surface text-text-muted hover:text-text-primary hover:border-border-frame transition-colors"
            >
              <HamburgerIcon open={mobileMenuOpen} />
            </button>

            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <motion.div
                    key="panel"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[220px] flex-col gap-4px rounded-xl border border-border-default bg-bg-surface p-8px shadow-lg"
                  >
                    {NAV_ITEMS.map((item) =>
                      item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-lg px-16px py-12px font-ui text-[16px] text-text-primary hover:bg-bg-light transition-colors"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span
                          key={item.label}
                          className="rounded-lg px-16px py-12px font-ui text-[16px] text-text-muted"
                        >
                          {item.label}
                        </span>
                      )
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
