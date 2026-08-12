"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useWorldStore } from "@/lib/store/worldStore";
import type { PlayerHandle } from "./PlayerController";

// Placeholder Chachy mesh: obsidian body + violet eye/vein glow, matching
// the direction in art/chachy/turnaround-action-poses.png. Final mesh
// comes from the art pipeline (blueprint Section 29) — this proves the
// state machine (IDLE/FOLLOW/ALERT, blueprint Section 28) drives visible
// behavior, not the final model.
const FOLLOW_OFFSET = new THREE.Vector3(-1.4, 0, 1.6);
const IDLE_TIMEOUT = 1.2;

export function Chachy({
  handleRef,
}: {
  handleRef: React.MutableRefObject<PlayerHandle>;
}) {
  const group = useRef<THREE.Group>(null);
  const eyeMatRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const idleTimer = useRef(0);
  const wasMoving = useRef(false);

  const chachyState = useWorldStore((s) => s.chachyState);
  const sendChachySignal = useWorldStore((s) => s.sendChachySignal);

  useEffect(() => {
    sendChachySignal("homeZone");
  }, [sendChachySignal]);

  useFrame((_, delta) => {
    const { position, facing, isMoving } = handleRef.current;

    if (isMoving && !wasMoving.current) {
      sendChachySignal("playerMoved");
      idleTimer.current = 0;
    } else if (!isMoving) {
      idleTimer.current += delta;
      if (idleTimer.current > IDLE_TIMEOUT && wasMoving.current) {
        sendChachySignal("playerIdle");
      }
    }
    wasMoving.current = isMoving;

    const g = group.current;
    if (!g) return;

    if (chachyState === "SLEEP" || chachyState === "IDLE") {
      // Stay put near home; don't teleport (blueprint Section 28).
    } else {
      const rotatedOffset = FOLLOW_OFFSET.clone().applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        facing,
      );
      const target = position.clone().add(rotatedOffset);
      g.position.lerp(target, Math.min(1, delta * 4));
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, facing, Math.min(1, delta * 4));
    }

    const alertPulse = chachyState === "ALERT" || chachyState === "COMBAT";
    const intensity = alertPulse
      ? 1.2 + Math.sin(performance.now() / 120) * 0.6
      : chachyState === "SLEEP"
        ? 0.15
        : 0.8;
    for (const mat of eyeMatRefs.current) {
      if (mat) mat.emissiveIntensity = intensity;
    }
  });

  return (
    <group ref={group} position={[-1.4, 0.35, 1.6]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.28, 0.5, 4, 8]} />
        <meshStandardMaterial color="#0b0b10" metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.35, -0.35]} castShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#0b0b10" metalness={0.75} roughness={0.35} />
      </mesh>
      {[-0.07, 0.07].map((x, i) => (
        <mesh key={x} position={[x, 0.42, -0.5]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) eyeMatRefs.current[i] = m;
            }}
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
