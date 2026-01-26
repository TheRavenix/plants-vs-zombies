import { createSun, SUN_SPRITE_WIDTH } from "../sun";
import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createPlantId } from "./service";
import { createHitbox } from "@/game/entities/features/hitbox";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { PlantType } from "./constants/plant-type";
import { createTimer, type Timer } from "../features/timer";

import type { BasePlant, PlantInfoType, PlantOptions } from "./types";

export interface Sunflower extends BasePlant {
  readonly type: PlantType.Sunflower;
  readonly timer: Timer;
}

type Options = PlantOptions;

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
  const { store } = options;
  const { actions } = store;
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
  const timer = createTimer({
    maxTime: RECHARGE_INTERVAL,
    onReady() {
      generateSun();
    },
  });

  function generateSun() {
    actions.addSun(
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
    hitbox.position.set(position.x, position.y);
    timer.update(deltaTime);
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
    get timer() {
      return timer;
    },
    draw,
    update,
  };
}
