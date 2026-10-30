// Finds where the video's final frame actually puts the name, so the flat
// vector logo underneath can be snapped onto it exactly. The two are drawn from
// the same lettering by different tools (video: ribbon-shaded render, vector:
// flat outline), so "roughly the same" on paper reads as a shift at the swap.
//
// Two steps. (1) A trimmed-bounding-box guess, which is close but biased: the
// video's shaded folds fall under the ink threshold on one side only. (2) A
// registration: render the vector at candidate (scale, x, y) and keep the one
// whose silhouette overlaps the video's the most (intersection over union).
// Overlap is not fooled by shading the way an edge/box measurement is.

const LUMA = 110;
const TRIM = 0.003;

interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

function inkBox(img: ImageData): Box | null {
  const { width: w, height: h, data } = img;
  const cols = new Float64Array(w);
  const rows = new Float64Array(h);
  let total = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4] > LUMA) {
        cols[x]++;
        rows[y]++;
        total++;
      }
    }
  }
  if (total < 100) return null;
  const edge = (arr: Float64Array, frac: number) => {
    const goal = total * frac;
    let acc = 0;
    for (let i = 0; i < arr.length; i++) {
      acc += arr[i];
      if (acc >= goal) return i;
    }
    return arr.length - 1;
  };
  return {
    x0: edge(cols, TRIM),
    x1: edge(cols, 1 - TRIM),
    y0: edge(rows, TRIM),
    y1: edge(rows, 1 - TRIM),
  };
}

export interface VideoFit {
  /** Logo box width in real px on screen. */
  width: number;
  /** Logo box centre, in real px, relative to the video's centre. */
  dx: number;
  dy: number;
}

const VIDEO_LUMA = 80;

function maskOf(img: ImageData, thr: number): Uint8Array {
  const n = img.width * img.height;
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) out[i] = img.data[i * 4] > thr ? 1 : 0;
  return out;
}

/**
 * @param video   the splash video, ended on its final frame
 * @param pathD   the logo's SVG path data
 * @param logoW/H the logo path's own box (its viewBox)
 */
export function fitLogoToVideo(
  video: HTMLVideoElement,
  pathD: string,
  logoW: number,
  logoH: number,
): VideoFit | null {
  try {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh || !video.clientWidth) return null;

    // --- 1. bounding-box guess ------------------------------------------
    const vc = document.createElement("canvas");
    vc.width = vw;
    vc.height = vh;
    const vctx = vc.getContext("2d", { willReadFrequently: true });
    if (!vctx) return null;
    vctx.drawImage(video, 0, 0, vw, vh);
    const vb = inkBox(vctx.getImageData(0, 0, vw, vh));

    const S = 2;
    const sc = document.createElement("canvas");
    sc.width = logoW * S;
    sc.height = logoH * S;
    const sctx = sc.getContext("2d", { willReadFrequently: true });
    if (!sctx) return null;
    sctx.fillStyle = "#000";
    sctx.fillRect(0, 0, sc.width, sc.height);
    sctx.scale(S, S);
    sctx.fillStyle = "#fff";
    const path = new Path2D(pathD);
    sctx.fill(path);
    const sbRaw = inkBox(sctx.getImageData(0, 0, sc.width, sc.height));
    if (!vb || !sbRaw) return null;
    const sb = {
      x0: sbRaw.x0 / S,
      x1: sbRaw.x1 / S,
      y0: sbRaw.y0 / S,
      y1: sbRaw.y1 / S,
    };
    let k =
      ((vb.x1 - vb.x0) / (sb.x1 - sb.x0) + (vb.y1 - vb.y0) / (sb.y1 - sb.y0)) /
      2;
    let cx = (vb.x0 + vb.x1) / 2 + (logoW / 2 - (sb.x0 + sb.x1) / 2) * k;
    let cy = (vb.y0 + vb.y1) / 2 + (logoH / 2 - (sb.y0 + sb.y1) / 2) * k;

    // --- 2. overlap registration ----------------------------------------
    // k = video px per vector unit; (cx, cy) = vector box centre in video px.
    const stage = (r: number, steps: number[], mins: number[], cap: number) => {
      const w = Math.round(vw * r);
      const h = Math.round(vh * r);
      const a = document.createElement("canvas");
      a.width = w;
      a.height = h;
      const actx = a.getContext("2d", { willReadFrequently: true });
      const b = document.createElement("canvas");
      b.width = w;
      b.height = h;
      const bctx = b.getContext("2d", { willReadFrequently: true });
      if (!actx || !bctx) return;
      actx.drawImage(video, 0, 0, w, h);
      const V = maskOf(actx.getImageData(0, 0, w, h), VIDEO_LUMA);

      const score = (kk: number, x: number, y: number) => {
        bctx.setTransform(1, 0, 0, 1, 0, 0);
        bctx.fillStyle = "#000";
        bctx.fillRect(0, 0, w, h);
        bctx.setTransform(r * kk, 0, 0, r * kk, r * (x - (kk * logoW) / 2), r * (y - (kk * logoH) / 2));
        bctx.fillStyle = "#fff";
        bctx.fill(path);
        const d = bctx.getImageData(0, 0, w, h).data;
        let inter = 0;
        let uni = 0;
        for (let i = 0; i < V.length; i++) {
          const on = d[i * 4] > 127 ? 1 : 0;
          if (on && V[i]) inter++;
          if (on || V[i]) uni++;
        }
        return uni ? inter / uni : 0;
      };

      let best = score(k, cx, cy);
      let evals = 1;
      const st = [...steps];
      while (evals < cap && (st[0] > mins[0] || st[1] > mins[1])) {
        let improved = false;
        for (let p = 0; p < 3; p++) {
          for (const dir of [1, -1]) {
            const nk = p === 0 ? k + dir * st[0] : k;
            const nx = p === 1 ? cx + dir * st[1] : cx;
            const ny = p === 2 ? cy + dir * st[2] : cy;
            const sc2 = score(nk, nx, ny);
            evals++;
            if (sc2 > best) {
              best = sc2;
              k = nk;
              cx = nx;
              cy = ny;
              improved = true;
              break;
            }
          }
        }
        if (!improved) {
          st[0] /= 2;
          st[1] /= 2;
          st[2] /= 2;
        }
      }
    };
    stage(0.25, [k * 0.02, 4, 4], [k * 0.002, 0.5, 0.5], 70);
    stage(0.5, [k * 0.004, 1.5, 1.5], [k * 0.0004, 0.15, 0.15], 70);

    const f = video.clientWidth / vw; // video px -> screen px
    return {
      width: logoW * k * f,
      dx: (cx - vw / 2) * f,
      dy: (cy - vh / 2) * f,
    };
  } catch {
    // Tainted canvas / decode error: caller falls back to the Figma numbers.
    return null;
  }
}
