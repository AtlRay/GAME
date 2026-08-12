"use client";

import dynamic from "next/dynamic";

// Three.js/Rapier touch window/WebGL APIs that don't exist during SSR, so
// the whole scene is loaded client-only.
const WorldScene = dynamic(
  () => import("@/components/world/WorldScene").then((m) => m.WorldScene),
  { ssr: false },
);

export function WorldSceneLoader() {
  return <WorldScene />;
}
