import Link from "next/link";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";
import ScreenshotFrame from "@/components/shared/ScreenshotFrame";
import LighterDecision from "@/components/practice/LighterDecision";
import { type BuildPost } from "@/components/practice/posts";

// Not sourced from Figma — /practice has no Figma frames (see posts.ts).
// The "Lighter Format" detail template for vibe-coded build posts:
// Problem (one paragraph) → Key Decision (single decision/tradeoff/why —
// see LighterDecision.tsx for the structural cap) → Outcome (2–3
// sentences) → Visit ↗. Visual language borrowed from the extensions
// feature sections (FeaturePhotoEditor.tsx): same eyebrow row, display
// headline with bottom border, inline-bold "Problem:" paragraph, and
// uppercase section labels — so the page reads as part of the same
// system without being a case study.
//
// The Visit ↗ link renders only when the post has a live URL (none do
// yet — per direct decision the field stays unset until launch).
interface BuildDetailProps {
  post: BuildPost;
}

export default function BuildDetail({ post }: BuildDetailProps) {
  return (
    <section className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        <Link
          href="/practice"
          className="self-start mb-48px font-ui font-normal text-text-muted text-[14px] leading-[20px] hover:text-text-primary transition-colors"
        >
          ← Practice
        </Link>

        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              practice
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              build
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              {post.date}
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h1 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              {post.title}
            </h1>
          </div>

          <ScreenshotFrame aspectRatio="16/9">
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
          </ScreenshotFrame>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              {post.detail.problem}
            </span>
          </p>
        </div>

        <div className="w-full flex flex-col pt-64px">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            KEY DECISION
          </span>
          <LighterDecision {...post.detail.decision} />
        </div>

        <div className="w-full flex flex-col gap-20px pt-64px">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            OUTCOME
          </span>
          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            {post.detail.outcome}
          </p>
        </div>

        {post.visitUrl && (
          <a
            href={post.visitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start mt-48px font-ui font-medium text-text-accent text-[16px] leading-[28px] tracking-[0.08px] hover:underline"
          >
            Visit {new URL(post.visitUrl).hostname} ↗
          </a>
        )}
      </div>
    </section>
  );
}
