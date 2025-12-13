import { plantHelpers } from "./plant-helpers";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "./constants";
import { hitboxActions } from "@/game/helpers/hitbox";

import type {
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
  Sunflower,
} from "./types";
import type { Vector2 } from "@/game/types/vector";

type CreateSunflowerOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 50;
const SUN_PRODUCTION = 25;
const RECHARGE_INTERVAL = 7500;

function createSunflower(options: CreateSunflowerOptions): Sunflower {
  const { x, y } = options;
  return {
    type: PlantType.Sunflower,
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
    rechargeTimer: 0,
  };
}

function drawSunflower(sunflower: Sunflower, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  sunflower.rechargeTimer;

  plantHelpers.drawPlantRect(sunflower, options);
  plantHelpers.drawPlantType(sunflower, options);

  hitboxActions.draw(sunflower.hitbox, board);
}

function updateSunflower(sunflower: Sunflower, options: PlantUpdateOptions) {
  const { game, deltaTime } = options;

  sunflower.rechargeTimer += deltaTime;

  if (sunflower.rechargeTimer >= RECHARGE_INTERVAL) {
    game.sun += SUN_PRODUCTION;
    sunflower.rechargeTimer = 0;
  }

  plantHelpers.syncPlantHitbox(sunflower);
}

function sunflowerTakeDamage(
  sunflower: Sunflower,
  options: PlantTakeDamageOptions
) {
  const { damage } = options;

  sunflower.toughness -= damage;
}

export { createSunflower, drawSunflower, updateSunflower, sunflowerTakeDamage };
