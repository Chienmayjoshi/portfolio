"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTheme } from "@/components/shared/ThemeProvider";

// One-off choreography for decision 02's gesture-seam recording
// (FeatureMaps.tsx) — not promoted to shared/, per CLAUDE.md's
// prove-on-one-before-reusing build order. The recording is portrait
// (816x1286 native) inside a landscape capsule; a plain object-cover crop
// only ever shows the top ~40% of it, so the chevron-tap interaction this
// decision is about (near the very bottom of the frame) never appears.
// Instead of object-fit, the video renders at its natural aspect ratio
// (w-full h-auto, taller than the container) and is panned/zoomed via a
// GSAP transform, clipped by DecisionAssetFrame's existing overflow-hidden
// ancestor chain. At translateY(0) scale(1) this reproduces exactly the
// previous object-cover object-left-top look, so "rest" needs no special
// casing.
//
// Choreography is keyed off currentTime/duration (a 0-1 fraction), not
// absolute seconds — the light (29.18s) and dark (21.32s) recordings are
// different lengths but proportionally identical (tap ~34-41%, settled
// ~41-86%, reverse ~86-91% in both), confirmed by sampling matching
// fractional timestamps in both files.
//
// Panning uses the "zoom to a point" technique: transform-origin is set to
// the exact focal point (e.g. the chevron), so scaling around it doesn't
// move it on screen — translateY alone then places that point wherever it
// should land. Three crop positions, not two: a literal rest<->reveal
// round trip never brings the "Maps Assist" heading into frame (it sits
// ~60-85% down the frame, neither in the rest crop [top ~0-40%] nor a
// bottom-anchored reveal crop [~60-100%, needed for the chevron at ~96%]),
// so a third "settle" position proves the page actually changed.
interface Phase {
  name: string;
  focalYFraction: number;
  targetScreenYFraction: number;
  scale: number;
  enterAt: number;
  duration: number;
  ease: string;
}

// enterAt fractions were re-measured after an initial implementation pass
// assumed the "settle" hold ran to ~87% — actual sampling (both light and
// dark files, frame-by-frame) showed the recording reverses back to the
// map view around ~60-62%, not ~87%. Confirmed proportionally in both
// files: light reverses ~18.2s/29.18s ≈ 0.62, dark ~13s/21.32s ≈ 0.61.
//
// reveal's enterAt moved from 0.36 to 0.26 (2026-08-04, per direct
// feedback) — the actual tap highlight doesn't show until ~0.39-0.41 in
// light, so triggering the pan at 0.36 meant the camera was still
// mid-tween when the click happened. 0.26 read correctly in light but
// still felt rushed in dark — dark's tap highlight actually fires ~0.37-
// 0.38 (confirmed by sampling the raw file), noticeably earlier in
// fractional terms than light's ~0.41, so the same enterAt left dark with
// under 2s of settled hold time before the tap versus light's ~4s. The
// cursor in both recordings is continuously active (panning/exploring)
// well before it heads for the chevron, not idle until a final approach —
// so the fix isn't "arrive before the cursor moves," it's "arrive with
// enough hold time before the tap regardless." Moved to 0.20
// (2026-08-04) to give dark a real ~3s hold; light gets a longer ~5.5s
// hold as a side effect, which reads fine (established early, payoff
// later) rather than premature.
const PHASES: Phase[] = [
  { name: "rest", focalYFraction: 0, targetScreenYFraction: 0, scale: 1.0, enterAt: 0, duration: 0, ease: "none" },
  { name: "reveal", focalYFraction: 0.96, targetScreenYFraction: 0.8, scale: 1.1, enterAt: 0.20, duration: 0.5, ease: "power2.out" },
  { name: "settle", focalYFraction: 0.72, targetScreenYFraction: 0.5, scale: 1.0, enterAt: 0.43, duration: 0.6, ease: "power2.inOut" },
  { name: "rest", focalYFraction: 0, targetScreenYFraction: 0, scale: 1.0, enterAt: 0.62, duration: 0.4, ease: "power2.inOut" },
];

const NATURAL_W_FALLBACK = 816;
const NATURAL_H_FALLBACK = 1286;

function computeTransform(phase: Phase, containerRect: DOMRect, naturalW: number, naturalH: number) {
  const renderedHeightAtRest = containerRect.width * (naturalH / naturalW);
  const focalPx = phase.focalYFraction * renderedHeightAtRest;
  const originYPercent = phase.focalYFraction * 100;
  const targetScreenY = phase.targetScreenYFraction * containerRect.height;
  const translateY = targetScreenY - focalPx;
  return { originYPercent, translateY, scale: phase.scale };
}

interface GestureSeamVideoProps {
  lightSrc: string;
  darkSrc: string;
  "aria-label"?: string;
}

export default function GestureSeamVideo({
  lightSrc,
  darkSrc,
  "aria-label": ariaLabel,
}: GestureSeamVideoProps) {
  const { isDark } = useTheme();
  const src = isDark ? darkSrc : lightSrc;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let currentPhaseIdx = 0;
    let lastFrac = 0;

    const applyPhase = (idx: number, animate: boolean) => {
      const rect = container.getBoundingClientRect();
      const naturalW = video.videoWidth || NATURAL_W_FALLBACK;
      const naturalH = video.videoHeight || NATURAL_H_FALLBACK;
      const { originYPercent, translateY, scale } = computeTransform(
        PHASES[idx],
        rect,
        naturalW,
        naturalH
      );
      gsap.killTweensOf(video);
      if (animate) {
        gsap.to(video, {
          transformOrigin: `50% ${originYPercent}%`,
          y: translateY,
          scale,
          duration: PHASES[idx].duration,
          ease: PHASES[idx].ease,
        });
      } else {
        gsap.set(video, {
          transformOrigin: `50% ${originYPercent}%`,
          y: translateY,
          scale,
        });
      }
    };

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const frac = video.currentTime / video.duration;

      // Native `loop` snaps currentTime back near 0 — detect the
      // backward jump and hard-reset (no easing) rather than tweening
      // back across the whole timeline.
      if (frac < lastFrac - 0.05) {
        currentPhaseIdx = 0;
        applyPhase(0, false);
        lastFrac = frac;
        return;
      }
      lastFrac = frac;

      let targetIdx = 0;
      for (let i = 0; i < PHASES.length; i++) {
        if (frac >= PHASES[i].enterAt) targetIdx = i;
      }
      if (targetIdx !== currentPhaseIdx) {
        currentPhaseIdx = targetIdx;
        applyPhase(targetIdx, true);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    applyPhase(0, false);

    const ro = new ResizeObserver(() => applyPhase(currentPhaseIdx, false));
    ro.observe(container);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      ro.disconnect();
      gsap.killTweensOf(video);
    };
  }, [src]);

  return (
    <div ref={containerRef} className="relative size-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute left-0 top-0 w-full h-auto will-change-transform"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={ariaLabel}
        suppressHydrationWarning
      />
    </div>
  );
}
