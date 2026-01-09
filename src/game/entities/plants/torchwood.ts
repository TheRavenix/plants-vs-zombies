import { addShot, createFirepeaShot, removeShotById, ShotType } from "../shots";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { createPlantId, syncPlantHitbox } from "./plant-service";
import { drawHitbox, isHitboxColliding } from "@/game/helpers/hitbox";
import { PlantType } from "./constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/types/vector";

export type Torchwood = {
  type: PlantType.Torchwood;
} & BasePlant;

type CreateTorchwoodOptions = Vector2;

const HEALTH = 300;
const SUNCOST = 175;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

export const TorchwoodInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/torchwood/Torchwood.png";

export function createTorchwood(options: CreateTorchwoodOptions): Torchwood {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Torchwood,
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
  };
}

export function drawTorchwood(torchwood: Torchwood, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(torchwood.x),
    Math.round(torchwood.y),
    torchwood.width,
    torchwood.height
  );

  drawHitbox(torchwood.hitbox, board);
}

export function updateTorchwood(
  torchwood: Torchwood,
  options: PlantUpdateOptions
) {
  const { level } = options;

  const shot = level.shots.find((shot) => {
    return isHitboxColliding(torchwood.hitbox, shot.hitbox);
  });

  if (shot !== undefined) {
    if (shot.type === ShotType.Peashot) {
      level.shots = removeShotById(level.shots, shot.id);
      level.shots = addShot(
        level.shots,
        createFirepeaShot({
          x: shot.x,
          y: shot.y,
          direction: shot.direction,
        })
      );
    }
  }

  syncPlantHitbox(torchwood);
}
