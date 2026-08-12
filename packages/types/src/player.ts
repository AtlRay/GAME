// Core data model — blueprint Section 24.

export type AvatarConfig = {
  presetId: string;
  primaryColor: string;
  accentColor: string;
};

export type Player = {
  id: string;
  authUserId: string;
  displayName: string;
  avatarConfig: AvatarConfig;
  level: number;
  xp: number;
  reputation: number;
  crewId?: string;
  suiAddress?: string;
  createdAt: string;
  lastSeenAt: string;
};

export type Crew = {
  id: string;
  name: string;
  slug: string;
  emblem: string;
  ownerId: string;
  visibility: "public" | "private" | "invite";
  reputation: number;
  baseWorldId?: string;
};

export type QuestCategory =
  | "story"
  | "explore"
  | "social"
  | "build"
  | "combat"
  | "sui"
  | "creator";

export type QuestObjective = {
  id: string;
  description: string;
  completed: boolean;
};

export type Reward = {
  type: "xp" | "reputation" | "forgeCredits" | "cosmetic" | "onchainBadge";
  amount?: number;
  assetId?: string;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  prerequisites: string[];
  objectives: QuestObjective[];
  rewards: Reward[];
};

export type PortalGame = {
  id: string;
  slug: string;
  title: string;
  studio: string;
  suiProject: boolean;
  launchUrl?: string;
  embedded: boolean;
  status: "draft" | "review" | "live" | "disabled";
  tags: string[];
  featuredUntil?: string;
};

export type OwnedAsset = {
  id: string;
  playerId: string;
  assetType: string;
  source: "offchain" | "sui";
  objectId?: string;
  metadata: Record<string, unknown>;
};
