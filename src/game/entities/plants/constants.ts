export const PLANT_WIDTH = 96;
export const PLANT_HEIGHT = 96;

export const PlantType = {
  Peashooter: "Peashooter",
  Sunflower: "Sunflower",
  Repeater: "Repeater",
  Threepeater: "Threepeater",
} as const;

export type PlantType = (typeof PlantType)[keyof typeof PlantType];
