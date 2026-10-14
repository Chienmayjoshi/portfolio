import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Source of truth: Figma node 7570:77471 ("problem statement", desktop) /
// 7965:286092 ("shell - problem statement - mobile"), file
// 2aoIFdaJMyNBEWeQESBEzG. Both frames are finished, real UltraAI content —
// unlike the Hero mobile frame, this one was NOT a FastRouter copy-paste.
//
// This is Scroll 4's "THE PROBLEM" half only (content/ultraai.md bundles
// Problem+Product into one scroll) — Figma splits them into two separate
// slides ("problem statement" and "product", node 7610:93241). "The
// Product" is a separate slide, not built here.
//
// Assets: ua-problem-expert-access.webp / ua-problem-sidebar.webp (PNG
// screenshots provided, converted to lossless WebP — no visual quality
// lost, ~45% smaller) and ua-problem-selected-expert.mp4 (provided as the
// video Figma's own "carousel 2" slot was left empty for — an animated
// capture, not a still). All three are light-mode-only product
// screenshots per direct instruction — reused as-is on dark mode too,
// unlike ThemeSwap'd portfolio-chrome assets; the screenshot's own chrome
// doesn't track the portfolio's theme toggle.
//
// Each callout (highlight box + leader line + dot + label) is read off the
// DESKTOP frame's metadata in px against its 234x480 reference image,
// scaled by 200/234 to this component's fixed 200x410 display size (which
// matches the mobile frame's own 200x410 almost exactly — desktop's Figma
// image is drawn slightly larger at 234x480, not replicated here, a
// deliberate simplification: one fixed display size at both breakpoints
// rather than responsive recalculation of absolute callout coordinates).
// Figma draws the highlight box UNCLIPPED (it overlaps outside the photo's
// own edges by design, e.g. x=-16 on a 234-wide image) — reproduced the
// same way: box/dot/line/label all sit in one unclipped coordinate space,
// only the photo itself is rounded + clipped.
//
// The connector is a three-segment ELBOW that ends just ABOVE (or, for
// Selected Expert, just BELOW) its label, pointing at it — not a two-segment
// line that lands on the label's top-left corner. Read off the lines in both
// frames (desktop 7570:78249-78281, mobile 7965:286496-286528):
//   Expert Access   dot -> down -> across -> down onto the label's top
//   Recent / Expert dot -> across -> down onto the label's top
//   Selected Expert dot -> across -> UP to the label's bottom
// Same route in both frames, but the two frames are not scaled copies of each
// other (mobile's labels sit lower, its Recent/Expert boxes are cut
// differently, Expert Access's label is 8px further out), so each callout
// carries one geometry per breakpoint (`d` from desktop's 234x480 image
// scaled by 200/234, `m` read off mobile's native 200x410) and the Callout
// swaps them at `md`, where the row layout itself switches. A `path` is the
// polyline of axis-aligned points, dot first, drawn as dashed segments.
const IMG_W = 200;
const IMG_H = 410;

interface Geometry {
  box: { left: number; top: number; width: number; height: number };
  label: { left: number; top: number };
  path: [number, number][];
}

interface CalloutProps {
  d: Geometry;
  m: Geometry;
  eyebrow: string;
  value: string;
}

function Leader({ g, className }: { g: Geometry; className: string }) {
  const [dot, ...rest] = g.path;
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div
        className="absolute rounded-sm border border-text-error bg-text-error/[0.16]"
        style={{
          left: g.box.left,
          top: g.box.top,
          width: g.box.width,
          height: g.box.height,
        }}
      />
      {rest.map(([x, y], i) => {
        const [px, py] = i === 0 ? dot : rest[i - 1];
        const vertical = px === x;
        return (
          <div
            key={i}
            className={`absolute border-text-error/60 border-dashed ${vertical ? "border-l" : "border-t"}`}
            style={{
              left: Math.min(px, x),
              top: Math.min(py, y),
              width: vertical ? 0 : Math.abs(x - px),
              height: vertical ? Math.abs(y - py) : 0,
            }}
          />
        );
      })}
      <div
        className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-error"
        style={{ left: dot[0], top: dot[1] }}
      />
    </div>
  );
}

function Callout({ d, m, eyebrow, value }: CalloutProps) {
  const label = (g: Geometry, className: string) => (
    <div
      className={`absolute flex flex-col gap-8px whitespace-nowrap ${className}`}
      style={{ left: g.label.left, top: g.label.top }}
    >
      <span className="font-mono text-[13px] text-text-muted uppercase tracking-[0.78px]">
        {eyebrow}
      </span>
      <span className="whitespace-pre-line font-ui font-medium text-[14px] text-text-primary tracking-[0.07px]">
        {value}
      </span>
    </div>
  );
  return (
    <>
      <Leader g={m} className="md:hidden" />
      <Leader g={d} className="hidden md:block" />
      {label(m, "md:hidden")}
      {label(d, "hidden md:flex")}
    </>
  );
}

