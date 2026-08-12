// Chachy state machine contracts — blueprint Section 28.

export type ChachyState =
  | "IDLE"
  | "FOLLOW"
  | "SCOUT"
  | "ALERT"
  | "TRACK"
  | "COMBAT"
  | "DOWNED"
  | "CELEBRATE"
  | "INTERACT"
  | "SLEEP";

export type ChachySignal =
  | "hiddenObjectNearby"
  | "enemyThreat"
  | "friendNearby"
  | "crewMemberNearby"
  | "questTrail"
  | "rareResource"
  | "playerLowHealth"
  | "homeZone"
  | "worldEvent"
  | "playerMoved"
  | "playerIdle"
  | "threatCleared";

export type ChachySnapshot = {
  state: ChachyState;
  updatedAt: string;
};
