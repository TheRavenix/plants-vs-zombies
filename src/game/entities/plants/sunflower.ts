import { plantHelpers } from "./plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";

import { PlantType } from "./constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/types/vector";

type Sunflower = {
  type: PlantType.Sunflower;
  rechargeTimer: number;
} & BasePlant;

type CreateSunflowerOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 50;
const SUN_PRODUCTION = 25;
const RECHARGE_INTERVAL = 1000 * 24;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SUNFLOWER_SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

SUNFLOWER_SPRITE_IMAGE.src = "./plants/sunflower/Sunflower.png";

function createSunflower(options: CreateSunflowerOptions): Sunflower {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Sunflower,
    id: plantHelpers.createPlantId(),
    x,
    y,
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    toughness: TOUGHNESS,
    sunCost: SUNCOST,
    hitbox: {
      x,
      y,
      width: SPRITE_WIDTH,
      height: SPRITE_HEIGHT,
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

  ctx.drawImage(
    SUNFLOWER_SPRITE_IMAGE,
    Math.round(sunflower.x),
    Math.round(sunflower.y),
    sunflower.width,
    sunflower.height
  );

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
export { SUNFLOWER_SPRITE_IMAGE };
export type { Sunflower };
