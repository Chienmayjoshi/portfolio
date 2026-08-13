"use client";

import { useState } from "react";
import BuildCard from "@/components/practice/BuildCard";
import FilterChips, {
  type PracticeFilter,
} from "@/components/practice/FilterChips";
import SnapScope from "@/components/practice/SnapScope";
import { type PracticePost } from "@/components/practice/posts";

// Not sourced from Figma — /practice has no Figma frames (see posts.ts).
// Client orchestrator for the feed: filter state, the mobile snap scope,
// and the masonry container. Art cards and the lightbox mount here in a
// later phase once art content exists (see the approved plan) — the
// filter/masonry structure already accounts for them.
//
// Masonry is pure CSS columns (columns-1 sm:columns-2 lg:columns-3), no
// JS masonry lib, per spec. Known, accepted caveat: CSS columns fill
// top-to-bottom per column, so strict left-to-right chronological order
// is impossible. This feed is hand-curated browse content, not a
// timeline — practicePosts array order is curated for visual balance
// (alternate tall/short posts once art lands) rather than fought with a
// JS library. Cards carry break-inside-avoid so no card ever splits
// across a column boundary.
//
// The intro block (title + chips) is itself a snap-start stop: with
// mandatory snap on mobile, any region that isn't a snap point becomes
// an unreachable dead zone between stops — the top of the page must be
// one so the header area stays reachable. Same reasoning gives Footer
// its snap-end (see practice/page.tsx).
interface PracticeFeedProps {
  posts: PracticePost[];
}

export default function PracticeFeed({ posts }: PracticeFeedProps) {
  const [filter, setFilter] = useState<PracticeFilter>("all");

  const hasBothTypes =
    posts.some((p) => p.type === "art") && posts.some((p) => p.type === "build");

  const visible =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  return (
    <section className="w-full flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col gap-48px px-[var(--edge-padding)] md:px-40px">
        <SnapScope />

        <div className="snap-start flex flex-col gap-24px items-start">
          <div className="flex flex-col gap-12px">
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              practice
            </span>
            <h1 className="font-display font-bold text-text-primary text-[36px] leading-[42px] tracking-[-0.5px] md:text-[52px] md:leading-[58px] md:tracking-[-0.8px]">
              Practice
            </h1>
          </div>
          {hasBothTypes && <FilterChips value={filter} onChange={setFilter} />}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-24px">
          {visible.map((post) =>
            post.type === "build" ? (
              <BuildCard key={post.id} post={post} />
            ) : // ArtCard mounts here in a later phase, once art content
            // exists (likes + lightbox ship with it — see plan §2).
            null
          )}
        </div>
      </div>
    </section>
  );
}
