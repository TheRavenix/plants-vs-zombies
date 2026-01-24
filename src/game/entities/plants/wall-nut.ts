import { createPlantId } from "./service";
import { PLANT_HEIGHT, PLANT_WIDTH } from "./constants";
import { PlantType } from "./constants/plant-type";
import { createHitbox } from "@/game/entities/features/hitbox";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";

import type { Board } from "@/game/board";
import type { BasePlant, PlantInfoType } from "./types";
import type { Vector2 } from "@/game/types/math";
import type { LevelContext } from "@/game/level";

export interface WallNut extends BasePlant {
  type: PlantType.WallNut;
}

type Options = {
  ctx: LevelContext;
} & Vector2;

const TYPE = PlantType.WallNut as const;
const HEALTH = 4000;
const SUNCOST = 50;
const COOLDOWN = 1000 * 20;
const SPRITE_IMAGE = new Image();

export const WallNutInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

export function createWallNut(options: Options): WallNut {
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

  function update(_deltaTime: number) {
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
