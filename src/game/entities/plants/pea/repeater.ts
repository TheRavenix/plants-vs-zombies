import { plantHelpers } from "../plant-helpers";
import { createPeashot, shotActions } from "../../shots";
import { TILE_WIDTH } from "@/game/board";
import { hitboxActions } from "@/game/helpers/hitbox";

import { PlantType } from "../constants";

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
const SPRITE_WIDTH = 96;
const SPRITE_HEIGHT = 96;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

SPRITE_IMAGE.src = "./plants/pea/repeater/Repeater.png";

function createRepeater(options: CreateRepeaterOptions): Repeater {
  const { x, y } = options;
  return {
    type: PlantType.Repeater,
    id: plantHelpers.createPlantId(),
    x,
    y,
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    toughness: TOUGHNESS,
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

function drawRepeater(repeater: Repeater, options: PlantDrawOptions) {
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
          y: repeater.y + 2,
        }),
        createPeashot({
          x: repeater.x + repeater.width + TILE_WIDTH / 2,
          y: repeater.y + 2,
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
