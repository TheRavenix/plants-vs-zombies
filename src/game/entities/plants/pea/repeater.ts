import { plantHelpers } from "../plant-helpers";
import { createPeashot, SHOT_HEIGHT, shotActions } from "../../shots";

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

type Repeater = {
  shotTimer: number;
} & Plant;

type CreateRepeaterOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 100;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 6;

function createRepeater(options: CreateRepeaterOptions): Repeater {
  const { x, y } = options;
  return {
    type: PlantType.Repeater,
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

function drawRepeater(options: PlantDrawOptions<Repeater>) {
  const { plant, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(options);
  plantHelpers.drawPlantType(options);

  hitboxActions.draw(plant.hitbox, board);
}

function updateRepeater(options: PlantUpdateOptions<Repeater>) {
  const { deltaTime, plant, game } = options;

  plant.shotTimer += deltaTime;

  if (plant.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return plant.y === zombie.y && zombie.x <= plant.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShots(
        game.shots,
        createPeashot({
          x: plant.x + plant.width,
          y: plant.y + SHOT_HEIGHT / 2,
        }),
        createPeashot({
          x: plant.x + plant.width + TILE_WIDTH / 2,
          y: plant.y + SHOT_HEIGHT / 2,
        })
      );
    }

    plant.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(options);
}

function repeaterTakeDamage(options: PlantTakeDamageOptions<Repeater>) {
  const { plant, damage } = options;

  plant.toughness -= damage;
}

export { createRepeater, drawRepeater, updateRepeater, repeaterTakeDamage };
export type { Repeater };
