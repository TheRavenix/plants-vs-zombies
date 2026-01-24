import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createFirepeaShot } from "../../shots";
import { createPlantId } from "../service";
import { createHitbox } from "@/game/entities/features/hitbox";
import { PlantType } from "../constants/plant-type";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { createShooter } from "../features/shooter";

import type { BasePlant, PlantInfoType } from "../types";
import type { Vector2 } from "@/game/types/math";
import type { LevelContext } from "@/game/level";

export interface Firepea extends BasePlant {
  readonly type: PlantType.Firepea;
}

type Options = {
  ctx: LevelContext;
} & Vector2;

const TYPE = PlantType.Firepea as const;
const HEALTH = 300;
const SUNCOST = 175;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

export const FirepeaInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/pea/firepea/Firepea.png";

export function createFirepea(options: Options): Firepea {
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
  const shooter = createShooter({
    shotInterval: SHOT_INTERVAL,
    position,
    range: RANGE,
    ctx,
    onShoot() {
      ctx.addShot(
        createFirepeaShot({
          x: position.x + size.width,
          y: position.y,
          ctx,
        }),
      );
    },
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
