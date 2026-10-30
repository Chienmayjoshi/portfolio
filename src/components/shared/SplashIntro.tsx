"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { fitLogoToVideo } from "@/components/shared/splashFit";
import { hasSeenSplash } from "@/components/shared/splashSession";
import {
  SPLASH_LOGO_D,
  SPLASH_LOGO_H,
  SPLASH_LOGO_W,
} from "@/components/shared/splashLogoPath";

// Splash: the name is written in (video), holds, then zooms until its letters
// open onto whatever is behind. Reference: Figma "intro page animation
// reference" (file 2aoIFdaJMyNBEWeQESBEzG, node 8146:47657), eight 1440x1024
// stills. Every number below is read off those stills, in "design px" (the
// 1440x1024 frame), then multiplied by `unit` to fit the real viewport.
//
//   frames 1-2  #000 overlay, white vector under the video, video removed,
//               vector 504 -> 470 wide
//   frames 3-7  overlay #1A1A1A with the vector knocked OUT, widths
//               839 / 1407 / 3356 / 10074 / 11950
//   frame 8     overlay gone
//
// Not mounted anywhere yet - /lab/splash is the only caller.
//
// GSAP, not Motion: one choreographed timeline that drives SVG transforms every
// frame (CLAUDE.md's carve-out, same as CaseStudyEnter). The logo is a vector
// inside an SVG <mask>, so it is re-rasterised crisp at ~25x instead of
// bitmap-scaled.

/** Overlay colours. Frames 1-2 are pure black to match the video's own black;
 *  frames 3+ are the dark `bg-primary` token (#1A1A1A in design-tokens.json). */
const BLACK = "#000000";
const DARK = "#1A1A1A";

// Design-frame geometry (px in the 1440x1024 frame).
const FRAME_H = 1024;
const VIDEO_W = 911; // frame 1, "Introfinal 1" layer
const VIDEO_ASPECT = 1080 / 1088; // intrinsic 1088x1080
const START_W = 504; // vector at frame 1 (== the video's final ink)
// The zoom aims at one fixed point of the lettering and runs until the whole
// viewport sits inside that stroke, so the logo has fully left the screen and
// the page is all that's visible (Figma's frame 7 stops short and leaves
// slivers). Found offline: distance transform of gl-logo-white.svg - the
// thickest ink within ~60 units of the box centre. x/y in the 504x300 logo box;
// r = inscribed-circle radius, trimmed 5% for the 3-4 chamfer's error.
const PIVOT = { x: 248.5, y: 130, r: 13.3 };

export interface SplashConfig {
  /** Playback rate of the write-on video (1 = as authored, 5.3s). */
  videoSpeed: number;
  /** Beat on the settled logo before the zoom starts. */
  hold: number;
  /** Seconds for the zoom, settled logo -> viewport fully inside one stroke. */
  zoom: number;
  /** Ease on the log-scale progress of the zoom. */
  zoomEase: string;
  /** Seconds the video fades out over the flat vector underneath it. */
  swapFade: number;
  /** Seconds for the white letters to turn into the scene at zoom start. */
  letterFade: number;
  /** Safety fade for the overlay once the zoom has cleared the viewport. */
  clearFade: number;
  /** Seconds to wait for the video before skipping to the settle. */
  videoTimeout: number;
  /** Jump straight to the settled logo (tuning the zoom without the 5s wait). */
  skipVideo: boolean;
  /** Global playback speed, for looking at the middle of the zoom. */
  timeScale: number;
}

export const SPLASH_DEFAULTS: SplashConfig = {
  videoSpeed: 1.5,
  hold: 0.15,
  zoom: 1.6,
  zoomEase: "power3.in",
  swapFade: 0.25,
  letterFade: 0.9,
  clearFade: 0.25,
  videoTimeout: 9,
  skipVideo: false,
  timeScale: 1,
};

interface SplashIntroProps {
  config?: Partial<SplashConfig>;
  /** Skip if this session has already seen it (real site). The lab leaves this
   *  off so Replay always plays. The caller marks it seen in onFinish. */
  oncePerSession?: boolean;
  /** Fires once the overlay has fully cleared (or was skipped). */
  onFinish?: () => void;
}

