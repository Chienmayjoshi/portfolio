"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type gsap from "gsap";
import CaseStudyEnter, {
  ENTER_DEFAULTS,
  type CaseStudyEnterConfig,
} from "@/components/shared/CaseStudyEnter";
import type { EnterTitleLines } from "@/components/shared/caseStudyEnterLines";

// Shared tuning harness behind both /lab/case-study-enter routes: the overlay,
// a Replay button, a live control panel, and a scrubber. `children` is whatever
// the words are flying INTO - the real page components, never a copy of them,
// so a landing that's correct here is correct on the real route.
//
// Temporary. Deleting src/app/lab/ removes this and both routes; only
// CaseStudyEnter itself ships.
interface EnterLabHarnessProps {
  /** Overlay copy, per breakpoint. */
  lines: EnterTitleLines;
  /** For layouts that scroll an inner element (the deck) rather than the page. */
  scrollerSelector?: string;
  /** The page under the overlay - the snap target lives in here. */
  children: React.ReactNode;
}

type NumericKey = Exclude<
  {
    [K in keyof CaseStudyEnterConfig]: CaseStudyEnterConfig[K] extends number
      ? K
      : never;
  }[keyof CaseStudyEnterConfig],
  undefined
>;

const SLIDERS: {
  key: NumericKey;
  label: string;
  min: number;
  max: number;
  step: number;
  group: string;
}[] = [
  { key: "charDuration", label: "char duration", min: 0.1, max: 1.5, step: 0.01, group: "Build" },
  { key: "charStagger", label: "char stagger", min: 0.004, max: 0.06, step: 0.001, group: "Build" },
  { key: "charShift", label: "char shift %", min: 20, max: 160, step: 5, group: "Build" },
  { key: "charBlur", label: "char blur px", min: 0, max: 20, step: 1, group: "Build" },
  { key: "hold", label: "hold", min: 0, max: 1.2, step: 0.02, group: "Snap" },
  { key: "flipDuration", label: "flip duration", min: 0.2, max: 2, step: 0.02, group: "Snap" },
  { key: "flipLead", label: "flip lead", min: 0, max: 0.08, step: 0.002, group: "Snap" },
  { key: "handoff", label: "handoff", min: 0, max: 0.5, step: 0.01, group: "Snap" },
  { key: "fontSize", label: "font size", min: 48, max: 120, step: 0.5, group: "Type" },
  { key: "lineHeight", label: "line height", min: 52, max: 140, step: 1, group: "Type" },
  { key: "boxWidth", label: "box width", min: 600, max: 1200, step: 10, group: "Type" },
  { key: "burstDistance", label: "float distance px", min: 0, max: 320, step: 5, group: "Burst" },
  { key: "burstSpin", label: "float spin deg", min: 0, max: 45, step: 1, group: "Burst" },
  { key: "eyeDwell", label: "eye dwell (s)", min: 0.3, max: 2, step: 0.05, group: "Burst" },
  { key: "stageDuration", label: "stage duration", min: 0.1, max: 1.2, step: 0.02, group: "Stages" },
  { key: "stageOffset", label: "stage offset", min: 0, max: 0.4, step: 0.01, group: "Stages" },
  { key: "stageShift", label: "stage shift px", min: 0, max: 40, step: 1, group: "Stages" },
];

const EASES = [
  "power2.out",
  "power3.out",
  "power4.out",
  "power2.inOut",
  "power3.inOut",
  "expo.out",
  "expo.inOut",
  "circ.out",
  "back.out(1.4)",
  "none",
];

// Read/write via history.replaceState rather than useSearchParams, which would
// force this page under a Suspense boundary for no benefit in a scratch harness.
function readConfigFromUrl(): Partial<CaseStudyEnterConfig> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, unknown> = {};
  params.forEach((value, key) => {
    if (!(key in ENTER_DEFAULTS)) return;
    const fallback = ENTER_DEFAULTS[key as keyof CaseStudyEnterConfig];
    out[key] = typeof fallback === "number" ? Number(value) : value;
  });
  return out as Partial<CaseStudyEnterConfig>;
}

