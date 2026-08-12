"use client";

import { RigidBody } from "@react-three/rapier";

export function Ground() {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[200, 1, 200]} />
        <meshStandardMaterial color="#0a0c14" metalness={0.3} roughness={0.85} />
      </mesh>
    </RigidBody>
  );
}
