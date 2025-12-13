export const ZOMBIE_WIDTH = 96;
export const ZOMBIE_HEIGHT = 96;

export const ZombieType = {
  Normal: "NormalZombie",
  Flag: "FlagZombie",
} as const;

export type ZombieType = (typeof ZombieType)[keyof typeof ZombieType];

export const ZombieState = {
  Walking: "WALKING",
  Eating: "EATING",
} as const;

export type ZombieState = (typeof ZombieState)[keyof typeof ZombieState];
