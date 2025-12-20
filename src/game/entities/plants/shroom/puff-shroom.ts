import { TILE_WIDTH } from "@/game/board";
import { createShroomshot, SHOT_HEIGHT, shotActions } from "../../shots";

import { plantHelpers } from "../plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/vector";

type Puffshroom = {
  type: PlantType.Puffshroom;
  shotTimer: number;
} & BasePlant;

type CreatePuffshroomOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 0;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 4;

function createPuffshroom(options: CreatePuffshroomOptions): Puffshroom {
  const { x, y } = options;
  return {
    type: PlantType.Puffshroom,
    id: plantHelpers.createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    toughness: TOUGHNESS,
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

function drawPuffshroom(puffshroom: Puffshroom, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(puffshroom, {
    ...options,
    fillStyle: "#E6E6FA",
  });
  plantHelpers.drawPlantType(puffshroom, options);

  hitboxActions.draw(puffshroom.hitbox, board);
}

function updatePuffshroom(puffshroom: Puffshroom, options: PlantUpdateOptions) {
  const { deltaTime, game } = options;

  puffshroom.shotTimer += deltaTime;

  if (puffshroom.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return puffshroom.y === zombie.y && zombie.x <= puffshroom.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShot(
        game.shots,
        createShroomshot({
          x: puffshroom.x + puffshroom.width,
          y: puffshroom.y + SHOT_HEIGHT / 2,
        })
      );
    }

    puffshroom.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(puffshroom);
}

function puffshroomTakeDamage(
  puffshroom: Puffshroom,
  options: PlantTakeDamageOptions
) {
  const { damage } = options;

  puffshroom.toughness -= damage;
}

export {
  createPuffshroom,
  drawPuffshroom,
  updatePuffshroom,
  puffshroomTakeDamage,
};
export type { Puffshroom };
