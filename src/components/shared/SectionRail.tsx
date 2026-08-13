"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Sticky left-edge "jump to section" rail — reusable across case
// studies per CLAUDE.md's build-once-prove-on-one-then-reuse philosophy
// (same approach already used for ScreenshotFrame). This component takes
// no FastRouter-specific content at all; every case study passes its own
// `sections` list. First deployment is FastRouter (src/app/fastrouter/
// page.tsx) — reference behavior studied from calebwu.ca/RevisionDojo,
// per direct request, including a screenshot the person shared to
// confirm the visual style (plain text stack, no dots/pills, active item
// distinguished by weight/color only).
//
// GSAP + ScrollTrigger, not Motion — CLAUDE.md's animation policy names
// this exact feature ("the sticky side-rail") as a ScrollTrigger target.
// Three GSAP mechanisms cover the whole feature:
// - One ScrollTrigger with a plain numeric `start: appearAfterPx` (no
//   `trigger` element — binds directly to the scroller) toggles the
//   rail's visibility once the page has scrolled past that many pixels,
//   and hides it again scrolling back above it. Was originally tied to
//   the "intro" section's own exit point, but that section's actual
//   height pushed the appearance point much further down than intended
//   (per direct feedback) — a plain scroll-distance threshold is simpler
//   and matches what was actually wanted.
// - One ScrollTrigger per section (onEnter/onEnterBack) tracks which
//   one is currently in view, driving the active-label styling.
// - ScrollToPlugin drives the click-to-jump smooth scroll, so the whole
//   interaction stays on one consistent animation system rather than
//   mixing in native scrollIntoView.
//
// Fixed 2026-07-16 — real bug, not cosmetic: the visibility toggle used
// to fire off `onEnter`/`onLeaveBack` (edge-triggered, only fire exactly
// at the moment scroll crosses the threshold). With no `trigger` element
// and no `end` value, that edge-pair is fragile — if the effect re-runs
// (React re-render, a resize-triggered ScrollTrigger.refresh(), Strict
// Mode's double-invoke in dev) while scrolled deep past the threshold,
// there's no boundary crossing left to fire, so `visible` could get
// stuck out of sync with reality. Symptom seen: scrolled deep into the
// page, the rail's first few items (the back-link, "Intro") missing
// while later ones rendered fine — consistent with the fade-in stagger
// having run against a stale/incomplete visibility state. Replaced with
// `onUpdate`, which re-derives `visible` from the actual current scroll
// position on every scroll tick — it cannot get stuck, since there's no
// edge to miss. The opacity/stagger effect also now calls
// `gsap.killTweensOf(items)` before starting a new tween, so if it does
// ever fire twice in quick succession, the second call cleanly
// supersedes the first instead of two tweens fighting over the same
// elements' inline styles.
//
// Revised 2026-07-16, per direct feedback: was vertically centered
// (`top-1/2 -translate-y-1/2`) and slid in from the left — now pinned at
// a fixed `headerOffset + 60px` from the viewport top (directly under
// wherever the page's own header sits) and slides in from above instead.
// Also added an optional `backHref`/`backLabel` — a real navigation link
// (not a scroll-to-section jump like the rest of the rail), rendered
// above the section list with extra bottom margin to read as a distinct,
// separate affordance rather than another item in the same group.
//
// Staggered in/out (2026-07-16, per direct request): the fade/slide used
// to animate the whole rail as one block. Each item (the back-link plus
// every section button) now carries a shared `.rail-item` class and
// animates individually via GSAP's `stagger` option, queried once per
// visibility change rather than tracked with a ref per item — simpler
// than an array of refs, and standard practice for GSAP-in-React since
// GSAP operates on real DOM nodes anyway. Staggers top-to-bottom on the
// way in, bottom-to-top on the way out (`stagger.from`) — items unfurl
// downward and retract back the way they came, rather than every item
// reversing in place.
//
// Repositioned 2026-07-16, fixed -> sticky: page.tsx wraps this
// component and <main> in a shared 1440px row (rail column | 1060px
// content | flexible placeholder), matching a reference site's layout.
// `position: fixed` was viewport-relative — its fixed left offset never
// actually tracked that wrapper's real position once the wrapper itself
// centers via mx-auto on wide viewports, so the "framing" didn't line
// up. Switched to `position: sticky` (no more explicit left offset —
// horizontal position now comes from being a real flex child of that
// row) with the
// same `top: headerOffset + 60` offset, so it still visually pins near
// the top while scrolling, but now correctly moves with the wrapper
// instead of a flat viewport coordinate. The visibility breakpoint moved
// from `md:` (768px) to a new `min-[1300px]:` — 768px is far too narrow
// for a rail column plus the fixed 1060px content column to fit
// side-by-side without overflowing; 1300px is a judgment-call estimate
// (rail content + 1060px + safety margin), not a measured value, since
// there's no browser tool in this session to check the rail's exact
// rendered width — worth confirming visually and adjusting if it's off.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export interface SectionRailItem {
  id: string;
  label: string;
}

