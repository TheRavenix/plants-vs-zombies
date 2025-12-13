import { plantHelpers } from "../plant-helpers";
import { createPeashot, SHOT_HEIGHT, shotActions } from "../../shots";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "../constants";
import { TILE_WIDTH } from "@/game/board";
import { hitboxActions } from "@/game/helpers/hitbox";

import type {
  Peashooter,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/vector";

type CreatePeashooterOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 100;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 6;

function createPeashooter(options: CreatePeashooterOptions): Peashooter {
  const { x, y } = options;
  return {
    type: PlantType.Peashooter,
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

function drawPeashooter(peashooter: Peashooter, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  peashooter.shotTimer;

  plantHelpers.drawPlantRect(peashooter, options);
  plantHelpers.drawPlantType(peashooter, options);

  hitboxActions.draw(peashooter.hitbox, board);
}

function updatePeashooter(peashooter: Peashooter, options: PlantUpdateOptions) {
  const { deltaTime, game } = options;

  peashooter.shotTimer += deltaTime;

  if (peashooter.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return peashooter.y === zombie.y && zombie.x <= peashooter.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShot(
        game.shots,
        createPeashot({
          x: peashooter.x + peashooter.width,
          y: peashooter.y + SHOT_HEIGHT / 2,
        })
      );
    }

    peashooter.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(peashooter);
}

function peashooterTakeDamage(
  peashooter: Peashooter,
  options: PlantTakeDamageOptions
) {
  const { damage } = options;

  peashooter.toughness -= damage;
}

export {
  createPeashooter,
  drawPeashooter,
  updatePeashooter,
  peashooterTakeDamage,
};
