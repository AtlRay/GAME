import { describe, expect, it } from "vitest";
import { authorizeReward, type QuestRewardPolicy } from "../rewards/authorizeReward";

const basePolicy: QuestRewardPolicy = {
  questId: "quest-1",
  requiredObjectiveIds: ["obj-a", "obj-b"],
  rewards: [{ type: "xp", amount: 100 }],
  alreadyGranted: () => false,
};

describe("authorizeReward", () => {
  it("denies a claim for a quest the policy does not recognize", () => {
    const result = authorizeReward(
      { playerId: "p1", questId: "wrong-quest", objectiveIdsCompleted: ["obj-a", "obj-b"] },
      basePolicy,
    );
    expect(result).toEqual({ granted: false, reason: "unknown_quest" });
  });

  it("denies a claim with incomplete objectives", () => {
    const result = authorizeReward(
      { playerId: "p1", questId: "quest-1", objectiveIdsCompleted: ["obj-a"] },
      basePolicy,
    );
    expect(result).toEqual({ granted: false, reason: "objectives_incomplete" });
  });

  it("denies a claim the player already redeemed, even if objectives are complete", () => {
    const policy: QuestRewardPolicy = {
      ...basePolicy,
      alreadyGranted: () => true,
    };
    const result = authorizeReward(
      { playerId: "p1", questId: "quest-1", objectiveIdsCompleted: ["obj-a", "obj-b"] },
      policy,
    );
    expect(result).toEqual({ granted: false, reason: "already_claimed" });
  });

  it("grants the policy's rewards when objectives are complete and unclaimed", () => {
    const result = authorizeReward(
      { playerId: "p1", questId: "quest-1", objectiveIdsCompleted: ["obj-a", "obj-b", "obj-c"] },
      basePolicy,
    );
    expect(result).toEqual({ granted: true, rewards: basePolicy.rewards });
  });

  it("never trusts a client-supplied reward list — only the server policy's rewards are returned", () => {
    // The claim type has no `rewards` field at all, so authorizeReward
    // structurally cannot echo back a client-chosen reward — it can only
    // ever return policy.rewards.
    const result = authorizeReward(
      { playerId: "p1", questId: "quest-1", objectiveIdsCompleted: ["obj-a", "obj-b"] },
      basePolicy,
    );
    expect(result.granted && result.rewards).toBe(basePolicy.rewards);
  });
});
