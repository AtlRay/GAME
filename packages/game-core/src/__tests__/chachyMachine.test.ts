import { describe, expect, it } from "vitest";
import { ChachyStateMachine, nextChachyState } from "../companion/chachyMachine";

describe("nextChachyState", () => {
  it("starts IDLE and follows the player on movement", () => {
    expect(nextChachyState("IDLE", "playerMoved")).toBe("FOLLOW");
  });

  it("goes to ALERT on enemy threat from FOLLOW", () => {
    expect(nextChachyState("FOLLOW", "enemyThreat")).toBe("ALERT");
  });

  it("escalates ALERT to COMBAT when the player is low health", () => {
    expect(nextChachyState("ALERT", "playerLowHealth")).toBe("COMBAT");
  });

  it("goes DOWNED from COMBAT when the player drops low again", () => {
    expect(nextChachyState("COMBAT", "playerLowHealth")).toBe("DOWNED");
  });

  it("returns to FOLLOW once a threat clears from COMBAT", () => {
    expect(nextChachyState("COMBAT", "threatCleared")).toBe("CELEBRATE");
  });

  it("ignores signals it has no transition for and stays put", () => {
    expect(nextChachyState("SLEEP", "rareResource")).toBe("SLEEP");
  });

  it("does not teleport: unhandled signals never jump state", () => {
    expect(nextChachyState("DOWNED", "playerMoved")).toBe("DOWNED");
  });
});

describe("ChachyStateMachine", () => {
  it("tracks state across a realistic signal sequence", () => {
    const fsm = new ChachyStateMachine();
    expect(fsm.getState()).toBe("IDLE");

    expect(fsm.send("playerMoved")).toBe("FOLLOW");
    expect(fsm.send("hiddenObjectNearby")).toBe("SCOUT");
    expect(fsm.send("enemyThreat")).toBe("ALERT");
    expect(fsm.send("playerLowHealth")).toBe("COMBAT");
    expect(fsm.send("threatCleared")).toBe("CELEBRATE");
    expect(fsm.send("playerIdle")).toBe("IDLE");
  });

  it("can be constructed with a non-default initial state", () => {
    const fsm = new ChachyStateMachine("SLEEP");
    expect(fsm.getState()).toBe("SLEEP");
    expect(fsm.send("friendNearby")).toBe("INTERACT");
  });
});
