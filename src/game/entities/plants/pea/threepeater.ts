import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { addShots, createPeashot, ShotDirection } from "../../shots";
import { createPlantId, syncPlantHitbox } from "../plant-service";
import { drawHitbox } from "@/game/helpers/hitbox";
import { PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/vector";

export type Threepeater = {
  type: PlantType.Threepeater;
  shotTimer: number;
} & BasePlant;

type CreateThreepeaterOptions = Vector2;

const HEALTH = 300;
const SUNCOST = 325;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

export const ThreepeaterInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/pea/threepeater/Threepeater.png";

export function createThreepeater(
  options: CreateThreepeaterOptions
): Threepeater {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Threepeater,
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

export function drawThreepeater(
  threepeater: Threepeater,
  options: PlantDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(threepeater.x),
    Math.round(threepeater.y),
    threepeater.width,
    threepeater.height
  );

  drawHitbox(threepeater.hitbox, board);
}

export function updateThreepeater(
  threepeater: Threepeater,
  options: PlantUpdateOptions
) {
  const { deltaTime, level } = options;

  threepeater.shotTimer += deltaTime;

  if (threepeater.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = level.zombies.some((zombie) => {
      return zombie.x <= threepeater.x + RANGE;
    });

    if (ableToShoot) {
      level.shots = addShots(
        level.shots,
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y,
        }),
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y,
          direction: ShotDirection.UpRight,
        }),
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y,
          direction: ShotDirection.DownRight,
        })
      );
    }

    threepeater.shotTimer = 0;
  }

  syncPlantHitbox(threepeater);
}
