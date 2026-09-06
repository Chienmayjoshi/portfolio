// The case study headline's line layout, defined per breakpoint rather than
// left to whatever the column width happens to produce.
//
// Why it has to be defined, and why one set can't serve every width: the
// entrance animation builds the title on these exact lines and then flies its
// words onto the real <h1>, so overlay and destination have to agree at every
// width or words land on the wrong rows. Measured against the real Season Mix
// face, the desktop arrangement's widest line is 366px at the deck's mobile
// 32px — wider than the 350px a 390px phone actually offers. So it cannot be
// one set; it's two, split on the project's existing `md` breakpoint.
//
// `base` is what the deck already rendered by accident before this was pinned
// down, so making it explicit changes nothing visually — it just stops being
// incidental. Its widest line is 316px, which clears a 360px device and above.
// Narrower than that it wraps further rather than overflowing; word ORDER is
// identical in both sets, which is the only thing the animation's index
// pairing depends on, so it degrades rather than breaking.
//
// Consumers MUST keep their markup in step with these arrays:
//   - CaseStudyEnter renders both sets and animates whichever is visible
//   - HeroSlide expresses the same breaks as toggled <br> elements
export interface EnterTitleLines {
  /** Below `md`. */
  base: string[];
  /** `md` and up. */
  md: string[];
}

// Source of truth for `md`: Figma node 7438:44091 ("case study enter
// animation"), frames 1-3.
export const FASTROUTER_ENTER_LINES: EnterTitleLines = {
  base: ["Enterprise AI teams", "were flying blind on", "every model decision."],
  md: ["Enterprise AI teams were", "flying blind on every", "model decision."],
};
