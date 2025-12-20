import { plantHelpers } from "../plant-helpers";
import { createPeashot, SHOT_HEIGHT, shotActions } from "../../shots";
import { TILE_WIDTH } from "@/game/board";
import { hitboxActions } from "@/game/helpers/hitbox";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/vector";

type Repeater = {
  type: PlantType.Repeater;
  shotTimer: number;
} & BasePlant;

type CreateRepeaterOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 100;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;

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

function drawRepeater(repeater: Repeater, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(repeater, options);
  plantHelpers.drawPlantType(repeater, options);

  hitboxActions.draw(repeater.hitbox, board);
}

function updateRepeater(repeater: Repeater, options: PlantUpdateOptions) {
  const { deltaTime, game } = options;

  repeater.shotTimer += deltaTime;

  if (repeater.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return repeater.y === zombie.y && zombie.x <= repeater.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShots(
        game.shots,
        createPeashot({
          x: repeater.x + repeater.width,
          y: repeater.y + SHOT_HEIGHT / 2,
        }),
        createPeashot({
          x: repeater.x + repeater.width + TILE_WIDTH / 2,
          y: repeater.y + SHOT_HEIGHT / 2,
        })
      );
    }

    repeater.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(repeater);
}

function repeaterTakeDamage(
  repeater: Repeater,
  options: PlantTakeDamageOptions
) {
  const { damage } = options;

  repeater.toughness -= damage;
}

export { createRepeater, drawRepeater, updateRepeater, repeaterTakeDamage };
export type { Repeater };
