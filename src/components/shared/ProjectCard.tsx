import Link from "next/link";

// Shared card used by every case study's ReadNext.tsx (teaser row) and the
// temporary project-index page (src/app/page.tsx, grid). Extracted from the
// three near-identical card blocks in fastrouter/analytics/extensions
// ReadNext.tsx — same markup, just parameterized on content + href, per
// CLAUDE.md's "build once, prove on one, then reuse" convention already
// applied to ScreenshotFrame/SectionRail.
export interface ProjectCardData {
  category: string;
  year: string;
  title: string;
  description: string;
  href: string;
}

export default function ProjectCard({
  category,
  year,
  title,
  description,
  href,
}: ProjectCardData) {
  return (
    <Link
      href={href}
      className="flex-1 bg-bg-surface border border-bg-light rounded-xl p-32px flex flex-col gap-12px transition-colors hover:border-border-default"
    >
      <div className="flex gap-12px items-center">
        <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
          {category}
        </span>
        <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
          ·
        </span>
        <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
          {year}
        </span>
      </div>
      <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[26px]">
        {title}
      </h3>
      <p className="font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px]">
        {description}
      </p>
    </Link>
  );
}
