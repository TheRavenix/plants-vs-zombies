import { ShotType } from "../../shots";
import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createPlantId } from "../service";
import { createHitbox } from "@/game/entities/features/hitbox";
import { PlantType } from "../constants/plant-type";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { findFirstCollision } from "../../helpers/collision";
import { getOrLoadImage } from "@/game/assets";
import {
  createDespawnShotEvent,
  createSpawnShotEvent,
} from "@/game/level/events";

import type { BasePlant, PlantInfoType, PlantOptions } from "../types";
import type { Shot } from "../../shots/types/shot";
import type { LevelEvent } from "@/game/level/events/types";

export interface Torchwood extends BasePlant {
  readonly type: PlantType.Torchwood;
}

type Options = {
  getShots(): Shot[];
} & PlantOptions;

const TYPE = PlantType.Torchwood as const;
const HEALTH = 300;
const SUNCOST = 175;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_PATH = "./plants/torchwood/Torchwood.png";

export const TorchwoodInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpritePath: SPRITE_PATH,
  Cooldown: COOLDOWN,
};

export function createTorchwood(options: Options): Torchwood {
  const { getShots } = options;
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

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    ctx.drawImage(
      getOrLoadImage(SPRITE_PATH),
      Math.round(position.x),
      Math.round(position.y),
      size.width,
      size.height,
    );
    hitbox.draw(board);
  }

  function update(_deltaTime: number) {
    const events: LevelEvent[] = [];

    hitbox.position.set(position.x, position.y);

    const shot = findFirstCollision(hitbox, getShots(), (shot) => shot.hitbox);

    if (shot !== undefined && shot.type === ShotType.Peashot) {
      events.push(
        createDespawnShotEvent({
          id: shot.id,
        }),
        createSpawnShotEvent({
          type: ShotType.FirepeaShot,
          x: shot.position.x,
          y: shot.position.y,
          direction: shot.direction,
        }),
      );
    }

    return events;
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
