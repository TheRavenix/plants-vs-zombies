import { addSun, createSun, SUN_SPRITE_WIDTH } from "../sun";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { createPlantId, syncPlantHitbox } from "./plant-service";
import { drawHitbox } from "@/game/helpers/hitbox";
import { PlantType } from "./constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/types/vector";
import type { Game } from "@/game/game";

export type Sunflower = {
  type: PlantType.Sunflower;
  rechargeTimer: number;
} & BasePlant;

type CreateSunflowerOptions = {
  game: Game;
} & Vector2;

const HEALTH = 300;
const SUNCOST = 50;
const SUN_PRODUCTION = 25;
const RECHARGE_INTERVAL = 1000 * 24;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

export const SunflowerInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/sunflower/Sunflower.png";

export function createSunflower(options: CreateSunflowerOptions): Sunflower {
  const { game } = options;
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  game.suns = addSun(
    game.suns,
    createSun({
      x: x + SUN_SPRITE_WIDTH / 2,
      y: y,
      amount: SUN_PRODUCTION,
    })
  );

  return {
    type: PlantType.Sunflower,
    id: createPlantId(),
    x,
    y,
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    health: HEALTH,
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

export function drawSunflower(sunflower: Sunflower, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(sunflower.x),
    Math.round(sunflower.y),
    sunflower.width,
    sunflower.height
  );

  drawHitbox(sunflower.hitbox, board);
}

export function updateSunflower(
  sunflower: Sunflower,
  options: PlantUpdateOptions
) {
  const { game, deltaTime } = options;

  sunflower.rechargeTimer += deltaTime;

  if (sunflower.rechargeTimer >= RECHARGE_INTERVAL) {
    game.suns = addSun(
      game.suns,
      createSun({
        x: sunflower.x + SUN_SPRITE_WIDTH / 2,
        y: sunflower.y,
        amount: SUN_PRODUCTION,
      })
    );
    sunflower.rechargeTimer = 0;
  }

  syncPlantHitbox(sunflower);
}
