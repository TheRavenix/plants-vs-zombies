import { TILE_WIDTH, type Board } from "@/game/board";
import { createShroomshot } from "../../shots";
import { createPlantId, drawPlantRect, drawPlantType } from "../service";
import { createHitbox } from "@/game/entities/features/hitbox";
import { PLANT_HEIGHT, PLANT_WIDTH } from "../constants";
import { PlantType } from "../constants/plant-type";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { createPosition } from "@/game/features/position";
import { createShooter } from "../features/shooter";

import type { BasePlant, PlantInfoType, PlantOptions } from "../types";

export interface Puffshroom extends BasePlant {
  readonly type: PlantType.Puffshroom;
}

type Options = PlantOptions;

const TYPE = PlantType.Puffshroom as const;
const HEALTH = 300;
const SUNCOST = 0;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 4;
const COOLDOWN = 7500;
const SPRITE_IMAGE = new Image();

export const PuffshroomInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

export function createPuffshroom(options: Options): Puffshroom {
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
  const shooter = createShooter({
    shotInterval: SHOT_INTERVAL,
    position,
    range: RANGE,
    store,
    onShoot() {
      actions.addShot(
        createShroomshot({
          x: position.x + size.width,
          y: position.y,
          store,
        }),
      );
    },
  });

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    drawPlantRect(position, size, "#E6E6FA", board);
    drawPlantType(TYPE, position, size, health, board);

    hitbox.draw(board);
  }

  function update(deltaTime: number) {
    shooter.update(deltaTime);
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
    draw,
    update,
  };
}
