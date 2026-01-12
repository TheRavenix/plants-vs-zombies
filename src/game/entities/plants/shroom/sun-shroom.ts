import { drawHitbox } from "@/game/helpers/hitbox";
import {
  createPlantId,
  drawPlantRect,
  drawPlantType,
  syncPlantHitbox,
} from "../plant-service";
import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/math";

export type Sunshroom = {
  type: PlantType.Sunshroom;
  rechargeTimer: number;
  upgraded: boolean;
  upgradeTimer: number;
} & BasePlant;

type CreateSunshroomOptions = Vector2;

const HEALTH = 300;
const SUNCOST = 25;
const SUN_PRODUCTION_1 = 15;
const SUN_PRODUCTION_2 = 25;
const RECHARGE_INTERVAL = 1000 * 24;
const UPGRADE_TIMEOUT = 1000 * 60 * 2;
const COOLDOWN = 7500;
const SPRITE_IMAGE = new Image();

export const SunshroomInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

export function createSunshroom(options: CreateSunshroomOptions): Sunshroom {
  const { x, y } = options;
  return {
    type: PlantType.Sunshroom,
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
    rechargeTimer: 0,
    upgraded: false,
    upgradeTimer: 0,
  };
}

export function drawSunshroom(sunshroom: Sunshroom, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawPlantRect(sunshroom, options);
  drawPlantType(sunshroom, options);
  drawHitbox(sunshroom.hitbox, board);
}

export function updateSunshroom(
  sunshroom: Sunshroom,
  options: PlantUpdateOptions
) {
  const { level, deltaTime } = options;

  sunshroom.rechargeTimer += deltaTime;

  if (!sunshroom.upgraded) {
    sunshroom.upgradeTimer += deltaTime;
  }
  if (sunshroom.upgradeTimer >= UPGRADE_TIMEOUT && !sunshroom.upgraded) {
    sunshroom.upgraded = true;
  }
  if (sunshroom.rechargeTimer >= RECHARGE_INTERVAL) {
    level.sunAmount += sunshroom.upgraded ? SUN_PRODUCTION_2 : SUN_PRODUCTION_1;
    sunshroom.rechargeTimer = 0;
  }

  syncPlantHitbox(sunshroom);
}
