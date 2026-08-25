"use client";

import { useEffect, useRef } from "react";

// Subtle red aurora wash — a real WebGL fragment shader (via `ogl`), not a
// CSS approximation, per direct instruction after confirming the
// lightswind.com/components/aurora-shader reference is itself WebGL-based
// (ogl/WebGL/Shader found in its own bundle when fetched directly). This
// shader is hand-authored (flowing noise-perturbed band, vertical fade),
// not reverse-engineered from that reference's minified source — inspired
// by, not copied from. Colors come from this project's own red primitives
// (design-tokens.json primitive.color.red.600/.400), not the reference's
// literal values.
//
// `ogl` (~30kb) needs `npm install ogl` — this sandbox couldn't reach
// registry.npmjs.org to install it directly (unpkg/jsdelivr and general
// web access both work fine from here, so this reads as a deliberate
// package-registry restriction, not a general network outage). Loaded via
// a dynamic `import("ogl")` inside the mount effect rather than a static
// import, so this decorative effect's WebGL dependency doesn't sit in the
// critical bundle for every route — but note `tsc --noEmit` still needs
// `ogl` resolvable in node_modules to type-check this file either way (it
// ships its own types), so it'll show an error on this one file until the
// install actually happens.
interface AuroraShaderProps {
  className?: string;
}

const RED_600 = [0xc0 / 255, 0x39 / 255, 0x2b / 255] as const; // primitive.color.red.600 #C0392B
const RED_400 = [0xe0 / 255, 0x68 / 255, 0x5a / 255] as const; // primitive.color.red.400 #E0685A

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.05;

    float band = sin(uv.x * 3.0 + t * 2.0) * 0.15;
    band += noise(vec2(uv.x * 3.0, t)) * 0.25;
    float y = uv.y - (0.62 + band);
    float glow = smoothstep(0.35, 0.0, abs(y));

    float verticalFade = smoothstep(1.0, 0.15, uv.y);
    float alpha = glow * verticalFade * 0.55;

    vec3 color = mix(uColor2, uColor1, uv.y);
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function AuroraShader({ className }: AuroraShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let cancelled = false;
    let cleanup = () => {};

    import("ogl").then(({ Renderer, Program, Mesh, Triangle }) => {
      if (cancelled || !container) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      container.appendChild(gl.canvas);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: RED_600 },
          uColor2: { value: RED_400 },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      };
      resize();
      window.addEventListener("resize", resize);

      let rafId = 0;
      const renderFrame = (time: number) => {
        rafId = requestAnimationFrame(renderFrame);
        program.uniforms.uTime.value = time * 0.001;
        renderer.render({ scene: mesh });
      };

      if (prefersReducedMotion) {
        renderer.render({ scene: mesh });
      } else {
        rafId = requestAnimationFrame(renderFrame);
      }

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        if (gl.canvas.parentElement === container) {
          container.removeChild(gl.canvas);
        }
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
