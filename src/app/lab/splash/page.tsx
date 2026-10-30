"use client";

import { useState } from "react";
import Image from "next/image";
import SplashIntro from "@/components/shared/SplashIntro";

// Tuning harness for the splash intro (name written in, then a knockout zoom
// onto the scene). The scene is the FastRouter cockpit illustration from the
// Figma reference, a stand-in until the real hero exists. The splash is not
// mounted on / yet; delete src/app/lab/ when it moves onto the real flow.
const SPEEDS = [0.25, 0.5, 1];

export default function SplashLab() {
  const [run, setRun] = useState(0);
  const [skipVideo, setSkipVideo] = useState(false);
  const [timeScale, setTimeScale] = useState(1);

  return (
    <main className="fixed inset-0 bg-bg-primary">
      <Image
        src="/images/fastrouter/fr-hero-slides-illustration.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <SplashIntro key={run} config={{ skipVideo, timeScale }} />

      <div className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 rounded-lg bg-black/70 p-2 text-xs text-white backdrop-blur">
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="rounded bg-white px-3 py-1 font-medium text-black"
        >
          Replay
        </button>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={skipVideo}
            onChange={(e) => setSkipVideo(e.target.checked)}
          />
          skip video
        </label>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTimeScale(s)}
            className={`rounded px-2 py-1 ${timeScale === s ? "bg-white text-black" : "bg-white/15"}`}
          >
            {s}x
          </button>
        ))}
      </div>
    </main>
  );
}
