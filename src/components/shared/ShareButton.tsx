"use client";

import { useState } from "react";

// Figma's button just says "Share this case Study →" with no destination
// specified — no share target, no fabricated URL. Wired to the Web Share
// API where available (native share sheet), falling back to copying the
// current page URL to the clipboard, with a brief "Copied" confirmation.
// Small enough to not need Motion per CLAUDE.md's animation split — plain
// useState.
//
// Promoted from fastrouter/ to shared/ (2026-07-18): the button label and
// share behavior are identical across all three case studies' "Thanks for
// reading" sections, no FastRouter-specific content.
//
// `iconOnly` (added for CaseStudyFeedback.tsx): the feedback feature spec
// demotes this to an icon-only affordance in the collapsed CTA row. Same
// `handleShare` logic either way — only the presentation changes — so
// this stays one component with two renders rather than a third duplicate
// file. The icon + "Copied" treatment is the same pattern already proven
// once in practice/PracticeShare.tsx (built earlier this session), not a
// fresh design.
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

interface ShareButtonProps {
  className?: string;
  iconOnly?: boolean;
}

export default function ShareButton({ className, iconOnly }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url, title: document.title });
      } catch {
        // user cancelled the native share sheet — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this case study"
        className={className}
      >
        {copied ? (
          <span className="font-ui font-normal text-[12px] leading-[18px]">
            Copied
          </span>
        ) : (
          <ShareIcon />
        )}
      </button>
    );
  }

  return (
    <button type="button" onClick={handleShare} className={className}>
      {copied ? "Link copied" : "Share this case Study →"}
    </button>
  );
}
