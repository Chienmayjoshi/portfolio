// Once-per-session flag for the splash. sessionStorage, so a new tab/window is
// a new session and plays it again; a reload within the tab does not.
// Same try/catch shape as caseStudyEnterArming (sessionStorage throws in some
// private modes).
export const SPLASH_STORAGE_KEY = "splash-seen";

export function hasSeenSplash(): boolean {
  try {
    return window.sessionStorage.getItem(SPLASH_STORAGE_KEY) === "1";
  } catch {
    // Can't read it -> don't risk replaying on every navigation.
    return true;
  }
}

export function markSplashSeen(): void {
  try {
    window.sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Runs before first paint (next/script "beforeInteractive" in layout.tsx).
 * The splash overlay is in the server HTML so first-time visitors never see the
 * page flash before it; this is the other half - for someone who has already
 * seen it, flag <html> so globals.css hides that overlay (and stops hiding the
 * nav) before anything is painted. Same read as hasSeenSplash(), same
 * "unreadable storage = treat as seen" fallback.
 */
export const SPLASH_SKIP_SCRIPT = `(function(){try{if(window.sessionStorage.getItem("${SPLASH_STORAGE_KEY}")==="1")document.documentElement.setAttribute("data-splash-skip","")}catch(e){document.documentElement.setAttribute("data-splash-skip","")}})();`;
