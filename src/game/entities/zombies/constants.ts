export const ZOMBIE_WIDTH = 96;
export const ZOMBIE_HEIGHT = 96;

export const ZombieName = {
  Normal: "normal_zombie",
  Flag: "flag_zombie",
} as const;

export type ZombieName = (typeof ZombieName)[keyof typeof ZombieName];
