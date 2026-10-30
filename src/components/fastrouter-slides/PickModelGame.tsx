"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

// "Pick a model" mini-game for the Problem slide's right column (test page:
// /lab/problem-game). Layout is Figma node 8189:50954: a tilted grey panel with
// the task and four model cards on it, a hand-drawn "Pick a Model" arrow, and,
// once a card is picked, a "Play again" pill, the picked card with a green
// check, "Why {model}?", and three blank needles (cost, quality, verdict) that
// can't settle. The reader plays the slide's argument ("gut feel dressed up as
// strategy") instead of reading it.
//
// COPY: the task wording, model names and labels are Figma's for this node. The
// extra tasks in TASKS (shown after "Play again") are placeholders of mine, in
// the same register. Change them in one place.
//
// Motion (not GSAP): everything is driven by React state. The picked card glides
// from the grid to its slot with a shared layout animation; hover tilt, press,
// the check pop, the heading reveal and the needles are springs. Under
// prefers-reduced-motion the tilt, bounce, glide and wobble are dropped and the
// states still change.

// First entry is what the server renders (so hydration matches); "Play again"
// then moves to a different one at random.
export const TASKS = [
  "Explain a confusing phone bill in plain English",
  "Summarise a 40-page report before your 9am meeting",
  "Write a polite email asking your landlord to fix the heating",
  "Plan a 3-day trip to Lisbon on a budget",
  "Turn messy meeting notes into clear action items",
  "Draft a cover letter for a job you really want",
  "Compare two laptops for a student with an $800 budget",
];

export const MODELS = [
  { name: "Claude Sonnet 5.5", maker: "Anthropic" },
  { name: "GPT-4o", maker: "OpenAI" },
  { name: "Gemini 1.5", maker: "Google" },
  { name: "Mistral Large", maker: "Mistral" },
] as const;

// Rest angle (degrees) of each needle: they never agree with each other.
const GAUGES = [
  { label: "Cost", rest: -5 },
  { label: "Quality", rest: -24 },
  { label: "Verdict", rest: 20 },
] as const;

const SPRING = { type: "spring", stiffness: 320, damping: 24 } as const;
const GLIDE = { type: "spring", stiffness: 240, damping: 28 } as const;

// Figma's two-layer card shadow, and a deeper one that fades in on hover. The
// deeper one lives on its own layer so hover animates opacity, not box-shadow.
const CARD_SHADOW =
  "shadow-[0px_4px_8px_0px_rgba(17,17,26,0.05),0px_8px_16px_0px_rgba(17,17,26,0.05)]";
const CARD_SHADOW_HOVER =
  "shadow-[0px_8px_16px_0px_rgba(17,17,26,0.08),0px_16px_32px_0px_rgba(17,17,26,0.10)]";

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.5 5.25V9.75C22.5 9.94891 22.421 10.1397 22.2803 10.2803C22.1397 10.421 21.9489 10.5 21.75 10.5H17.25C17.1016 10.5001 16.9565 10.4562 16.833 10.3738C16.7096 10.2914 16.6133 10.1742 16.5565 10.0371C16.4997 9.89998 16.4849 9.74908 16.5139 9.60352C16.5428 9.45796 16.6144 9.32427 16.7194 9.21938L18.3131 7.62562L17.3241 6.72094L17.3006 6.69844C16.2582 5.6564 14.9318 4.94462 13.4872 4.65201C12.0426 4.35941 10.5438 4.49895 9.17802 5.05322C7.81226 5.60748 6.64009 6.55189 5.80794 7.76846C4.9758 8.98504 4.52057 10.4198 4.49912 11.8936C4.47768 13.3674 4.89097 14.8149 5.68737 16.0551C6.48378 17.2954 7.62798 18.2735 8.97704 18.8673C10.3261 19.461 11.8202 19.6441 13.2727 19.3937C14.7252 19.1432 16.0718 18.4703 17.1441 17.4591C17.2157 17.3913 17.2999 17.3384 17.3919 17.3032C17.484 17.2681 17.5821 17.2514 17.6806 17.2541C17.7791 17.2569 17.8761 17.279 17.966 17.3192C18.056 17.3594 18.1371 17.417 18.2048 17.4886C18.2726 17.5602 18.3255 17.6444 18.3607 17.7365C18.3958 17.8285 18.4125 17.9266 18.4098 18.0251C18.407 18.1236 18.3849 18.2206 18.3447 18.3106C18.3045 18.4005 18.2469 18.4817 18.1753 18.5494C16.5077 20.1285 14.2967 21.0059 12 21H11.8762C10.4023 20.9798 8.95578 20.5979 7.66397 19.8877C6.37215 19.1776 5.27455 18.161 4.46762 16.9274C3.66069 15.6937 3.16914 14.2807 3.03619 12.8126C2.90323 11.3445 3.13293 9.86615 3.7051 8.50759C4.27727 7.14902 5.17439 5.9518 6.31762 5.02115C7.46084 4.0905 8.81516 3.45491 10.2615 3.17024C11.7079 2.88558 13.2021 2.96055 14.6127 3.38858C16.0234 3.81661 17.3072 4.58458 18.3516 5.625L19.3762 6.5625L21.2194 4.71563C21.3245 4.61039 21.4585 4.53878 21.6044 4.50991C21.7504 4.48104 21.9016 4.49621 22.0388 4.55349C22.1761 4.61077 22.2932 4.70757 22.3754 4.8316C22.4575 4.95562 22.5009 5.10126 22.5 5.25Z"
      />
    </svg>
  );
}

function CheckBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97981 4.96451 3.73013 6.48726 2.99217 8.26884C2.25422 10.0504 2.06114 12.0108 2.43734 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46927 20.2579 8.20655 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1217 15.6557 10.039 15.6004 9.96937 15.5306L7.71937 13.2806C7.57864 13.1399 7.49958 12.949 7.49958 12.75C7.49958 12.551 7.57864 12.3601 7.71937 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44902 11.9996 8.63989 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.2891 9.14969 15.3718 9.09442 15.4628 9.0567C15.5539 9.01899 15.6515 8.99958 15.75 8.99958C15.8485 8.99958 15.9461 9.01899 16.0372 9.0567C16.1282 9.09442 16.2109 9.14969 16.2806 9.21937C16.3503 9.28906 16.4056 9.37178 16.4433 9.46283C16.481 9.55387 16.5004 9.65145 16.5004 9.75C16.5004 9.84855 16.481 9.94613 16.4433 10.0372C16.4056 10.1282 16.3503 10.2109 16.2806 10.2806Z"
      />
    </svg>
  );
}

// The hand-drawn arrow (Figma vector 8189:50919) is drawn on first, then bobs
// toward the cards now and then, as a nudge rather than a loop you'd notice.
function PickHint() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-[485.6px] left-[253.7px] h-[82.4px] w-[231px]"
      exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="absolute top-[18px] left-[15px] flex h-[71px] w-[101px] items-center justify-center"
        animate={reduce ? undefined : { x: [0, -3, 0], y: [0, 3, 0] }}
        transition={{
          duration: 2.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.2,
        }}
      >
        <svg
          viewBox="0 0 74.03 103"
          className="h-[100px] w-[71px] rotate-[90.49deg] overflow-visible text-text-muted"
        >
          <motion.path
            d="M71.5497 1.50022C75.8874 29.2399 68.0566 84.7194 2.0292 84.7194M23.2621 101.5L2.0292 84.7194L19.1525 59.7194"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      <motion.p
        className="absolute top-[54.4px] left-[126px] whitespace-nowrap font-ui font-semibold text-[17px] text-text-muted leading-[28px] tracking-[0.085px]"
        initial={reduce ? false : { opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...SPRING, delay: 1.2 }}
      >
        Pick a Model
      </motion.p>
    </motion.div>
  );
}

