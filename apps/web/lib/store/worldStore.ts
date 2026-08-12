"use client";

import { ChachyStateMachine, track } from "@worldforge/game-core";
import type { ChachySignal, ChachyState } from "@worldforge/types";
import { create } from "zustand";

// One FSM instance lives for the life of the browser tab; the store only
// mirrors its current state for React so components can subscribe/rerender.
const chachyFsm = new ChachyStateMachine("IDLE");

type WorldStore = {
  chachyState: ChachyState;
  sendChachySignal: (signal: ChachySignal) => void;
};

export const useWorldStore = create<WorldStore>((set) => ({
  chachyState: chachyFsm.getState(),
  sendChachySignal: (signal) => {
    const previous = chachyFsm.getState();
    const next = chachyFsm.send(signal);
    if (next !== previous) {
      track("companion_state_changed", { from: previous, to: next, signal });
      set({ chachyState: next });
    }
  },
}));
