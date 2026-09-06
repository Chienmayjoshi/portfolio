// Arming for the case study entrance: how a page knows it was reached by
// clicking a card rather than by a refresh, a back-navigation, or a link
// someone pasted.
//
// sessionStorage, read on the destination — NOT a class stamped on <html> by a
// beforeInteractive script, which is the obvious solution and the wrong one
// here. That script only runs on a full document load, and `next/link` does a
// client-side navigation, so on a real card click it would never fire. Reading
// the flag on the destination works because App Router mounts the page
// component fresh on that navigation.
//
// Client-side navigation is also why there's no flash to defend against: React
// commits the new page and runs layout effects before the browser paints, so
// CaseStudyEnter's own useLayoutEffect hides the landing state in the same
// frame it appears. (A full document load with a flag set — a hard navigation,
// or a tab that inherited a copy of sessionStorage — would paint the page
// once before hiding it. ArmEnterLink declines to arm modifier-clicks partly
// for that reason.)
export const ENTER_STORAGE_KEY = "case-study-enter";

/**
 * Routes that actually render CaseStudyEnter. Arming anything else would leave
 * a flag nobody consumes; this keeps the opt-in explicit and greppable.
 * Adding the vertical /fastrouter here plus a <CaseStudyEnter> in its page is
 * all that route would need — nothing links to it from a card today.
 */
export const ENTER_ROUTES = ["/fastrouter-slides"];

/** Called from a card click, immediately before the navigation starts. */
export function armCaseStudyEnter(href: string) {
  if (!ENTER_ROUTES.includes(href)) return;
  try {
    sessionStorage.setItem(ENTER_STORAGE_KEY, href);
  } catch {
    // Private mode / storage disabled: no animation, page still works.
  }
}

/**
 * Whether this path is the armed destination. Pure read — safe to call from a
 * useState initializer, including React's double-invoked dev render. Clearing
 * is separate (see clearCaseStudyEnter) precisely so this stays pure.
 */
export function peekCaseStudyEnter(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(ENTER_STORAGE_KEY) === pathname;
  } catch {
    return false;
  }
}

/** Consume the flag, so the entrance is one-shot per card click. */
export function clearCaseStudyEnter() {
  try {
    sessionStorage.removeItem(ENTER_STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}
