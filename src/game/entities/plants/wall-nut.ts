import { plantHelpers } from "./plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "./constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/types/vector";

type WallNut = {
  type: PlantType.WallNut;
} & BasePlant;

type CreateWallNutOptions = Vector2;

const TOUGHNESS = 4000;
const SUNCOST = 50;

function createWallNut(options: CreateWallNutOptions): WallNut {
  const { x, y } = options;
  return {
    type: PlantType.WallNut,
    id: plantHelpers.createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    toughness: TOUGHNESS,
    sunCost: SUNCOST,
    hitbox: {
      x,
      y,
      width: PLANT_WIDTH,
      height: PLANT_HEIGHT,
    },
  };
}

function drawWallNut(wallNut: WallNut, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(wallNut, options);
  plantHelpers.drawPlantType(wallNut, options);

  hitboxActions.draw(wallNut.hitbox, board);
}

function updateWallNut(wallNut: WallNut, _options: PlantUpdateOptions) {
  plantHelpers.syncPlantHitbox(wallNut);
}

function wallNutTakeDamage(wallNut: WallNut, options: PlantTakeDamageOptions) {
  const { damage } = options;

  wallNut.toughness -= damage;
}

export { createWallNut, drawWallNut, updateWallNut, wallNutTakeDamage };
export type { WallNut };
