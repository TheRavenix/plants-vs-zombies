import { createSun, SUN_SPRITE_WIDTH } from "../sun";
import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createPlantId } from "./service";
import { createHitbox } from "@/game/features/hitbox";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/features/health";
import { PlantType } from "./constants/plant-type";

import type { BasePlant, PlantInfoType } from "./types";
import type { Vector2 } from "@/game/types/math";
import type { LevelContext } from "@/game/level";

export interface Sunflower extends BasePlant {
  readonly type: PlantType.Sunflower;
  readonly rechargeTimer: number;
}

type Options = {
  ctx: LevelContext;
} & Vector2;

const TYPE = PlantType.Sunflower as const;
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

export function createSunflower(options: Options): Sunflower {
  const { ctx } = options;
  const id = createPlantId();
  const position = createPosition({
    x: options.x + OFFSET_X,
    y: options.y + OFFSET_Y,
  });
  const size = createSize({
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
  });
  const health = createHealth({
    hp: HEALTH,
  });
  const hitbox = createHitbox({
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  });
  let rechargeTimer = 0;

  function generateSun() {
    ctx.addSun(
      createSun({
        x: position.x + SUN_SPRITE_WIDTH / 2,
        y: position.y,
        amount: SUN_PRODUCTION,
      }),
    );
  }

  generateSun();

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    ctx.drawImage(
      SPRITE_IMAGE,
      Math.round(position.x),
      Math.round(position.y),
      size.width,
      size.height,
    );
    hitbox.draw(board);
  }

  function update(deltaTime: number) {
    rechargeTimer += deltaTime;

    if (rechargeTimer >= RECHARGE_INTERVAL) {
      generateSun();
      rechargeTimer = 0;
    }

    hitbox.position.set(position.x, position.y);
  }

  return {
    get type() {
      return TYPE;
    },
    get id() {
      return id;
    },
    get position() {
      return position;
    },
    get size() {
      return size;
    },
    get health() {
      return health;
    },
    get sunCost() {
      return SUNCOST;
    },
    get hitbox() {
      return hitbox;
    },
    get rechargeTimer() {
      return rechargeTimer;
    },
    draw,
    update,
  };
}
