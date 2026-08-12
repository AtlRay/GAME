"use client";

import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const MOVE_SPEED = 6;
const TURN_SPEED = 10;

const keys = { forward: false, back: false, left: false, right: false };

function bindKeys() {
  const down = (e: KeyboardEvent) => setKey(e.code, true);
  const up = (e: KeyboardEvent) => setKey(e.code, false);
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
  };
}

function setKey(code: string, value: boolean) {
  if (code === "KeyW" || code === "ArrowUp") keys.forward = value;
  if (code === "KeyS" || code === "ArrowDown") keys.back = value;
  if (code === "KeyA" || code === "ArrowLeft") keys.left = value;
  if (code === "KeyD" || code === "ArrowRight") keys.right = value;
}

export type PlayerHandle = {
  position: THREE.Vector3;
  facing: number;
  isMoving: boolean;
};

export function PlayerController({
  handleRef,
}: {
  handleRef: React.MutableRefObject<PlayerHandle>;
}) {
  const body = useRef<RapierRigidBody>(null);
  const facing = useRef(0);

  useEffect(() => bindKeys(), []);

  useFrame((_, delta) => {
    const rb = body.current;
    if (!rb) return;

    const moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    const moveZ = (keys.back ? 1 : 0) - (keys.forward ? 1 : 0);
    const moving = moveX !== 0 || moveZ !== 0;

    const linvel = rb.linvel();

    if (moving) {
      const targetAngle = Math.atan2(moveX, moveZ);
      const diff = THREE.MathUtils.euclideanModulo(
        targetAngle - facing.current + Math.PI,
        Math.PI * 2,
      ) - Math.PI;
      facing.current += diff * Math.min(1, TURN_SPEED * delta);

      const dir = new THREE.Vector3(
        Math.sin(facing.current),
        0,
        Math.cos(facing.current),
      );
      rb.setLinvel(
        { x: dir.x * MOVE_SPEED, y: linvel.y, z: dir.z * MOVE_SPEED },
        true,
      );
    } else {
      rb.setLinvel({ x: 0, y: linvel.y, z: 0 }, true);
    }

    const t = rb.translation();
    handleRef.current.position.set(t.x, t.y, t.z);
    handleRef.current.facing = facing.current;
    handleRef.current.isMoving = moving;
  });

  return (
    <RigidBody
      ref={body}
      colliders="hull"
      mass={1}
      lockRotations
      position={[0, 2, 0]}
      friction={0.2}
    >
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial
          color="#1c2030"
          emissive="#35e6ff"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </RigidBody>
  );
}
