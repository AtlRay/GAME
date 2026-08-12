"use client";

import dynamic from "next/dynamic";

// Three.js/Rapier touch window/WebGL APIs that don't exist during SSR —
// @react-three/fiber's reconciler genuinely cannot be evaluated on the
// server (confirmed: removing ssr:false makes `next build` fail with the
// same internals crash during static prerendering of /world). ssr:false is
// required. The webpack runtimeChunk fix in next.config.mjs addresses the
// separate client-side bug where this async chunk's copy of react-reconciler
// couldn't see the already-loaded 'react' module.
const WorldScene = dynamic(
  () => import("@/components/world/WorldScene").then((m) => m.WorldScene),
  { ssr: false },
);

export function WorldSceneLoader() {
  return <WorldScene />;
}
