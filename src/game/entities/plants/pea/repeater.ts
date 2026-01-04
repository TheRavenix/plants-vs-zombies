import { addShots, createPeashot } from "../../shots";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
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

export type Repeater = {
  type: PlantType.Repeater;
  shotTimer: number;
} & BasePlant;

type CreateRepeaterOptions = Vector2;

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

export function createRepeater(options: CreateRepeaterOptions): Repeater {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Repeater,
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

export function drawRepeater(repeater: Repeater, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(repeater.x),
    Math.round(repeater.y),
    repeater.width,
    repeater.height
  );

  drawHitbox(repeater.hitbox, board);
}

export function updateRepeater(
  repeater: Repeater,
  options: PlantUpdateOptions
) {
  const { deltaTime, game } = options;

  repeater.shotTimer += deltaTime;

  if (repeater.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return (
        repeater.y >= zombie.y &&
        repeater.y <= zombie.y + TILE_HEIGHT &&
        zombie.x <= repeater.x + RANGE
      );
    });

    if (ableToShoot) {
      game.shots = addShots(
        game.shots,
        createPeashot({
          x: repeater.x + repeater.width,
          y: repeater.y,
        }),
        createPeashot({
          x: repeater.x + repeater.width + TILE_WIDTH / 2,
          y: repeater.y,
        })
      );
    }

    repeater.shotTimer = 0;
  }

  syncPlantHitbox(repeater);
}
