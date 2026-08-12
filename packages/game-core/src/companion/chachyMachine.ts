import type { ChachySignal, ChachyState } from "@worldforge/types";

// Deterministic Chachy state machine — blueprint Section 28.
// Pure function core so it is server/client identical and unit-testable
// without any rendering or timing dependency.

type Transition = Partial<Record<ChachySignal, ChachyState>>;

// Precedence: entries listed first win when multiple signals arrive in the
// same tick, so danger/tracking signals always outrank idle/follow ones.
const TRANSITIONS: Record<ChachyState, Transition> = {
  IDLE: {
    enemyThreat: "ALERT",
    hiddenObjectNearby: "SCOUT",
    questTrail: "TRACK",
    playerMoved: "FOLLOW",
    homeZone: "SLEEP",
  },
  FOLLOW: {
    enemyThreat: "ALERT",
    hiddenObjectNearby: "SCOUT",
    rareResource: "SCOUT",
    questTrail: "TRACK",
    friendNearby: "CELEBRATE",
    crewMemberNearby: "CELEBRATE",
    playerIdle: "IDLE",
    homeZone: "SLEEP",
  },
  SCOUT: {
    enemyThreat: "ALERT",
    threatCleared: "FOLLOW",
    playerMoved: "FOLLOW",
  },
  ALERT: {
    playerLowHealth: "COMBAT",
    worldEvent: "COMBAT",
    threatCleared: "FOLLOW",
  },
  TRACK: {
    enemyThreat: "ALERT",
    threatCleared: "FOLLOW",
    playerMoved: "TRACK",
  },
  COMBAT: {
    playerLowHealth: "DOWNED",
    threatCleared: "CELEBRATE",
  },
  DOWNED: {
    threatCleared: "IDLE",
  },
  CELEBRATE: {
    playerMoved: "FOLLOW",
    playerIdle: "IDLE",
  },
  INTERACT: {
    playerMoved: "FOLLOW",
    playerIdle: "IDLE",
  },
  SLEEP: {
    enemyThreat: "ALERT",
    playerMoved: "FOLLOW",
    friendNearby: "INTERACT",
  },
};

export function nextChachyState(
  current: ChachyState,
  signal: ChachySignal,
): ChachyState {
  const transition = TRANSITIONS[current];
  return transition[signal] ?? current;
}

export class ChachyStateMachine {
  private state: ChachyState;

  constructor(initial: ChachyState = "IDLE") {
    this.state = initial;
  }

  getState(): ChachyState {
    return this.state;
  }

  send(signal: ChachySignal): ChachyState {
    this.state = nextChachyState(this.state, signal);
    return this.state;
  }
}