export default function EnterLabHarness({
  lines,
  scrollerSelector,
  children,
}: EnterLabHarnessProps) {
  const [config, setConfig] = useState<CaseStudyEnterConfig>(ENTER_DEFAULTS);
  const [play, setPlay] = useState(0);
  const [open, setOpen] = useState(true);
  const [running, setRunning] = useState(false);
  // Scrub mode pauses the timeline and drives it by hand. Two uses: judging a
  // single frame (an ease is much easier to read held still than at speed),
  // and inspecting the sequence at all in a backgrounded tab, where the
  // browser throttles requestAnimationFrame to ~1fps and live playback stalls.
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrub, setScrub] = useState(0);

  // Hydrate from the URL after mount so server and client render the same
  // markup, then autoplay once. Reading location during render instead would
  // make the SSR pass and the first client render disagree whenever the URL
  // carries a tuned setting - which is the whole point of the URL round-trip.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfig({ ...ENTER_DEFAULTS, ...readConfigFromUrl() });
    setPlay(1);
    setRunning(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    (Object.keys(ENTER_DEFAULTS) as (keyof CaseStudyEnterConfig)[]).forEach(
      (key) => {
        if (config[key] !== ENTER_DEFAULTS[key]) {
          params.set(key, String(config[key]));
        }
      }
    );
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname
    );
  }, [config]);

  const set = useCallback(
    <K extends keyof CaseStudyEnterConfig>(
      key: K,
      value: CaseStudyEnterConfig[K]
    ) => setConfig((c) => ({ ...c, [key]: value })),
    []
  );

  const replay = useCallback(() => {
    setRunning(true);
    setPlay((n) => n + 1);
  }, []);

  const onTimeline = useCallback(
    (tl: gsap.core.Timeline | null) => {
      tlRef.current = tl;
      // Also parked on window so the sequence can be driven from a console or
      // an automation tool - the only reliable way to inspect a frame in a
      // backgrounded tab. Lab-only; this whole route is temporary.
      (window as unknown as Record<string, unknown>).__enterTimeline = tl;
      if (tl && scrubbing) {
        tl.pause();
        // Never seek to a hard 1 - that fires onComplete, which tears the
        // overlay down and ends the thing you're inspecting.
        tl.progress(Math.min(scrub, 0.999));
      }
    },
    [scrubbing, scrub]
  );

  const onScrub = useCallback((value: number) => {
    setScrub(value);
    tlRef.current?.pause().progress(Math.min(value, 0.999));
  }, []);

  // Space bar to replay - the whole loop is watch, nudge, watch again.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "KeyR" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        return;
      }
      e.preventDefault();
      replay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [replay]);

  const groups = [...new Set(SLIDERS.map((s) => s.group))];

  return (
    <>
      <CaseStudyEnter
        lines={lines}
        scrollerSelector={scrollerSelector}
        active={play}
        config={config}
        onFinish={() => setRunning(false)}
        onTimeline={onTimeline}
      />

      {children}

      <div className="fixed right-16px top-80px z-[70] w-[280px] font-mono text-[11px] leading-[16px]">
        <div className="flex gap-8px">
          <button
            onClick={replay}
            className="flex-1 rounded-lg border border-border-default bg-bg-surface px-12px py-8px text-text-primary"
          >
            {running ? "Playing…" : "Replay"} <span className="text-text-muted">(R)</span>
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg border border-border-default bg-bg-surface px-12px py-8px text-text-muted"
          >
            {open ? "–" : "+"}
          </button>
        </div>

        {open && (
          <div className="mt-8px max-h-[70vh] overflow-y-auto rounded-lg border border-border-default bg-bg-surface p-12px">
            <Row label="scrub">
              <input
                type="checkbox"
                checked={scrubbing}
                onChange={(e) => {
                  setScrubbing(e.target.checked);
                  if (e.target.checked) {
                    tlRef.current?.pause().progress(Math.min(scrub, 0.999));
                  } else {
                    tlRef.current?.play();
                  }
                }}
              />
            </Row>
            {scrubbing && (
              <label className="mb-6px block">
                <span className="flex justify-between text-text-muted">
                  progress
                  <span className="text-text-primary">{scrub.toFixed(3)}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={scrub}
                  onChange={(e) => onScrub(Number(e.target.value))}
                  className="w-full"
                />
              </label>
            )}
            <Row label="reveal">
              <select
                value={config.revealStyle}
                onChange={(e) =>
                  set("revealStyle", e.target.value as CaseStudyEnterConfig["revealStyle"])
                }
                className="w-[130px] bg-transparent text-text-primary"
              >
                <option value="mask-up">mask-up</option>
                <option value="blur-fade">blur-fade</option>
                <option value="y-fade">y-fade</option>
              </select>
            </Row>
            <Row label="pairing">
              <select
                value={config.pairing}
                onChange={(e) =>
                  set("pairing", e.target.value as CaseStudyEnterConfig["pairing"])
                }
                className="w-[130px] bg-transparent text-text-primary"
              >
                <option value="words">words</option>
                <option value="chars">chars</option>
              </select>
            </Row>
            {(["charEase", "flipEase", "burstEase", "stageEase"] as const).map((key) => (
              <Row key={key} label={key.replace("Ease", " ease")}>
                <select
                  value={config[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-[130px] bg-transparent text-text-primary"
                >
                  {EASES.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </Row>
            ))}

            {groups.map((group) => (
              <div key={group}>
                <div className="mt-12px mb-4px uppercase tracking-[0.78px] text-text-muted">
                  {group}
                </div>
                {SLIDERS.filter((s) => s.group === group).map((s) => (
                  <label key={s.key} className="mb-6px block">
                    <span className="flex justify-between text-text-muted">
                      {s.label}
                      <span className="text-text-primary">{config[s.key]}</span>
                    </span>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={config[s.key]}
                      onChange={(e) => set(s.key, Number(e.target.value))}
                      className="w-full"
                    />
                  </label>
                ))}
              </div>
            ))}

            <div className="mt-12px flex gap-8px">
              <button
                onClick={() => setConfig(ENTER_DEFAULTS)}
                className="flex-1 rounded border border-border-default px-8px py-6px text-text-muted"
              >
                Reset
              </button>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(config, null, 2))
                }
                className="flex-1 rounded border border-border-default px-8px py-6px text-text-muted"
              >
                Copy JSON
              </button>
            </div>
            <p className="mt-8px text-text-muted">
              Changes apply on the next Replay.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6px flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      {children}
    </div>
  );
}
