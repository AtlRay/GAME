import type { ZayraChatRequest, ZayraChatResponse } from "@worldforge/types";

// Adapter interface so a real LLM-backed Zayra orchestrator can be dropped
// in later (server-side only — see blueprint Section 27) without touching
// the route handler or any client code. Never call a model API with a key
// from client code; this file only ever runs on the server.
export interface ZayraAdapter {
  respond(request: ZayraChatRequest): Promise<ZayraChatResponse>;
}

// Mock adapter: deterministic, no external calls, safe default when
// ZAYRA_MODEL_API_KEY is not configured. Keeps dialogue short per the
// blueprint's "keep dialogue short in active gameplay" rule.
export class MockZayraAdapter implements ZayraAdapter {
  async respond(request: ZayraChatRequest): Promise<ZayraChatResponse> {
    const text = request.message.toLowerCase();

    if (text.includes("chachy")) {
      return {
        mode: "lore",
        message:
          "Chachy tracks what I can't see from here — stay close in the Wild Grid.",
      };
    }

    if (text.includes("quest") || text.includes("what do i do")) {
      return {
        mode: "hint",
        message:
          "Head toward the light past the plaza. Someone there needs a hand.",
        suggestedActions: ["Open quest log", "Mark waypoint"],
      };
    }

    if (text.includes("sui") || text.includes("wallet") || text.includes("crypto")) {
      return {
        mode: "tutorial",
        message:
          "You don't need any of that to play. Ask again once you've claimed your first badge.",
      };
    }

    return {
      mode: "ambient",
      message: "I'm here if you need a direction. No pressure.",
    };
  }
}

let adapter: ZayraAdapter | null = null;

export function getZayraAdapter(): ZayraAdapter {
  if (!adapter) {
    // ZAYRA_MODEL_API_KEY is intentionally unused by MockZayraAdapter today.
    // A real adapter reads it here, server-side only, when introduced.
    adapter = new MockZayraAdapter();
  }
  return adapter;
}
