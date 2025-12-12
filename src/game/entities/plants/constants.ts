export const PLANT_WIDTH = 96;
export const PLANT_HEIGHT = 96;

export const PlantName = {
  Peashooter: "peashooter",
  Sunflower: "sunflower",
  Repeater: "repeater",
} as const;

export type PlantName = (typeof PlantName)[keyof typeof PlantName];
