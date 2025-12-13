import { plantHelpers } from "../plant-helpers";
import {
  createPeashot,
  PeashotDirection,
  SHOT_HEIGHT,
  shotActions,
} from "../../shots";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "../constants";
import { TILE_WIDTH } from "@/game/board";
import { hitboxActions } from "@/game/helpers/hitbox";

import type {
  Plant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/vector";

type Threepeater = {
  shotTimer: number;
} & Plant;

type CreateThreepeaterOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 100;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 6;

function createThreepeater(options: CreateThreepeaterOptions): Threepeater {
  const { x, y } = options;
  return {
    type: PlantType.Threepeater,
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

function drawThreepeater(options: PlantDrawOptions<Threepeater>) {
  const { plant, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(options);
  plantHelpers.drawPlantType(options);

  hitboxActions.draw(plant.hitbox, board);
}

function updateThreepeater(options: PlantUpdateOptions<Threepeater>) {
  const { deltaTime, plant, game } = options;

  plant.shotTimer += deltaTime;

  if (plant.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return zombie.x <= plant.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShots(
        game.shots,
        createPeashot({
          x: plant.x + plant.width,
          y: plant.y + SHOT_HEIGHT / 2,
        }),
        createPeashot({
          x: plant.x + plant.width,
          y: plant.y + SHOT_HEIGHT / 2,
          direction: PeashotDirection.UpRight,
        }),
        createPeashot({
          x: plant.x + plant.width,
          y: plant.y + SHOT_HEIGHT / 2,
          direction: PeashotDirection.DownRight,
        })
      );
    }

    plant.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(options);
}

function threepeaterTakeDamage(options: PlantTakeDamageOptions<Threepeater>) {
  const { plant, damage } = options;

  plant.toughness -= damage;
}

export {
  createThreepeater,
  drawThreepeater,
  updateThreepeater,
  threepeaterTakeDamage,
};
export type { Threepeater };
