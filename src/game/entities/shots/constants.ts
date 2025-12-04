export const SHOT_WIDTH = 32;
export const SHOT_HEIGHT = 32;

export const ShotName = {
  Peashot: "peashot",
} as const;

export type ShotName = (typeof ShotName)[keyof typeof ShotName];
