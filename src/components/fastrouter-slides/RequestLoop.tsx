"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  type ValueAnimationTransition,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { MODELS, TASKS } from "@/components/fastrouter-slides/PickModelGame";

// EXPERIMENT (lab: /lab/product-loop): a request that loops through the
// Product slide's browser frame, entering from the left and leaving on the
// right, to show what FastRouter does in one image: one request in, one routing
// decision inside, one labelled receipt out.
//
// Mounted over the recording (it never touches the video), inside a box that
// mirrors the video's box, so every position is "bolt = centre of this box". The
// bolt sits at 50% across and ~74.6% down the recording (measured off the clip
// at 1440; the recording is a fixed crop). The loop, about 7s, one request in
// flight at a time:
//   1. the task chip, in words, slides in from the slide's left edge
//   2. at the frame edge it collapses to a dot: outside the product a request is
//      words, inside it is a packet. The dot rides the track to the bolt
//   3. the bolt pulses and a label cycles Cost, Latency, Quality, then locks on
//      this cycle's rule (the "intelligent routing")
//   4. the dot leaves, and at the frame's right edge becomes a result chip
//      ("to {model}, by {rule}") that slides off the right of the slide
//   5. a receipt drops into a small log beside the frame ("visibility into every
//      request")
// Each cycle uses the next task, a different rule and a different model, so the
// loop shows the same API choosing differently per request.
//
// COPY / HONESTY: the tasks and model names are the Problem game's placeholders.
// The result chip names a model and the RULE applied, never "cheapest" or a
// price or latency figure, because nothing here is measured. Which model a rule
// picks in the demo is illustrative.
//
// Motion, not GSAP: state-driven (cycle controller + motion values), transform
// and opacity only. Runs only while the slide is active (or in view when no
// `active` prop is passed, as on the touch stack), pauses when the tab is
// hidden. Reduced motion: no travel, a static resting frame.

const RULES = ["Cost", "Latency", "Quality"] as const;
const BOLT_Y = "74.6%";

