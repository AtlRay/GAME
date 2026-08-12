// Telemetry event contracts — blueprint Section 31.

export type TelemetryEventName =
  | "world_entered"
  | "tutorial_completed"
  | "first_social_connection"
  | "companion_state_changed"
  | "zayra_interaction"
  | "reward_claim_attempted"
  | "reward_claim_denied"
  | "reward_claim_granted";

export type TelemetryEvent = {
  name: TelemetryEventName;
  playerId?: string;
  timestamp: string;
  properties?: Record<string, unknown>;
};
