"use client";

import { useWorldStore } from "@/lib/store/worldStore";

// Debug/demo HUD proving the IDLE/FOLLOW/ALERT loop end-to-end without
// requiring a scripted enemy encounter yet (blueprint Section 28 combat
// signals arrive later in Phase 3).
export function ChachyHud() {
  const chachyState = useWorldStore((s) => s.chachyState);
  const sendChachySignal = useWorldStore((s) => s.sendChachySignal);

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontSize: 13,
      }}
    >
      <div
        style={{
          background: "rgba(8,9,16,0.85)",
          border: "1px solid rgba(53,230,255,0.35)",
          borderRadius: 8,
          padding: "6px 12px",
          color: "#35e6ff",
        }}
      >
        Chachy: {chachyState}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => sendChachySignal("enemyThreat")}
          style={hudButtonStyle}
        >
          Trigger Alert
        </button>
        <button
          onClick={() => sendChachySignal("threatCleared")}
          style={hudButtonStyle}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

const hudButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 6,
  padding: "4px 10px",
  background: "rgba(20,22,34,0.9)",
  color: "#fff",
  fontSize: 12,
  cursor: "pointer",
};
