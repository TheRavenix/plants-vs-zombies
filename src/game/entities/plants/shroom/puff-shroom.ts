import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createShroomshot } from "../../shots";
import { createPlantId, drawPlantRect, drawPlantType } from "../service";
import { createHitbox } from "@/game/features/hitbox";
import { PLANT_HEIGHT, PLANT_WIDTH } from "../constants";
import { PlantType } from "../constants/plant-type";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/features/health";
import { createPosition } from "@/game/features/position";

import type { Vector2 } from "@/game/types/math";
import type { BasePlant, PlantInfoType } from "../types";
import type { LevelContext } from "@/game/level";

export interface Puffshroom extends BasePlant {
  readonly type: PlantType.Puffshroom;
  readonly shotTimer: number;
}

type Options = {
  ctx: LevelContext;
} & Vector2;

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
  let shotTimer = 0;

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
    shotTimer += deltaTime;

    if (shotTimer >= SHOT_INTERVAL) {
      const ableToShoot = ctx.zombies.some((zombie) => {
        return (
          position.y >= zombie.position.y &&
          position.y <= zombie.position.y + TILE_HEIGHT &&
          zombie.position.x <= position.x + RANGE
        );
      });

      if (ableToShoot) {
        ctx.addShot(
          createShroomshot({
            x: position.x + size.width,
            y: position.y,
            ctx,
          }),
        );
      }

      shotTimer = 0;
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
    get shotTimer() {
      return shotTimer;
    },
    draw,
    update,
  };
}
