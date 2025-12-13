export const SHOT_WIDTH = 32;
export const SHOT_HEIGHT = 32;

export const ShotType = {
  Peashot: "Peashot",
} as const;

export type ShotType = (typeof ShotType)[keyof typeof ShotType];
