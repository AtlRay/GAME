"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PlayerHandle } from "./PlayerController";

const OFFSET = new THREE.Vector3(0, 3.2, 6.5);

export function FollowCamera({
  handleRef,
}: {
  handleRef: React.MutableRefObject<PlayerHandle>;
}) {
  const { camera } = useThree();
  const desired = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  useFrame((_, delta) => {
    const { position, facing } = handleRef.current;

    const rotatedOffset = OFFSET.clone().applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      facing,
    );
    desired.copy(position).add(rotatedOffset);

    camera.position.lerp(desired, Math.min(1, delta * 5));

    lookAt.copy(position).add(new THREE.Vector3(0, 1.2, 0));
    camera.lookAt(lookAt);
  });

  return null;
}
