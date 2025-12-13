import { plantHelpers } from "./plant-helpers";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "./constants";
import { hitboxActions } from "@/game/helpers/hitbox";

import type {
  Plant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/types/vector";

type Sunflower = {
  rechargeTimer: number;
} & Plant;

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

function drawSunflower(options: PlantDrawOptions<Sunflower>) {
  const { plant, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(options);
  plantHelpers.drawPlantType(options);

  hitboxActions.draw(plant.hitbox, board);
}

function updateSunflower(options: PlantUpdateOptions<Sunflower>) {
  const { plant, game, deltaTime } = options;

  plant.rechargeTimer += deltaTime;

  if (plant.rechargeTimer >= RECHARGE_INTERVAL) {
    game.sun += SUN_PRODUCTION;
    plant.rechargeTimer = 0;
  }

  plantHelpers.syncPlantHitbox(options);
}

function sunflowerTakeDamage(options: PlantTakeDamageOptions<Sunflower>) {
  const { plant, damage } = options;

  plant.toughness -= damage;
}

export { createSunflower, drawSunflower, updateSunflower, sunflowerTakeDamage };
export type { Sunflower };