// A model card's face. It fills whatever box its wrapper animates to, and
// `compact` is the smaller chip the picked card becomes (type and padding ease
// over with the box, so the glide doesn't end in a snap).
function CardFace({
  name,
  maker,
  compact = false,
}: {
  name: string;
  maker: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex size-full flex-col items-start justify-center gap-4px rounded-2xl bg-bg-surface text-left transition-[padding] duration-500 ${CARD_SHADOW} ${
        compact ? "px-24px py-8px" : "px-32px py-16px"
      }`}
    >
      <span
        className={`whitespace-nowrap font-ui font-semibold text-text-primary transition-[font-size,line-height] duration-500 ${
          compact
            ? "text-[17px] leading-[28px] tracking-[0.085px]"
            : "text-[20px] leading-[26px] tracking-[-0.1px]"
        }`}
      >
        {name}
      </span>
      <span className="font-mono font-medium text-[13px] text-text-muted uppercase leading-[18px] tracking-[0.78px]">
        {maker}
      </span>
    </div>
  );
}

// Card geometry on Figma's grid: 238x80 cells, 24px gaps.
const CELL_W = 238;
const CELL_H = 80;
const GAP = 24;
const CHIP_INSET = 40; // the chip sits under the task text, inset like it

function ModelCard({
  name,
  maker,
  state,
  index,
  played,
  chip,
  onPick,
}: {
  name: string;
  maker: string;
  state: "idle" | "picked" | "dimmed";
  index: number;
  played: boolean;
  chip: { w: number; h: number };
  onPick: () => void;
}) {
  const reduce = useReducedMotion();
  const col = index % 2;
  const row = Math.floor(index / 2);
  // Pointer position over the card, -0.5..0.5, eased through springs so the tilt
  // follows the cursor with a little lag and settles flat on leave.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 16,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), {
    stiffness: 180,
    damping: 16,
  });

  const animate =
    state === "picked"
      ? reduce
        ? { scale: 1.02, y: -2, opacity: 1 }
        : { scale: [1, 1.07, 0.99, 1.02], y: [0, -12, 2, -3], opacity: 1 }
      : state === "dimmed"
        ? { scale: 0.92, y: 4, opacity: 0 }
        : { scale: 1, y: 0, opacity: 1 };

  // The outer box owns the position and size: it sits in its grid cell, and once
  // the card is "played" it travels (explicit x/y, no measuring, no shared-layout
  // magic) to the chip slot and shrinks to the chip's size. The button inside
  // keeps the tilt and bounce, so those transforms never fight the move.
  const moved = state === "picked" && played;

  return (
    <motion.div
      className="absolute top-0 left-0"
      initial={false}
      animate={{
        x: moved ? CHIP_INSET : col * (CELL_W + GAP),
        y: moved ? 0 : row * (CELL_H + GAP),
        width: moved ? chip.w : CELL_W,
        height: moved ? chip.h : CELL_H,
      }}
      transition={reduce ? { duration: 0 } : { ...GLIDE, mass: 0.9 }}
      style={{ pointerEvents: state === "dimmed" ? "none" : undefined }}
    >
      <motion.button
        type="button"
        onClick={onPick}
        disabled={state !== "idle"}
        aria-pressed={state === "picked"}
        // Staggered entrance so the four cards settle in one after another.
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={animate}
        transition={
          state === "picked" && !reduce
            ? { duration: 0.55, times: [0, 0.35, 0.7, 1], ease: "easeOut" }
            : state === "dimmed"
              ? { duration: 0.3, ease: "easeIn" }
              : { ...SPRING, delay: state === "idle" ? 0.25 + index * 0.07 : 0 }
        }
        whileHover={
          state === "idle" && !reduce ? { y: -4, scale: 1.03 } : undefined
        }
        whileTap={state === "idle" ? { scale: 0.96 } : undefined}
        onPointerMove={(e) => {
          if (reduce || state !== "idle") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        style={{ rotateX, rotateY, transformPerspective: 700 }}
        className={`group relative block size-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-text-accent ${
          state === "idle" ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <CardFace name={name} maker={maker} compact={moved} />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${CARD_SHADOW_HOVER}`}
        />
      </motion.button>
      {moved && (
        <motion.span
          className="pointer-events-none absolute top-[-5px] right-[-8px] size-[24px] text-text-success"
          initial={reduce ? false : { scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.45 }}
        >
          <CheckBadge className="size-full rounded-full bg-bg-surface" />
        </motion.span>
      )}
    </motion.div>
  );
}

// A needle that cannot settle: it drops in, then sways around its own rest angle
// on its own period, so the three never move in step. Hover wakes it up.
function Needle({
  label,
  rest,
  index,
}: {
  label: string;
  rest: number;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={reduce ? false : { opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { ...SPRING, delay: 0.45 + index * 0.12 },
      }}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={SPRING}
    >
      <motion.div
        className="relative h-[52px] w-[24px] origin-bottom"
        initial={reduce ? false : { scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ ...SPRING, delay: 0.55 + index * 0.12 }}
      >
        {/* The dial's dashed arc, centred on the needle's pivot (the dot, 4px
            up from the bottom). It fades and grows in just ahead of the needle. */}
        <motion.svg
          viewBox="0 0 112 64"
          aria-hidden="true"
          className="absolute bottom-[-2px] left-1/2 h-[64px] w-[112px] origin-bottom overflow-visible"
          style={{ x: "-50%" }}
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING, delay: 0.45 + index * 0.12 }}
        >
          <path
            d="M8 58 A48 48 0 0 1 104 58"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="2 9"
            className="stroke-border-frame"
          />
        </motion.svg>
        <motion.div
          className="absolute bottom-[4px] left-1/2 h-[44px] w-[2px] origin-bottom rounded-full bg-text-primary"
          style={{ x: "-50%", rotate: rest }}
          animate={
            reduce
              ? undefined
              : { rotate: [rest, rest + 7, rest - 5, rest + 4, rest] }
          }
          transition={{
            duration: 4.5 + index * 1.1,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <span className="absolute bottom-0 left-1/2 size-[8px] -translate-x-1/2 rounded-full bg-text-primary" />
      </motion.div>
      <span className="mt-12px font-mono font-medium text-[13px] text-text-muted uppercase leading-[18px] tracking-[0.78px]">
        {label}
      </span>
      <motion.span
        className="mt-4px font-display text-[24px] text-text-primary leading-[32px]"
        whileHover={reduce ? undefined : { y: -2, rotate: -6, scale: 1.12 }}
        transition={SPRING}
      >
        ?
      </motion.span>
    </motion.div>
  );
}

export default function PickModelGame() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<number | null>(null);
  // "pick": the grid is showing. "played": the grid is gone and the picked card
  // has glided into its chip. Split so the other three can fade out first.
  const [stage, setStage] = useState<"pick" | "played">("pick");
  const [taskIndex, setTaskIndex] = useState(0);
  const [spin, setSpin] = useState(0);
  // Natural size of the picked card's compact chip, measured off an invisible
  // copy (offsetWidth/Height, so the phone-size scale() doesn't skew it).
  const [chip, setChip] = useState({ w: 108, h: 66 });
  const measureRef = useRef<HTMLDivElement>(null);
  // Below md the fixed 555px box is scaled to the viewport (null = use the CSS
  // fallback until measured, and on desktop). It may bleed a few px into the page
  // gutters, so the panel stays as large as the screen allows.
  const [fit, setFit] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const pick = (i: number) => {
    setPicked(i);
    timer.current = setTimeout(() => setStage("played"), reduce ? 0 : 620);
  };

  const playAgain = () => {
    if (timer.current) clearTimeout(timer.current);
    setSpin((s) => s + 1);
    setPicked(null);
    setStage("pick");
    // A random task that isn't the one just shown.
    setTaskIndex(
      (i) => (i + 1 + Math.floor(Math.random() * (TASKS.length - 1))) % TASKS.length,
    );
  };

  // The grey panel leans a touch toward the cursor, and tilts a little further
  // once a card has been picked (Figma: -6deg, then -6.71deg).
  const panelX = useMotionValue(0);
  const panelRotate = useSpring(useTransform(panelX, [-0.5, 0.5], [-1.4, 1.4]), {
    stiffness: 90,
    damping: 18,
  });

  const played = stage === "played";
  const model = picked === null ? null : MODELS[picked];

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setFit(w >= 768 ? null : Math.min(1, (w - 16) / 535));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (el) setChip({ w: el.offsetWidth, h: el.offsetHeight });
  }, [picked]);

  return (
    // The game is laid out on Figma's fixed 555px box; on a phone the whole box
    // is scaled down rather than re-laid out.
    <div
      // 580 tall, not 555: the "Pick a Model" hint and the needle labels hang
      // ~25px below the 555 box, and an overflow-hidden ancestor clipped them
      // because the wrapper didn't account for that space.
      className="h-[348px] w-[333px] shrink-0 self-center md:h-[580px] md:w-[555px]"
      style={fit === null ? undefined : { width: 555 * fit, height: 580 * fit }}
    >
      <div
        className="relative h-[555px] w-[555px] origin-top-left scale-[0.6] md:scale-100"
        // `scale`, not `transform`: Tailwind's scale-* utilities set the `scale`
        // property, so a transform here would stack on top of them.
        style={fit === null ? undefined : { scale: fit }}
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          panelX.set((e.clientX - r.left) / r.width - 0.5);
        }}
        onPointerLeave={() => panelX.set(0)}
      >
        {/* Grey tilted panel. */}
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            animate={{ rotate: played ? -6.71 : -6, scale: played ? 1.01 : 1 }}
            transition={{ ...GLIDE, stiffness: 120 }}
          >
            <motion.div
              style={{ rotate: reduce ? 0 : panelRotate }}
              className="size-[460px] rounded-[32px] bg-[var(--color-game-panel)]"
            />
          </motion.div>
        </div>

          <div className="absolute top-[106.5px] left-[43.5px] flex w-[500px] flex-col gap-[48px]">
            {model && (
              <div
                ref={measureRef}
                aria-hidden="true"
                className="invisible absolute top-0 left-0 w-max"
              >
                <CardFace name={model.name} maker={model.maker} compact />
              </div>
            )}
            {/* Task, with Play again once a card is picked. */}
            <div className="flex flex-col gap-24px px-40px">
              <div className="flex h-[30px] items-center justify-between pr-[80px]">
                <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
                  Task
                </span>
                <AnimatePresence>
                  {played && (
                    <motion.button
                      type="button"
                      onClick={playAgain}
                      initial={reduce ? false : { opacity: 0, scale: 0.8, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ ...SPRING, delay: reduce ? 0 : 0.45 }}
                      whileHover={reduce ? undefined : { y: -2, scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-8px rounded-xl bg-bg-surface px-8px py-4px text-text-accent shadow-[0px_2px_5px_0px_rgba(50,50,105,0.15),0px_1px_1px_0px_rgba(0,0,0,0.05)] outline-none focus-visible:ring-2 focus-visible:ring-text-accent"
                    >
                      <motion.span
                        className="block size-[24px]"
                        animate={{ rotate: spin * 360 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <RefreshIcon className="size-full transition-transform duration-300 group-hover:rotate-[-40deg]" />
                      </motion.span>
                      <span className="font-ui font-medium text-[14px] leading-[20px] tracking-[0.07px]">
                        Play again
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <div className="min-h-[64px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={taskIndex}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="max-w-[340px] text-balance font-display text-[20px] text-text-primary leading-[32px]"
                  >
                    {TASKS[taskIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* The cards live in one relative slot. It stays 184px tall while
                you choose, then eases down to the chip's height as the picked
                card travels up and the others have already gone, which pulls
                the heading and needles up with it. */}
            <div className="flex flex-col gap-[48px]">
              <motion.div
                className="relative w-full"
                initial={false}
                animate={{ height: played ? chip.h : CELL_H * 2 + GAP }}
                transition={reduce ? { duration: 0 } : { ...GLIDE, mass: 0.9 }}
              >
                {MODELS.map((m, i) => (
                  <ModelCard
                    key={m.name}
                    name={m.name}
                    maker={m.maker}
                    index={i}
                    played={played}
                    chip={chip}
                    state={
                      picked === null ? "idle" : picked === i ? "picked" : "dimmed"
                    }
                    onPick={() => pick(i)}
                  />
                ))}
              </motion.div>

              {played && model && (
                <div className="flex flex-col gap-[28px]">
                  {/* 28px, not Figma's 8: the dial arcs rise ~4px above the needle
                      box, so this leaves a clear 24px between title and arcs. */}
                  <h2 className="px-40px font-display text-[32px] text-text-primary capitalize leading-[44px] tracking-[0.5px]">
                    {`Why ${model.name}?`.split(" ").map((w, i) => (
                      <motion.span
                        key={`${w}-${i}`}
                        className="mr-[0.28em] inline-block"
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING, delay: 0.45 + i * 0.07 }}
                      >
                        {w}
                      </motion.span>
                    ))}
                  </h2>
                  <div className="grid w-[500px] grid-cols-3 md:w-[536px]">
                    {GAUGES.map((g, i) => (
                      <Needle key={g.label} label={g.label} rest={g.rest} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>{stage === "pick" && picked === null && <PickHint key="hint" />}</AnimatePresence>
      </div>
    </div>
  );
}
