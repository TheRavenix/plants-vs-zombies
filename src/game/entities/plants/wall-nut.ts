import { drawHitbox } from "@/game/helpers/hitbox";
import {
  createPlantId,
  drawPlantRect,
  drawPlantType,
  syncPlantHitbox,
} from "./plant-service";
import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "./constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/types/math";

export type WallNut = {
  type: PlantType.WallNut;
} & BasePlant;

type CreateWallNutOptions = Vector2;

const HEALTH = 4000;
const SUNCOST = 50;
const COOLDOWN = 1000 * 20;
const SPRITE_IMAGE = new Image();

export const WallNutInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

export function createWallNut(options: CreateWallNutOptions): WallNut {
  const { x, y } = options;
  return {
    type: PlantType.WallNut,
    id: createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    health: HEALTH,
    sunCost: SUNCOST,
    hitbox: {
      x,
      y,
      width: PLANT_WIDTH,
      height: PLANT_HEIGHT,
    },
  };
}

export function drawWallNut(wallNut: WallNut, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawPlantRect(wallNut, options);
  drawPlantType(wallNut, options);
  drawHitbox(wallNut.hitbox, board);
}

export function updateWallNut(wallNut: WallNut, _options: PlantUpdateOptions) {
  syncPlantHitbox(wallNut);
}
