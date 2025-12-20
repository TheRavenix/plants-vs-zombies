import { plantHelpers } from "../plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/vector";

type Sunshroom = {
  type: PlantType.Sunshroom;
  rechargeTimer: number;
  upgraded: boolean;
  upgradeTimer: number;
} & BasePlant;

type CreateSunshroomOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 25;
const SUN_PRODUCTION_1 = 15;
const SUN_PRODUCTION_2 = 25;
const RECHARGE_INTERVAL = 1000 * 24;
const UPGRADE_TIMEOUT = 1000 * 60 * 2;

function createSunshroom(options: CreateSunshroomOptions): Sunshroom {
  const { x, y } = options;
  return {
    type: PlantType.Sunshroom,
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
    upgraded: false,
    upgradeTimer: 0,
  };
}

function drawSunshroom(sunshroom: Sunshroom, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(sunshroom, options);
  plantHelpers.drawPlantType(sunshroom, options);

  hitboxActions.draw(sunshroom.hitbox, board);
}

function updateSunshroom(sunshroom: Sunshroom, options: PlantUpdateOptions) {
  const { game, deltaTime } = options;

  sunshroom.rechargeTimer += deltaTime;

  if (!sunshroom.upgraded) {
    sunshroom.upgradeTimer += deltaTime;
  }
  if (sunshroom.upgradeTimer >= UPGRADE_TIMEOUT && !sunshroom.upgraded) {
    sunshroom.upgraded = true;
  }
  if (sunshroom.rechargeTimer >= RECHARGE_INTERVAL) {
    game.sun += sunshroom.upgraded ? SUN_PRODUCTION_2 : SUN_PRODUCTION_1;
    sunshroom.rechargeTimer = 0;
  }

  plantHelpers.syncPlantHitbox(sunshroom);
}

function sunshroomTakeDamage(
  sunshroom: Sunshroom,
  options: PlantTakeDamageOptions
) {
  const { damage } = options;

  sunshroom.toughness -= damage;
}

export { createSunshroom, drawSunshroom, updateSunshroom, sunshroomTakeDamage };
export type { Sunshroom };
