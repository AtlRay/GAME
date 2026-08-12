"use client";

import { track } from "@worldforge/game-core";
import type { ZayraChatResponse } from "@worldforge/types";
import { useState } from "react";

const DEMO_PLAYER_ID = "demo-player";

export function ZayraPanel() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{ from: "you" | "zayra"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setHistory((h) => [...h, { from: "you", text: trimmed }]);
    setMessage("");
    setLoading(true);
    track("zayra_interaction", { messageLength: trimmed.length }, DEMO_PLAYER_ID);

    try {
      const res = await fetch("/api/zayra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: DEMO_PLAYER_ID, message: trimmed }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data: ZayraChatResponse = await res.json();
      setHistory((h) => [...h, { from: "zayra", text: data.message }]);
    } catch {
      setHistory((h) => [
        ...h,
        { from: "zayra", text: "Signal's a little rough right now — try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 20 }}>
      {open && (
        <div
          style={{
            width: 300,
            maxHeight: 360,
            marginBottom: 12,
            background: "rgba(8,9,16,0.92)",
            border: "1px solid rgba(139,92,246,0.4)",
            borderRadius: 12,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ fontWeight: 600, color: "#8b5cf6", fontSize: 13 }}>
            ZAYRA
          </div>
          <div style={{ overflowY: "auto", maxHeight: 200, display: "flex", flexDirection: "column", gap: 6 }}>
            {history.length === 0 && (
              <div style={{ opacity: 0.6, fontSize: 13 }}>
                Ask about a quest, Chachy, or what to do next.
              </div>
            )}
            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  alignSelf: h.from === "you" ? "flex-end" : "flex-start",
                  color: h.from === "you" ? "#35e6ff" : "#e8e9f0",
                  textAlign: h.from === "you" ? "right" : "left",
                }}
              >
                {h.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            style={{ display: "flex", gap: 6 }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Zayra..."
              style={{
                flex: 1,
                background: "#0d0f18",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#fff",
                fontSize: 13,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                background: "#8b5cf6",
                color: "#fff",
                fontSize: 13,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "…" : "Send"}
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          border: "1px solid rgba(139,92,246,0.5)",
          borderRadius: 999,
          padding: "10px 18px",
          background:
            "linear-gradient(90deg, rgba(53,230,255,0.15), rgba(139,92,246,0.3))",
          color: "#fff",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {open ? "Close Zayra" : "Ask Zayra"}
      </button>
    </div>
  );
}
