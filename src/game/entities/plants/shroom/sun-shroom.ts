import { createHitbox } from "@/game/entities/features/hitbox";
import { createPlantId, drawPlantRect, drawPlantType } from "../service";
import { PLANT_HEIGHT, PLANT_WIDTH } from "../constants";
import { PlantType } from "../constants/plant-type";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { createTimer, TimerType, type Timer } from "../../features/timer";
import { createSun } from "../../sun";

import type { BasePlant, PlantInfoType, PlantOptions } from "../types";
import type { Board } from "@/game/board";

export interface Sunshroom extends BasePlant {
  readonly type: PlantType.Sunshroom;
  readonly rechargeTimer: Timer;
  readonly upgradeTimer: Timer;
  readonly upgraded: boolean;
}

type Options = PlantOptions;

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
  const { store } = options;
  const { actions } = store;
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
  const rechargeTimer = createTimer({
    maxTime: RECHARGE_INTERVAL,
    onReady() {
      actions.addSun(
        createSun({
          x: position.x + size.width / 2,
          y: position.y,
          amount: getSunProduction(),
        }),
      );
    },
  });
  const upgradeTimer = createTimer({
    maxTime: UPGRADE_TIMEOUT,
    defaultType: TimerType.Timeout,
    onReady() {
      upgrade();
    },
  });
  let upgraded = false;

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
    hitbox.position.set(position.x, position.y);
    rechargeTimer.update(deltaTime);
    upgradeTimer.update(deltaTime);
  }

  function upgrade() {
    upgraded = true;
  }

  function getSunProduction() {
    return upgraded ? SUN_PRODUCTION_2 : SUN_PRODUCTION_1;
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
    get upgradeTimer() {
      return upgradeTimer;
    },
    get upgraded() {
      return upgraded;
    },
    draw,
    update,
  };
}
