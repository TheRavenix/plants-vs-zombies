import { createHitbox } from "@/game/entities/features/hitbox";
import { createPlantId, drawPlantRect, drawPlantType } from "../../service";
import { PLANT_HEIGHT, PLANT_WIDTH } from "../../constants";
import { PlantType } from "../../constants/plant-type";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { createTimer, TimerType, type Timer } from "../../../features/timer";
import {
  createEventTimer,
  type EventTimer,
} from "../../../features/event-timer";
import { createSpawnSunEvent } from "@/game/events";

import type { BasePlant, PlantInfoType, PlantOptions } from "../../types";
import type { Board } from "@/game/board";
import type { GameEvent } from "@/game/events/types";

export interface Sunshroom extends BasePlant {
  readonly type: PlantType.Sunshroom;
  readonly rechargeEventTimer: EventTimer;
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
const SPRITE_PATH = "";

export const SunshroomInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpritePath: SPRITE_PATH,
  Cooldown: COOLDOWN,
};

export function createSunshroom(options: Options): Sunshroom {
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
  const rechargeEventTimer = createEventTimer({
    maxTime: RECHARGE_INTERVAL,
    events: [
      createSpawnSunEvent({
        x: position.x + size.width / 2,
        y: position.y,
        amount: getSunProduction(),
      }),
    ],
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
    let events: GameEvent[] = [];

    hitbox.position.set(position.x, position.y);

    const rechargeEvents = rechargeEventTimer.update(deltaTime);

    if (events !== undefined) {
      events = [...events, ...rechargeEvents];
    }

    upgradeTimer.update(deltaTime);

    return events;
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
    get rechargeEventTimer() {
      return rechargeEventTimer;
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
