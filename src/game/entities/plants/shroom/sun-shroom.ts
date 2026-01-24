import { createHitbox } from "@/game/entities/features/hitbox";
import { createPlantId, drawPlantRect, drawPlantType } from "../service";
import { PLANT_HEIGHT, PLANT_WIDTH } from "../constants";
import { PlantType } from "../constants/plant-type";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";

import type { BasePlant, PlantInfoType } from "../types";
import type { Vector2 } from "@/game/types/math";
import type { LevelContext } from "@/game/level";
import type { Board } from "@/game/board";

export interface Sunshroom extends BasePlant {
  readonly type: PlantType.Sunshroom;
  readonly rechargeTimer: number;
  readonly upgraded: boolean;
  readonly upgradeTimer: number;
}

type Options = {
  ctx: LevelContext;
} & Vector2;

const TYPE = PlantType.Sunshroom as const;
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

export function createSunshroom(options: Options): Sunshroom {
  const { ctx } = options;
  const id = createPlantId();
  const position = createPosition({
    x: options.x,
    y: options.y,
  });
  const size = createSize({
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
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
  let upgraded = false;
  let upgradeTimer = 0;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    drawPlantRect(position, size, undefined, board);
    drawPlantType(TYPE, position, size, health, board);

    hitbox.draw(board);
  }

  function update(deltaTime: number) {
    rechargeTimer += deltaTime;

    if (!upgraded) {
      upgradeTimer += deltaTime;
    }
    if (upgradeTimer >= UPGRADE_TIMEOUT && !upgraded) {
      upgraded = true;
    }
    if (rechargeTimer >= RECHARGE_INTERVAL) {
      ctx.setSunAmount(
        ctx.sunAmount + (upgraded ? SUN_PRODUCTION_2 : SUN_PRODUCTION_1),
      );
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
    get upgraded() {
      return upgraded;
    },
    get upgradeTimer() {
      return upgradeTimer;
    },
    draw,
    update,
  };
}
