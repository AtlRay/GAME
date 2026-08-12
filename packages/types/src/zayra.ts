// Zayra AI architecture contracts — blueprint Section 27.

export type ZayraResponseMode =
  | "ambient"
  | "hint"
  | "tutorial"
  | "creator"
  | "social"
  | "lore";

export type ZayraChatRequest = {
  playerId: string;
  message: string;
  mode?: ZayraResponseMode;
};

export type ZayraChatResponse = {
  mode: ZayraResponseMode;
  message: string;
  suggestedActions?: string[];
};
