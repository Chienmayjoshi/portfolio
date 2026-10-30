// Which accent a route takes. FastRouter is the default (blue) and has no entry.
// The colours themselves live in globals.css (html[data-accent="..."]); this
// only maps a pathname to the attribute value.
const ACCENT_BY_PREFIX: readonly (readonly [string, string])[] = [
  ["/ultraai", "ultraai"],
  ["/analytics", "analytics"],
  ["/extensions", "extensions"],
];

export function accentForPath(pathname: string): string | null {
  for (const [prefix, accent] of ACCENT_BY_PREFIX) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return accent;
  }
  return null;
}

// Runs before first paint so there is no flash of FastRouter's blue on the other
// studies. Static string, no user input; keep the table in step with the one
// above.
export const ACCENT_INIT_SCRIPT = `
(function () {
  try {
    var p = location.pathname, a = null;
    if (p === "/ultraai" || p.indexOf("/ultraai/") === 0) a = "ultraai";
    else if (p === "/analytics" || p.indexOf("/analytics/") === 0) a = "analytics";
    else if (p === "/extensions" || p.indexOf("/extensions/") === 0) a = "extensions";
    if (a) document.documentElement.setAttribute("data-accent", a);
  } catch (e) {}
})();
`;
