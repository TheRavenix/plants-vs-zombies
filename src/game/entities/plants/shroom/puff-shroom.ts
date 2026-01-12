import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { addShot, createShroomshot, SHOT_HEIGHT } from "../../shots";
import {
  createPlantId,
  drawPlantRect,
  drawPlantType,
  syncPlantHitbox,
} from "../plant-service";
import { drawHitbox } from "@/game/helpers/hitbox";
import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/math";

export type Puffshroom = {
  type: PlantType.Puffshroom;
  shotTimer: number;
} & BasePlant;

type CreatePuffshroomOptions = Vector2;

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

export function createPuffshroom(options: CreatePuffshroomOptions): Puffshroom {
  const { x, y } = options;
  return {
    type: PlantType.Puffshroom,
    id: createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    health: HEALTH,
    sunCost: SUNCOST,
    shotTimer: 0,
    hitbox: {
      x,
      y,
      width: PLANT_WIDTH,
      height: PLANT_HEIGHT,
    },
  };
}

export function drawPuffshroom(
  puffshroom: Puffshroom,
  options: PlantDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawPlantRect(puffshroom, {
    ...options,
    fillStyle: "#E6E6FA",
  });
  drawPlantType(puffshroom, options);
  drawHitbox(puffshroom.hitbox, board);
}

export function updatePuffshroom(
  puffshroom: Puffshroom,
  options: PlantUpdateOptions
) {
  const { deltaTime, level } = options;

  puffshroom.shotTimer += deltaTime;

  if (puffshroom.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = level.zombies.some((zombie) => {
      return (
        puffshroom.y >= zombie.y &&
        puffshroom.y <= zombie.y + TILE_HEIGHT &&
        zombie.x <= puffshroom.x + RANGE
      );
    });

    if (ableToShoot) {
      level.shots = addShot(
        level.shots,
        createShroomshot({
          x: puffshroom.x + puffshroom.width,
          y: puffshroom.y + SHOT_HEIGHT / 2,
        })
      );
    }

    puffshroom.shotTimer = 0;
  }

  syncPlantHitbox(puffshroom);
}
