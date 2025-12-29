import {
  FIREPEA_SPRITE_IMAGE,
  PEASHOOTER_SPRITE_IMAGE,
  REPEATER_SPRITE_IMAGE,
  SNOWPEA_SPRITE_IMAGE,
  THREEPEATER_SPRITE_IMAGE,
} from "./pea";
import { SUNFLOWER_SPRITE_IMAGE } from "./sunflower";
import { TORCHWOOD_SPRITE_IMAGE } from "./torchwood";

export const PLANT_WIDTH = 96;
export const PLANT_HEIGHT = 96;

export enum PlantType {
  Peashooter = "Peashooter",
  Sunflower = "Sunflower",
  Repeater = "Repeater",
  Threepeater = "Threepeater",
  Snowpea = "Snowpea",
  WallNut = "WallNut",
  Puffshroom = "Puffshroom",
  Sunshroom = "Sunshroom",
  Torchwood = "Torchwood",
  Firepea = "Firepea",
}

export const PlantSpriteImage: Record<PlantType, HTMLImageElement> = {
  Peashooter: PEASHOOTER_SPRITE_IMAGE,
  Sunflower: SUNFLOWER_SPRITE_IMAGE,
  Repeater: REPEATER_SPRITE_IMAGE,
  Threepeater: THREEPEATER_SPRITE_IMAGE,
  Snowpea: SNOWPEA_SPRITE_IMAGE,
  Firepea: FIREPEA_SPRITE_IMAGE,
  WallNut: new Image(),
  Puffshroom: new Image(),
  Sunshroom: new Image(),
  Torchwood: TORCHWOOD_SPRITE_IMAGE,
} as const;
