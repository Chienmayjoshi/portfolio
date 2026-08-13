"use client";

import { useState } from "react";

// Not sourced from Figma — /practice has no Figma frames (see posts.ts).
// Share affordance for feed cards: navigator.share() where available
// (native sheet, effectively mobile), clipboard-copy fallback elsewhere —
// the exact logic already verified in shared/ShareButton.tsx, duplicated
// here rather than parameterized because that component's label/markup is
// case-study-specific ("Share this case Study →") and per-folder
// duplication of small presentational variants is the codebase's accepted
// convention (see extensions/DecisionList.tsx's own header comment).
//
// The permalink is built at click time from location.origin so it's
// correct on any deploy domain with zero SSR involvement — every post's
// card carries id={post.id}, so /practice#<id> deep-links to that card.
interface PracticeShareProps {
  postId: string;
  title: string;
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[16px] shrink-0"
      aria-hidden="true"
    >
      <path d="M4 12v7a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-7" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export default function PracticeShare({ postId, title }: PracticeShareProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/practice#${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
      } catch {
        // user cancelled the native share sheet — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className="flex items-center gap-8px text-text-muted hover:text-text-primary transition-colors"
    >
      {copied && (
        <span className="font-ui font-normal text-[12px] leading-[18px]">
          Link copied
        </span>
      )}
      <ShareIcon />
    </button>
  );
}
