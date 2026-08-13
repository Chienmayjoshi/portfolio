// Not sourced from Figma — the /practice section has no Figma frames at
// all; it's authored in code (same provenance note convention as
// TempHeader.tsx). Content model + the static post list for the whole
// practice feed, following the repo convention of copy-in-TS next to
// components.
//
// Phase-1 content (2026-07-19, per direct instruction): exactly two
// vibe-coded build posts — Trace and Glyphflow — with every copy field a
// visible [PLACEHOLDER] string. No information about either project
// exists anywhere in this repo, and CLAUDE.md forbids inventing
// plausible-sounding copy, so nothing here pretends to be real: the
// placeholders exist to prove the layout, and Chinmay replaces them with
// real text. Art posts (images, captions, mediums) come later once the
// layout is proven — the ArtPost type is defined now so the feed,
// filter, and likes design don't need reshaping when they land.

/** Media union — art uses natural-dimension images (masonry needs real
 *  aspect ratios); builds use a 16:9 muted looping mp4 with a poster.
 *  `placeholder` renders shared/AssetPlaceholder until real media exists. */
export type PracticeMedia =
  | { kind: "image"; src: string; alt: string; width: number; height: number }
  | { kind: "video"; src: string; poster: string }
  | { kind: "placeholder"; label: string };

interface PracticePostBase {
  /** Stable anchor + likes DB key + public permalink fragment
   *  (/practice#<id>). NEVER rename after ship. */
  id: string;
  /** Display meta, e.g. "2026-07". Feed order is the array order
   *  (hand-curated), not a date sort. */
  date: string;
  media: PracticeMedia;
}

export interface ArtPost extends PracticePostBase {
  type: "art";
  /** One line. */
  caption: string;
  /** "Gouache", "Procreate", … */
  medium: string;
}

/** Hard-capped Lighter Format: `decision` is a single object, NOT an
 *  array — multi-decision growth (scope creep toward a 4th case study)
 *  is structurally impossible by design. Don't widen this type. */
export interface BuildDetail {
  /** One paragraph. */
  problem: string;
  decision: { decision: string; tradeoff: string; reason: string };
  /** 2–3 sentences. */
  outcome: string;
}

export interface BuildPost extends PracticePostBase {
  type: "build";
  /** /practice/[slug] */
  slug: string;
  /** Detail-page h1. */
  title: string;
  /** One-line card copy. */
  pitch: string;
  /** Tech chips. */
  stack: string[];
  /** Optional — no live URLs yet; the Visit ↗ link renders only when set. */
  visitUrl?: string;
  detail: BuildDetail;
}

export type PracticePost = ArtPost | BuildPost;

export const practicePosts: PracticePost[] = [
  {
    type: "build",
    id: "build-trace",
    slug: "trace",
    date: "[DATE]",
    title: "[PLACEHOLDER: what Trace is, as a headline]",
    pitch: "[PLACEHOLDER: one-line pitch for Trace]",
    stack: ["[STACK 1]", "[STACK 2]"],
    media: { kind: "placeholder", label: "[ Screen recording — Trace ]" },
    detail: {
      problem:
        "[PLACEHOLDER: the problem Trace exists to solve, one paragraph]",
      decision: {
        decision: "[PLACEHOLDER: the key decision made building Trace]",
        tradeoff: "[PLACEHOLDER: what that decision gave up]",
        reason: "[PLACEHOLDER: why the tradeoff was worth it]",
      },
      outcome: "[PLACEHOLDER: outcome, 2–3 sentences]",
    },
  },
  {
    type: "build",
    id: "build-glyphflow",
    slug: "glyphflow",
    date: "[DATE]",
    title: "[PLACEHOLDER: what Glyphflow is, as a headline]",
    pitch: "[PLACEHOLDER: one-line pitch for Glyphflow]",
    stack: ["[STACK 1]", "[STACK 2]"],
    media: { kind: "placeholder", label: "[ Screen recording — Glyphflow ]" },
    detail: {
      problem:
        "[PLACEHOLDER: the problem Glyphflow exists to solve, one paragraph]",
      decision: {
        decision: "[PLACEHOLDER: the key decision made building Glyphflow]",
        tradeoff: "[PLACEHOLDER: what that decision gave up]",
        reason: "[PLACEHOLDER: why the tradeoff was worth it]",
      },
      outcome: "[PLACEHOLDER: outcome, 2–3 sentences]",
    },
  },
];

export const buildPosts = practicePosts.filter(
  (p): p is BuildPost => p.type === "build"
);

export function getBuildPost(slug: string): BuildPost | undefined {
  return buildPosts.find((p) => p.slug === slug);
}

/** Likes allowlist for the (later-phase) likes API — only art posts have
 *  like buttons per spec, so build ids never become valid DB keys. */
export const artPostIds = practicePosts
  .filter((p) => p.type === "art")
  .map((p) => p.id);