type Row = { task: string; model: string; rule: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function RequestLoop({ active }: { active?: boolean }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const chipEl = useRef<HTMLDivElement>(null);
  const resEl = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [label, setLabel] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  const chipX = useMotionValue(-2000);
  const chipO = useMotionValue(0);
  const chipS = useMotionValue(1);
  const dotX = useMotionValue(0);
  const dotO = useMotionValue(0);
  const resX = useMotionValue(2000);
  const resO = useMotionValue(0);
  const ringS = useMotionValue(0.6);
  const ringO = useMotionValue(0);

  // Width of the box (== the recording), kept current on resize.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    setWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Without an `active` prop (touch stack) fall back to "is it on screen".
  useEffect(() => {
    const el = box.current;
    if (!el || active !== undefined) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  const running = (active ?? inView) && width > 0 && !reduce;

  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    const half = width / 2;
    const vw = window.innerWidth;
    const controls: { stop: () => void }[] = [];
    const go = (
      mv: typeof chipX,
      to: number | number[],
      opts: ValueAnimationTransition<number>,
    ) => {
      const c = animate(mv, to as number, opts);
      controls.push(c);
      return c;
    };

    const loop = async () => {
      // The deck flips `active` at the midpoint of its dissolve, so wait for
      // the slide to be fully visible before the first request appears.
      await sleep(900);
      let i = 0;
      while (!cancelled) {
        if (document.hidden) {
          await sleep(500);
          continue;
        }
        const rule = RULES[i % RULES.length];
        const model = MODELS[(i + 1) % MODELS.length].name;
        setCycle(i);
        setLabel(null);
        const chipW = chipEl.current?.offsetWidth ?? 300;
        const resW = resEl.current?.offsetWidth ?? 220;
        chipX.set(-(vw / 2) - chipW);
        chipO.set(0);
        chipS.set(1);
        dotX.set(-half);
        dotO.set(0);
        resX.set(half + resW / 2);
        resO.set(0);
        await sleep(60);

        // 1. words come in from the left edge of the slide
        go(chipO, 1, { duration: 0.35 });
        await go(chipX, -half - chipW / 2 - 12, {
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        });
        if (cancelled) return;

        // 2. into the product: collapse to a packet, ride to the bolt
        go(chipO, 0, { duration: 0.25 });
        go(chipS, 0.4, { duration: 0.25 });
        go(dotO, 1, { duration: 0.2 });
        await go(dotX, 0, { duration: 0.9, ease: "easeInOut" });
        if (cancelled) return;

        // 3. decide: the bolt pulses, the rule is weighed, then locks
        ringS.set(0.6);
        ringO.set(0.5);
        go(ringS, 2.6, { duration: 0.8, ease: "easeOut" });
        go(ringO, 0, { duration: 0.8, ease: "easeOut" });
        for (const r of RULES) {
          setLabel(r);
          await sleep(230);
        }
        setLabel(rule);
        await sleep(450);
        if (cancelled) return;

        // 4. out: the packet leaves, becomes a result chip at the right edge
        setRows((prev) =>
          [{ task: TASKS[i % TASKS.length], model, rule }, ...prev].slice(0, 3),
        );
        setLabel(null);
        await go(dotX, half, { duration: 0.8, ease: "easeIn" });
        go(dotO, 0, { duration: 0.15 });
        go(resO, [0, 1, 1, 0], { duration: 1.5, times: [0, 0.15, 0.7, 1] });
        await go(resX, vw / 2 + resW / 2 + 40, {
          duration: 1.5,
          ease: [0.33, 0, 0.2, 1],
        });
        if (cancelled) return;

        await sleep(1100);
        i += 1;
      }
    };
    loop();

    return () => {
      cancelled = true;
      controls.forEach((c) => c.stop());
    };
  }, [running, width, chipX, chipO, chipS, dotX, dotO, resX, resO, ringS, ringO]);

  const task = TASKS[cycle % TASKS.length];
  const model = MODELS[(cycle + 1) % MODELS.length].name;
  const rule = RULES[cycle % RULES.length];
  // Resting frame for reduced motion: one row in the log, no travel.
  const shownRows: Row[] = reduce
    ? RULES.map((r, i) => ({
        task: TASKS[i],
        model: MODELS[(i + 1) % MODELS.length].name,
        rule: r,
      }))
    : rows;

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 right-0 left-0 z-20 aspect-[350/187] md:top-[20px] md:right-[20px] md:left-[20px] md:aspect-[900/395]"
    >
      {/* The track: faint across the whole slide, firmer inside the frame. */}
      <div
        className="absolute left-1/2 w-screen -translate-x-1/2 border-border-frame border-t border-dashed"
        style={{ top: BOLT_Y }}
      />
      <div
        className="absolute right-0 left-0 border-text-accent/40 border-t border-dashed"
        style={{ top: BOLT_Y }}
      />

      {/* Bolt pulse. */}
      <motion.div
        className="absolute left-1/2 size-[56px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-text-accent"
        style={{ top: BOLT_Y, scale: ringS, opacity: ringO }}
      />

      {/* The rule being weighed, just under the bolt. */}
      <AnimatePresence>
        {label && (
          <motion.span
            key="rule"
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-bg-surface px-10px py-2px font-mono font-medium text-[12px] text-text-accent uppercase leading-[18px] tracking-[0.78px] shadow-[0px_2px_5px_0px_rgba(50,50,105,0.15),0px_1px_1px_0px_rgba(0,0,0,0.05)]"
            style={{ top: `calc(${BOLT_Y} + 40px)` }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* In, as words. */}
      <motion.div
        ref={chipEl}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-border-default bg-bg-surface px-16px py-8px font-ui font-medium text-[14px] text-text-primary leading-[20px] tracking-[0.07px] shadow-[0px_4px_8px_0px_rgba(17,17,26,0.05),0px_8px_16px_0px_rgba(17,17,26,0.05)]"
        style={{
          top: BOLT_Y,
          x: chipX,
          opacity: chipO,
          scale: chipS,
        }}
      >
        {task}
      </motion.div>

      {/* Inside the product, as a packet. */}
      <motion.div
        className="absolute left-1/2 size-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-accent shadow-[0px_0px_12px_2px_rgba(26,52,215,0.45)]"
        style={{ top: BOLT_Y, x: dotX, opacity: dotO }}
      />

      {/* Out, labelled with who took it and which rule decided. */}
      <motion.div
        ref={resEl}
        className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8px whitespace-nowrap rounded-xl border border-border-default bg-bg-surface px-16px py-8px shadow-[0px_4px_8px_0px_rgba(17,17,26,0.05),0px_8px_16px_0px_rgba(17,17,26,0.05)]"
        style={{
          top: BOLT_Y,
          x: resX,
          opacity: reduce ? 1 : resO,
        }}
      >
        <span className="font-ui font-semibold text-[14px] text-text-primary leading-[20px] tracking-[0.07px]">
          {model}
        </span>
        <span className="font-mono font-medium text-[12px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
          by {rule}
        </span>
      </motion.div>

      {/* The receipts: visibility into every request. Wide screens only. */}
      <div
        className="absolute left-full ml-[28px] hidden w-[220px] flex-col gap-6px lg:flex"
        style={{ top: `calc(${BOLT_Y} + 24px)` }}
      >
        <AnimatePresence initial={false}>
          {shownRows.map((r, idx) => (
            <motion.div
              key={`${r.task}-${r.model}-${r.rule}`}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1 - idx * 0.3, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-8px font-mono text-[12px] text-text-muted leading-[18px]"
            >
              <span className="text-text-success">✓</span>
              <span className="truncate">
                {r.model} · {r.rule}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