function Screenshot({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute left-0 top-0 overflow-hidden rounded-2xl border-4 border-bg-surface dark:border-text-muted shadow-[0_0_2.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent),0_0_0.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] dark:shadow-none"
      style={{ width: IMG_W, height: IMG_H }}
    >
      {children}
    </div>
  );
}

export default function ProblemSlide() {
  return (
    <section
      id="problem"
      className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-bg-primary md:overflow-hidden"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col gap-32px px-20px pt-32px pb-0 md:gap-0 md:px-80px md:pt-[calc(var(--fr-header-h,0px)+48px)]">
        <div className="flex w-full max-w-[904px] flex-col items-start gap-24px">
          <span className="font-mono text-[13px] text-text-error uppercase tracking-[0.78px]">
            The Problem
          </span>
          <h2 className="w-full font-display text-text-primary text-slide-title-sm md:text-slide-title">
            Chat was the Product
          </h2>
          <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
            The product was a chat thread, with real expertise sitting
            behind a static sidebar. No home screen surfaced it, no preview
            showed what an expert could do, and no reason existed for most
            users to go looking in the first place.
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-40px pt-32px pb-32px md:flex-row md:flex-wrap md:justify-center md:gap-x-48px md:gap-y-40px md:pt-56px">
          {/* Expert Access — the hamburger menu is the only, hidden way in. */}
          <div
            className="relative w-[350px] shrink-0 md:w-[364px]"
            style={{ height: IMG_H }}
          >
            <Screenshot>
              <Image
                src="/images/ultraai/ua-problem-expert-access.webp"
                alt=""
                fill
                className="object-cover"
              />
            </Screenshot>
            <Callout
              d={{
                box: { left: -14, top: 21, width: 227, height: 27 },
                label: { left: 224, top: 177 },
                path: [[21, 52], [21, 81], [264, 81], [264, 163]],
              }}
              m={{
                box: { left: -7, top: 20, width: 214, height: 32 },
                label: { left: 232, top: 172 },
                path: [[21, 55], [21, 90], [302, 90], [302, 163]],
              }}
              eyebrow="Expert Access"
              value={"Hidden /\nOne tap deeper"}
            />
          </div>

          {/* Recent Chats + Expert List — both ranked above actual experts. */}
          <div
            className="relative w-[350px] shrink-0 md:w-[364px]"
            style={{ height: IMG_H }}
          >
            <Screenshot>
              <Image
                src="/images/ultraai/ua-problem-sidebar.webp"
                alt=""
                fill
                className="object-cover"
              />
            </Screenshot>
            <Callout
              d={{
                box: { left: -14, top: 76, width: 227, height: 109 },
                label: { left: 224, top: 120 },
                path: [[216, 90], [268, 90], [268, 108]],
              }}
              m={{
                box: { left: -9, top: 76, width: 217, height: 128 },
                label: { left: 224, top: 174 },
                path: [[215, 105], [310, 105], [310, 163]],
              }}
              eyebrow="Recent Chats"
              value="Ranked first"
            />
            <Callout
              d={{
                box: { left: -14, top: 202, width: 227, height: 127 },
                label: { left: 224, top: 253 },
                path: [[216, 216], [268, 216], [268, 243]],
              }}
              m={{
                box: { left: -9, top: 223, width: 217, height: 106 },
                label: { left: 224, top: 330 },
                path: [[215, 253], [310, 253], [310, 320]],
              }}
              eyebrow="Expert List"
              value="Ranked second"
            />
          </div>

          {/* Selected expert — same chatbox, different paint only. */}
          <div
            className="relative w-[350px] shrink-0 md:w-[364px]"
            style={{ height: IMG_H }}
          >
            <Screenshot>
              <video
                src="/images/ultraai/ua-problem-selected-expert.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            </Screenshot>
            <Callout
              d={{
                box: { left: -14, top: 246, width: 227, height: 170 },
                label: { left: 224, top: 177 },
                path: [[214, 348], [277, 348], [277, 247]],
              }}
              m={{
                box: { left: -10, top: 315, width: 221, height: 105 },
                label: { left: 224, top: 172 },
                path: [[218, 367], [281, 367], [281, 249]],
              }}
              eyebrow="Selected Expert"
              value={"Same chatbox /\nDifferent paint"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
