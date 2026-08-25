// Ambient stub for `ogl` so the production build type-checks without the
// package installed. AuroraShader.tsx does a dynamic `import("ogl")` for a
// decorative WebGL wash, but that component is not yet wired into any rendered
// tree (it's referenced only in comments), and `ogl` is not in package.json —
// so this declares the module as `any` to silence TS2307 ("Cannot find module
// 'ogl'") without disabling type-checking anywhere else. Remove this once
// `npm install ogl` is run and AuroraShader is actually mounted, so the
// package's own types apply.
declare module "ogl";
