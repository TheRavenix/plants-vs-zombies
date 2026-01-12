import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { addShot, createFirepeaShot } from "../../shots";
import { createPlantId, syncPlantHitbox } from "../plant-service";
import { drawHitbox } from "@/game/helpers/hitbox";
import { PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/math";

export type Firepea = {
  type: PlantType.Firepea;
  shotTimer: number;
} & BasePlant;

type CreateFirepeaOptions = Vector2;

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

export function createFirepea(options: CreateFirepeaOptions): Firepea {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Firepea,
    id: createPlantId(),
    x,
    y,
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    health: HEALTH,
    sunCost: SUNCOST,
    hitbox: {
      x,
      y,
      width: SPRITE_WIDTH,
      height: SPRITE_HEIGHT,
    },
    shotTimer: 0,
  };
}

export function drawFirepea(firepea: Firepea, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(firepea.x),
    Math.round(firepea.y),
    firepea.width,
    firepea.height
  );

  drawHitbox(firepea.hitbox, board);
}

export function updateFirepea(firepea: Firepea, options: PlantUpdateOptions) {
  const { deltaTime, level } = options;

  firepea.shotTimer += deltaTime;

  if (firepea.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = level.zombies.some((zombie) => {
      return (
        firepea.y >= zombie.y &&
        firepea.y <= zombie.y + TILE_HEIGHT &&
        zombie.x <= firepea.x + RANGE
      );
    });

    if (ableToShoot) {
      level.shots = addShot(
        level.shots,
        createFirepeaShot({
          x: firepea.x + firepea.width,
          y: firepea.y,
        })
      );
    }

    firepea.shotTimer = 0;
  }

  syncPlantHitbox(firepea);
}
