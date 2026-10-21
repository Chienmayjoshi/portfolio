"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// "The product" slide for the UltraAI deck — Figma node 7610:93241 ("product"),
// file 2aoIFdaJMyNBEWeQESBEzG. Rail tick: "product". No mobile frame was drawn.
//
// Header (copy verbatim from Figma): accent eyebrow, headline (deck slide-title
// token), muted paragraph, in the same 904px column the Problem slide uses.
//
// THE CAROUSEL: Figma draws a 480px row of five product shots — 376x480,
// 400x400, 345x480, 400x400, 376x480 (the five dummy mockups, in order, at their
// natural ratios) — 48px apart, starting at the 80px gutter and bleeding off the
// right edge. Built as a continuous marquee: two identical sets in a track that
// travels exactly one set, forever, then wraps.
//
// WHY JS AND NOT A CSS KEYFRAME: the hover has to stop it smoothly. A paused
// keyframe halts dead; here the speed is eased toward its target (0 while held,
// 1 otherwise) with a time-constant ease, so it glides to rest and glides back
// up. Position is written straight to the track's transform each frame (no
// React state per tick). Ambient, not state- or scroll-driven, so it is plain
// rAF — no Motion/GSAP on this element.
//
// RUNS ONLY WHILE VISIBLE: on the pointer deck every slide stays mounted, so
// `active` gates it; on the touch stack `active` is never passed, so an
// IntersectionObserver gates it. Reduced motion: no travel, the row is a
// native horizontal scroller instead.
//
// HOLD: mouse hover over the row holds it (Figma has no state for this; per
// direct instruction). Touch has no hover, so pressing and holding the row
// holds it and releasing lets it go.
//
// MOBILE (smart, no frame): same header, then a 380px-tall row (480 on md+),
// gutters 20px, gap 24px (48 on md+). Every item is sized off the row height,
// so the ratios hold at both sizes; the squares are 400/480 of it, as in Figma.
//
// Assets: ua_product_dummay1-5.png are placeholders (the filename keeps the
// supplied spelling). Figma's row cuts: the first and last are 376x480 crops,
// the squares are laptop/phone mockups. Swap the files, keep the ratios.
const PX_PER_SECOND = 36;
// Time constant of the speed ease, seconds. ~0.4s to reach 95% of the way.
const EASE_SECONDS = 0.4;

interface Shot {
  src: string;
  w: number;
  h: number;
  alt: string;
}

const SHOTS: readonly Shot[] = [
  { src: "/images/ultraai/ua_product_dummay1.png", w: 1128, h: 1440, alt: "UltraAI home screen on a phone, resting on a concrete block" },
  { src: "/images/ultraai/ua_product_dummay2.png", w: 1200, h: 1200, alt: "UltraAI on a laptop, on an orange armchair" },
  { src: "/images/ultraai/ua_product_dummay3.png", w: 1035, h: 1440, alt: "UltraAI's three-card spread on a phone, against dark rock" },
  { src: "/images/ultraai/ua_product_dummay4.png", w: 1200, h: 1200, alt: "UltraAI product shot" },
  { src: "/images/ultraai/ua_product_dummay5.png", w: 1128, h: 1440, alt: "UltraAI product shot" },
];

// Portrait shots fill the row; squares are 400 of the row's 480.
const SQUARE_SCALE = 400 / 480;

function ShotSet({ hidden, firstRef }: { hidden?: boolean; firstRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className="flex h-full shrink-0 items-center gap-24px pr-24px md:gap-[48px] md:pr-[48px]"
      aria-hidden={hidden || undefined}
    >
      {SHOTS.map((s, i) => {
        const square = s.w === s.h;
        return (
          <div
            key={s.src}
            ref={i === 0 ? firstRef : undefined}
            className="relative shrink-0 overflow-hidden rounded-[24px] bg-bg-light"
            style={{
              height: square ? `${SQUARE_SCALE * 100}%` : "100%",
              aspectRatio: `${s.w} / ${s.h}`,
            }}
          >
            <Image
              src={s.src}
              alt={hidden ? "" : s.alt}
              fill
              sizes="(min-width: 768px) 400px, 300px"
              draggable={false}
              className="select-none object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function ProductSlide({ active = true }: { active?: boolean }) {
  const reduceMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstA = useRef<HTMLDivElement>(null);
  const firstB = useRef<HTMLDivElement>(null);
  const held = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = active && inView && !reduceMotion;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !running) return;
    let raf = 0;
    let last = 0;
    let speed = 1;
    let x = Number(track.dataset.x ?? 0);
    // One lap = distance between the first item of each set. Re-read on resize
    // (fonts, breakpoint) rather than cached once.
    let lap = 0;
    const measure = () => {
      const a = firstA.current;
      const b = firstB.current;
      if (a && b) lap = b.offsetLeft - a.offsetLeft;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;
      const target = held.current ? 0 : 1;
      speed += (target - speed) * (1 - Math.exp(-dt / EASE_SECONDS));
      if (lap > 0) {
        x = (x + speed * PX_PER_SECOND * dt) % lap;
        track.style.transform = `translate3d(${-x}px,0,0)`;
        track.dataset.x = String(x);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [running]);

  const hold = (v: boolean) => (e: React.PointerEvent) => {
    // Mouse: hover. Touch/pen: only while pressed (enter/leave fire around a tap).
    if (e.pointerType === "mouse") held.current = v;
  };
  const press = (v: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") held.current = v;
  };

  return (
    <section
      id="product"
      className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-bg-primary md:overflow-hidden"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />
      <GridDepthLayer className="absolute inset-0 hidden w-full [--grid-cell:40px] md:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col gap-32px px-20px pt-32px pb-0 md:gap-0 md:px-80px md:pt-[calc(var(--fr-header-h,0px)+48px)]">
        <div className="flex w-full max-w-[904px] flex-col items-start gap-24px">
          <span className="font-mono text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
            The product
          </span>
          <div className="flex flex-col gap-16px">
            <h2 className="w-full font-display text-slide-title-sm text-text-primary md:text-slide-title">
              Experts became the product
            </h2>
            <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px] md:text-[18px]">
              Nine domain experts, each with its own home and its own signature
              feature. One navigation model, built to hold all nine or to stand
              alone as just one. Chat is still there, one way in, not the only
              one.
            </p>
          </div>
        </div>
      </div>

      {/* The row. Full-bleed (the shots run off both edges); the track's first
          item sits on the 80px gutter. */}
      <div
        ref={rowRef}
        role="group"
        aria-label="UltraAI product shots"
        onPointerEnter={hold(true)}
        onPointerLeave={hold(false)}
        onPointerDown={press(true)}
        onPointerUp={press(false)}
        onPointerCancel={press(false)}
        className={`relative z-10 mt-32px h-[380px] w-full shrink-0 md:mt-auto md:mb-[88px] md:h-[480px] md:max-h-[calc(100%-390px)] ${
          reduceMotion ? "overflow-x-auto" : "overflow-hidden"
        }`}
      >
        <div
          ref={trackRef}
          className="flex h-full w-max pl-20px will-change-transform md:pl-80px"
        >
          <ShotSet firstRef={firstA} />
          {!reduceMotion && <ShotSet hidden firstRef={firstB} />}
        </div>
      </div>
    </section>
  );
}
