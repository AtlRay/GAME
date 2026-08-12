"use client";

import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

// Placeholder blockout only — greybox massing + mood lighting matching
// art/roster-and-ui/03-ingame-ui-founders-city.png (violet/cyan neon over a
// dark wet-city palette). Not final art; final geometry/materials come from
// the art pipeline (blueprint Section 29).
type Building = {
  position: [number, number, number];
  size: [number, number, number];
  accent: string;
};

function generateBuildings(): Building[] {
  const buildings: Building[] = [];
  const accents = ["#35e6ff", "#8b5cf6", "#5ce1ff"];
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };

  for (let ring = 0; ring < 3; ring++) {
    const radius = 18 + ring * 14;
    const count = 8 + ring * 4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.3;
      const height = 6 + rand() * 22;
      const width = 3 + rand() * 4;
      buildings.push({
        position: [Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius],
        size: [width, height, width],
        accent: accents[Math.floor(rand() * accents.length)] ?? "#35e6ff",
      });
    }
  }
  return buildings;
}

export function FoundersCityBlockout() {
  const buildings = useMemo(generateBuildings, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={b.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial
              color="#0d0f18"
              emissive={b.accent}
              emissiveIntensity={0.12}
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
