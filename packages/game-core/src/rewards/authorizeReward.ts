import type { Reward } from "@worldforge/types";

// Server-side reward authorization — blueprint Section 25: rewards are never
// client-trusted. This function is the single choke point every reward path
// (quest completion, event completion, badge claim) must call before an
// OwnedAsset/XP/reputation grant is persisted.

export type RewardClaim = {
  playerId: string;
  questId: string;
  objectiveIdsCompleted: string[];
};

export type QuestRewardPolicy = {
  questId: string;
  requiredObjectiveIds: string[];
  rewards: Reward[];
  /** Idempotency guard: claims already granted for this player+quest. */
  alreadyGranted: (playerId: string, questId: string) => boolean;
};

export type AuthorizationResult =
  | { granted: true; rewards: Reward[] }
  | { granted: false; reason: "already_claimed" | "objectives_incomplete" | "unknown_quest" };

export function authorizeReward(
  claim: RewardClaim,
  policy: QuestRewardPolicy,
): AuthorizationResult {
  if (policy.questId !== claim.questId) {
    return { granted: false, reason: "unknown_quest" };
  }

  if (policy.alreadyGranted(claim.playerId, claim.questId)) {
    return { granted: false, reason: "already_claimed" };
  }

  const completed = new Set(claim.objectiveIdsCompleted);
  const allComplete = policy.requiredObjectiveIds.every((id) => completed.has(id));

  if (!allComplete) {
    return { granted: false, reason: "objectives_incomplete" };
  }

  return { granted: true, rewards: policy.rewards };
}