export default function SplashIntro({
  config,
  oncePerSession,
  onFinish,
}: SplashIntroProps) {
  const cfg = { ...SPLASH_DEFAULTS, ...config };
  const maskId = useId();
  const logoId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const darkRef = useRef<SVGRectElement>(null);
  const whiteRef = useRef<SVGUseElement>(null);
  const holeRef = useRef<SVGUseElement>(null);
  // Config and callback are read once per mount (replay = remount via key),
  // not reactively: a value changed mid-flight would otherwise rebuild the
  // timeline.
  const onFinishRef = useRef(onFinish);
  const cfgRef = useRef(cfg);
  const onceRef = useRef(oncePerSession);

  // The header (nav + theme switch) is page chrome: hidden while the splash
  // plays, revealed as it clears. Done with a <style> rendered by this
  // component rather than an attribute set in an effect, because it has to be
  // in the server HTML: an effect only runs after hydration, so the nav sat
  // visible over the splash until then. Removing the tag triggers the
  // opacity transition on `body > header` (globals.css).
  const [hideChrome, setHideChrome] = useState(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const dark = darkRef.current;
    const white = whiteRef.current;
    const hole = holeRef.current;
    if (!root || !video || !dark || !white || !hole) return;
    const c = cfgRef.current;

    // Already seen this session: the pre-paint script has flagged <html> so the
    // overlay was never painted; just make sure it stays out of the way.
    if (onceRef.current && hasSeenSplash()) {
      root.style.display = "none";
      onFinishRef.current?.();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.display = "none";
      onFinishRef.current?.();
      return;
    }

    // One design px in real px: fit the 504-wide name inside the viewport on
    // phones, and never exceed the frame's own proportions on desktop.
    const unit = () =>
      Math.min(
        (window.innerWidth * 0.86) / START_W,
        window.innerHeight / FRAME_H,
      );

    // The animated state. `w` is the logo's width in design px, `dx/dy` its
    // centre's offset from the frame centre, in design px.
    const state = { w: START_W, dx: 0, dy: 0 };

    const render = () => {
      const u = unit();
      const s = (state.w / SPLASH_LOGO_W) * u;
      const cx = window.innerWidth / 2 + state.dx * u;
      const cy = window.innerHeight / 2 + state.dy * u;
      const t = `translate(${cx} ${cy}) scale(${s}) translate(${-SPLASH_LOGO_W / 2} ${-SPLASH_LOGO_H / 2})`;
      white.setAttribute("transform", t);
      hole.setAttribute("transform", t);
    };

    const sizeVideo = () => {
      const w = VIDEO_W * unit();
      video.style.width = `${w}px`;
      video.style.height = `${w * VIDEO_ASPECT}px`;
    };
    sizeVideo();
    render();
    const onResize = () => {
      sizeVideo();
      render();
    };
    window.addEventListener("resize", onResize);

    // Scroll lock for the duration; restored in cleanup. Same inline-style
    // approach CaseStudyEnter / FeedbackOverlay use, no library.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const revealChrome = () => setHideChrome(false);

    let started = false;
    let tl: gsap.core.Timeline | null = null;

    const run = () => {
      if (started) return;
      started = true;

      // Arm the layers that were held inert until now: the hole in the overlay
      // (white = no hole, so the scene can't show through the logo while the
      // video plays) and the flat white logo under the video.
      hole.setAttribute("fill", "#000");
      gsap.set(white, { opacity: 1 });

      // Snap the flat vector onto the video's final frame so the hand-off is
      // between two images that coincide, not two that merely resemble each
      // other. Falls back to the Figma numbers if the frame can't be read.
      const fit = c.skipVideo
        ? null
        : fitLogoToVideo(video, SPLASH_LOGO_D, SPLASH_LOGO_W, SPLASH_LOGO_H);
      if (fit) {
        const u = unit();
        state.w = fit.width / u;
        state.dx = fit.dx / u;
        state.dy = fit.dy / u;
        render();
      }

      // Everything below is relative to the logo as it actually sits, so the
      // 504 -> 470 -> 11950 ratios hold whatever the measured size was.
      // No pull-back: Figma's frame 2 shrinks the name 504 -> 470 before the push,
      // but on screen that read as the logo twitching after the video ended.
      // It holds at exactly the video's size until the zoom starts.
      const settledW = state.w;

      // Where the pivot sits on screen once settled; it stays there while the
      // lettering grows out from it. The end scale is the one at which the
      // pivot's stroke (radius PIVOT.r) reaches the farthest viewport corner.
      const u0 = unit();
      const s0 = (settledW / SPLASH_LOGO_W) * u0;
      const qx = window.innerWidth / 2 + state.dx * u0 + s0 * (PIVOT.x - SPLASH_LOGO_W / 2);
      const qy = window.innerHeight / 2 + state.dy * u0 + s0 * (PIVOT.y - SPLASH_LOGO_H / 2);
      const reach = Math.max(
        Math.hypot(qx, qy),
        Math.hypot(window.innerWidth - qx, qy),
        Math.hypot(qx, window.innerHeight - qy),
        Math.hypot(window.innerWidth - qx, window.innerHeight - qy),
      );
      const sEnd = (reach / PIVOT.r) * 1.04;
      const endW = (sEnd / u0) * SPLASH_LOGO_W;

      // Zoom is driven on ln(width): equal steps in ln are equal-feeling
      // dolly steps, where a linear width tween would crawl then slam.
      const zoom = { p: 0 };
      const lnA = Math.log(settledW);
      const lnB = Math.log(endW);

      tl = gsap.timeline({
        onComplete: () => {
          root.style.display = "none";
          document.body.style.overflow = prevOverflow;
          revealChrome();
          onFinishRef.current?.();
        },
      });
      tl.timeScale(c.timeScale);

      // Video -> vector: crossfade, never a hard cut.
      if (c.skipVideo) {
        video.style.visibility = "hidden";
      } else {
        tl.to(video, {
          opacity: 0,
          duration: c.swapFade,
          ease: "none",
          onComplete: () => {
            video.style.visibility = "hidden";
          },
        });
      }

      // The zoom. The white letters dissolve into the scene slowly while the
      // push is still gentle, instead of snapping to a clipped view at once.
      const zoomAt = (c.skipVideo ? 0 : c.swapFade) + c.hold;
      tl.to(dark, { attr: { fill: DARK }, duration: c.letterFade, ease: "sine.inOut" }, zoomAt);
      tl.to(white, { opacity: 0, duration: c.letterFade, ease: "sine.inOut" }, zoomAt);
      tl.to(
        zoom,
        {
          p: 1,
          duration: c.zoom,
          ease: c.zoomEase,
          onUpdate: () => {
            state.w = Math.exp(lnA + (lnB - lnA) * zoom.p);
            // Hold the pivot still on screen: centre = Q + s * (C - P).
            const u = unit();
            const s = (state.w / SPLASH_LOGO_W) * u;
            state.dx = (qx - window.innerWidth / 2 + s * (SPLASH_LOGO_W / 2 - PIVOT.x)) / u;
            state.dy = (qy - window.innerHeight / 2 + s * (SPLASH_LOGO_H / 2 - PIVOT.y)) / u;
            render();
          },
        },
        zoomAt,
      );

      // Viewport is inside the stroke now; the fade is only a safety net, and
      // the page chrome comes in here.
      tl.call(revealChrome, undefined, zoomAt + c.zoom);
      tl.to(root, { opacity: 0, duration: c.clearFade, ease: "power1.out" }, zoomAt + c.zoom);
    };

    let timeout: number | undefined;
    if (c.skipVideo) {
      run();
    } else {
      video.addEventListener("ended", run);
      // Never let a slow/blocked video hold the page hostage.
      video.addEventListener("error", run);
      timeout = window.setTimeout(run, c.videoTimeout * 1000);
      // Reveal only once frames are really advancing. Per-frame callback where
      // supported (timeupdate only fires ~4x/s, which would clip the first
      // strokes), timeupdate otherwise.
      const FIRST_MOVING_FRAME = 0.03; // s of media time
      const reveal = () => {
        video.style.opacity = "1";
      };
      if (typeof video.requestVideoFrameCallback === "function") {
        const onFrame: VideoFrameRequestCallback = (_now, meta) => {
          if (meta.mediaTime > FIRST_MOVING_FRAME) reveal();
          else video.requestVideoFrameCallback(onFrame);
        };
        video.requestVideoFrameCallback(onFrame);
      } else {
        const onTime = () => {
          if (video.currentTime > FIRST_MOVING_FRAME) {
            reveal();
            video.removeEventListener("timeupdate", onTime);
          }
        };
        video.addEventListener("timeupdate", onTime);
      }
      video.playbackRate = c.videoSpeed;
      void video.play().catch(run);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      video.removeEventListener("ended", run);
      video.removeEventListener("error", run);
      if (timeout !== undefined) window.clearTimeout(timeout);
      tl?.kill();
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <>
      {hideChrome && (
        <style>{`@media (prefers-reduced-motion: no-preference){html:not([data-splash-skip]) body > header{opacity:0;pointer-events:none}}`}</style>
      )}
    <div
      ref={rootRef}
      data-splash-root=""
      className="fixed inset-0 z-[60]"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <path id={logoId} d={SPLASH_LOGO_D} />
          {/* White everywhere, black logo = a hole in whatever is painted
              with this mask. Region is huge so a 25x logo is never clipped. */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="-50000"
            y="-50000"
            width="100000"
            height="100000"
          >
            <rect x="-50000" y="-50000" width="100000" height="100000" fill="#fff" />
            {/* Inert until run(): white fill = no hole; scale(0) so the
                server-rendered markup draws nothing at the SVG origin. */}
            <use ref={holeRef} href={`#${logoId}`} fill="#fff" transform="scale(0)" />
          </mask>
        </defs>
        <rect
          ref={darkRef}
          x="-50000"
          y="-50000"
          width="100000"
          height="100000"
          fill={BLACK}
          mask={`url(#${maskId})`}
        />
        {/* Flat white copy of the same vector, over the overlay: this is what
            sits under the video in frame 1 and is what remains when it goes. */}
        <use
          ref={whiteRef}
          href={`#${logoId}`}
          fill="#fff"
          opacity={0}
          transform="scale(0)"
        />
      </svg>
      <video
        ref={videoRef}
        src="/images/global/gl-splash-write.mp4"
        muted
        playsInline
        preload="auto"
        // Invisible until playback has moved past frame 0 (see the effect): a
        // paused video paints its first frame as soon as it loads, which is a
        // static still of the logo for as long as the file takes to start.
        style={{ opacity: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
      />
    </div>
    </>
  );
}
