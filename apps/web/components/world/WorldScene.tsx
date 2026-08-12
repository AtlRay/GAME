"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { Chachy } from "./Chachy";
import { ChachyHud } from "./ChachyHud";
import { FollowCamera } from "./FollowCamera";
import { FoundersCityBlockout } from "./FoundersCityBlockout";
import { Ground } from "./Ground";
import { PlayerController, type PlayerHandle } from "./PlayerController";
import { ZayraPanel } from "./ZayraPanel";

export function WorldScene() {
  const playerHandle = useRef<PlayerHandle>({
    position: new THREE.Vector3(0, 0, 0),
    facing: 0,
    isMoving: false,
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh" }}>
      <Canvas shadows camera={{ fov: 55, near: 0.1, far: 300 }}>
        <color attach="background" args={["#05060c"]} />
        <fog attach="fog" args={["#05060c", 20, 90]} />
        <ambientLight intensity={0.35} color="#3d3a66" />
        <directionalLight
          position={[20, 30, 10]}
          intensity={1.1}
          color="#d4af6a"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[0, 6, 0]} intensity={0.6} color="#35e6ff" />

        <Physics gravity={[0, -18, 0]}>
          <Ground />
          <FoundersCityBlockout />
          <PlayerController handleRef={playerHandle} />
        </Physics>

        <Chachy handleRef={playerHandle} />
        <FollowCamera handleRef={playerHandle} />
      </Canvas>

      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 20,
          fontSize: 12,
          color: "rgba(255,255,255,0.55)",
          background: "rgba(8,9,16,0.6)",
          padding: "6px 10px",
          borderRadius: 6,
        }}
      >
        WASD / Arrow keys to move — Founders City (blockout)
      </div>

      <ChachyHud />
      <ZayraPanel />
    </div>
  );
}
