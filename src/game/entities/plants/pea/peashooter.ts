import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { addShot, createPeashot } from "../../shots";
import { drawHitbox } from "@/game/helpers/hitbox";
import { createPlantId, syncPlantHitbox } from "../plant-service";
import { PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/math";

export type Peashooter = {
  type: PlantType.Peashooter;
  shotTimer: number;
} & BasePlant;

type CreatePeashooterOptions = Vector2;

const HEALTH = 300;
const SUNCOST = 0;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const COOLDOWN = 0;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

export const PeashooterInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/pea/peashooter/Peashooter.png";

export function createPeashooter(options: CreatePeashooterOptions): Peashooter {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Peashooter,
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

export function drawPeashooter(
  peashooter: Peashooter,
  options: PlantDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(peashooter.x),
    Math.round(peashooter.y),
    peashooter.width,
    peashooter.height
  );

  drawHitbox(peashooter.hitbox, board);
}

export function updatePeashooter(
  peashooter: Peashooter,
  options: PlantUpdateOptions
) {
  const { deltaTime, level } = options;

  peashooter.shotTimer += deltaTime;

  if (peashooter.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = level.zombies.some((zombie) => {
      return (
        peashooter.y >= zombie.y &&
        peashooter.y <= zombie.y + TILE_HEIGHT &&
        zombie.x <= peashooter.x + RANGE
      );
    });

    if (ableToShoot) {
      level.shots = addShot(
        level.shots,
        createPeashot({
          x: peashooter.x + peashooter.width,
          y: peashooter.y,
        })
      );
    }

    peashooter.shotTimer = 0;
  }

  syncPlantHitbox(peashooter);
}
