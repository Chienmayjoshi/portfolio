import Link from "next/link";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";
import PracticeShare from "@/components/practice/PracticeShare";
import { type BuildPost } from "@/components/practice/posts";

// Not sourced from Figma — /practice has no Figma frames (see posts.ts).
// Feed card for a vibe-coded build post. Card shell follows the
// ProjectCard/FiveMoreExtensions precedent (bg-surface, bg-light border,
// rounded-xl); 16:9 media + pitch are one internal <Link> to the
// /practice/[slug] detail page, while Visit ↗ (when a live URL exists)
// and the share icon sit in a separate footer row — never nested inside
// the Link, since nested anchors are invalid HTML and the two go to
// different places.
//
// No like button by design (spec): likes are an art-post-only feature.
//
// Masonry/snap classes on the <article>:
// - break-inside-avoid + mb-24px: CSS-columns masonry (see PracticeFeed).
// - scroll-mt-[80px]: /practice#<id> deep links land below the sticky
//   TempHeader (64px, the HEADER_OFFSET constant established in
//   fastrouter/page.tsx) with breathing room.
// - snap-start/snap-always + the max-sm min-height: one card ≈ one
//   viewport on mobile with mandatory snap (per direct decision) —
//   100dvh minus the 64px header. Media is capped at 60dvh on mobile so
//   a card can never grow taller than the viewport and trap its own
//   footer row between snap stops.
interface BuildCardProps {
  post: BuildPost;
}

export default function BuildCard({ post }: BuildCardProps) {
  return (
    <article
      id={post.id}
      className="break-inside-avoid mb-24px scroll-mt-[80px] snap-start snap-always max-sm:min-h-[calc(100dvh-64px)] flex flex-col max-sm:justify-center bg-bg-surface border border-bg-light rounded-xl overflow-hidden"
    >
      <Link href={`/practice/${post.slug}`} className="flex flex-col">
        <div className="w-full aspect-video max-sm:max-h-[60dvh]">
          {post.media.kind === "video" ? (
            <video
              src={post.media.src}
              poster={post.media.poster}
              autoPlay
              muted
              loop
              playsInline
              className="size-full object-cover"
            />
          ) : (
            <AssetPlaceholder
              label={
                post.media.kind === "placeholder"
                  ? post.media.label
                  : post.media.alt
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-12px p-32px pb-16px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              build
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              {post.date}
            </span>
          </div>
          <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[26px]">
            {post.pitch}
          </h3>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-16px px-32px pb-32px pt-8px">
        <div className="flex flex-wrap gap-8px items-center">
          {post.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-bg-light px-12px py-4px font-ui font-normal text-text-muted text-[13px] leading-[20px]"
            >
              {tech}
            </span>
          ))}
          {post.visitUrl && (
            <a
              href={post.visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui font-medium text-text-accent text-[13px] leading-[20px] hover:underline"
            >
              Visit ↗
            </a>
          )}
        </div>
        <PracticeShare postId={post.id} title={post.pitch} />
      </div>
    </article>
  );
}
