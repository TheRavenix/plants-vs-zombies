import { createPeashot } from "../../shots";
import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createPlantId } from "../plant-service";
import { PlantType } from "../constants/plant-type";
import { createHitbox } from "@/game/features/hitbox";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/features/health";

import type { BasePlant, PlantInfoType } from "../types";
import type { Vector2 } from "@/game/types/math";
import type { LevelContext } from "@/game/level";

export interface Repeater extends BasePlant {
  readonly type: PlantType.Repeater;
  readonly shotTimer: number;
}

type Options = {
  ctx: LevelContext;
} & Vector2;

const TYPE = PlantType.Repeater as const;
const HEALTH = 300;
const SUNCOST = 200;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

export const RepeaterInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/pea/repeater/Repeater.png";

export function createRepeater(options: Options): Repeater {
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
  let shotTimer = 0;

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
          createPeashot({
            x: position.x + size.width,
            y: position.y,
            ctx,
          }),
          createPeashot({
            x: position.x + size.width + TILE_WIDTH / 2,
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