interface SectionRailProps {
  sections: SectionRailItem[];
  /** Scroll distance (px from top) after which the rail fades in — a plain scroll-position threshold, not tied to any section boundary. */
  appearAfterPx: number;
  /** Fixed header height (px) to offset the scroll-to landing position so a jumped-to section doesn't land underneath it — also used to position the rail itself, 60px below the header. */
  headerOffset?: number;
  /** Real navigation link back to the project index, rendered as a distinct first item above the scroll-target list (left-arrow icon, extra spacing below it). Omit to skip this item entirely. */
  backHref?: string;
  backLabel?: string;
}

function BackArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[14px] shrink-0"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default function SectionRail({
  sections,
  appearAfterPx,
  headerOffset = 0,
  backHref,
  backLabel = "Back to projects",
}: SectionRailProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Spans the entire scrollable page (start:0, end:"max") specifically
    // so `onUpdate` fires on every scroll tick everywhere, not just
    // within some narrower active zone — `visible` is then derived
    // directly from the live scroll position every time, rather than
    // relying on a boundary-crossing event that could be missed (see the
    // fix note above).
    triggers.push(
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setVisible(self.scroll() > appearAfterPx),
      })
    );
    // onUpdate only fires on scroll events, not on creation — set the
    // correct initial state immediately in case the page loads already
    // scrolled past the threshold (e.g. browser scroll restoration, a
    // same-page anchor link) rather than waiting for the next scroll.
    setVisible(window.scrollY > appearAfterPx);

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveId(section.id),
          onEnterBack: () => setActiveId(section.id),
        })
      );
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [sections, appearAfterPx]);

  useEffect(() => {
    if (!railRef.current) return;
    const items = railRef.current.querySelectorAll<HTMLElement>(".rail-item");
    // Cancel any in-flight tween on these elements first — if this effect
    // ever fires twice in quick succession (see the fix note above), the
    // new tween cleanly supersedes the old one instead of two competing
    // for the same elements' inline styles.
    gsap.killTweensOf(items);
    gsap.to(items, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : -12,
      duration: 0.3,
      ease: "power2.out",
      stagger: { each: 0.04, from: visible ? "start" : "end" },
    });
  }, [visible]);

  const handleClick = (id: string) => {
    gsap.to(window, {
      duration: 0.8,
      ease: "power2.inOut",
      scrollTo: { y: `#${id}`, offsetY: headerOffset },
    });
  };

  return (
    <div
      ref={railRef}
      className="hidden min-[1300px]:flex sticky shrink-0 z-40 flex-col h-fit"
      style={{
        top: headerOffset + 60,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {backHref && (
        <a
          href={backHref}
          className="rail-item opacity-0 flex items-center gap-8px mb-60px font-ui text-[14px] leading-[20px] font-normal text-text-muted hover:text-text-primary transition-colors"
        >
          <BackArrowIcon />
          {backLabel}
        </a>
      )}

      <div className="flex flex-col gap-8px">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            className={`rail-item opacity-0 text-left font-ui text-[14px] leading-[20px] transition-colors ${
              activeId === section.id
                ? "font-semibold text-text-primary"
                : "font-normal text-text-muted hover:text-text-primary"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}
