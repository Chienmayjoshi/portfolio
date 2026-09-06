"use client";

import Link from "next/link";
import { armCaseStudyEnter } from "@/components/shared/caseStudyEnterArming";

// next/link that tells the destination it was reached by a card click, so the
// case study can play its entrance. Everything else about it is a plain Link.
interface ArmEnterLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function ArmEnterLink({
  href,
  className,
  children,
}: ArmEnterLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        // Don't arm a click that isn't going to navigate THIS tab. A
        // cmd/ctrl-click opens a new tab, which inherits a copy of
        // sessionStorage — so the new tab would play the entrance (fine) and
        // this one would be left holding a flag that fires on some later,
        // unrelated navigation (not fine). Shift/alt open a window or download.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }
        armCaseStudyEnter(href);
      }}
    >
      {children}
    </Link>
  );
}
