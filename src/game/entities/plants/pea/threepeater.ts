import { TILE_WIDTH } from "@/game/board";
import { createPeashot, shotActions, ShotDirection } from "../../shots";

import { plantHelpers } from "../plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";

import { PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "../types";
import type { Vector2 } from "@/game/types/vector";

type Threepeater = {
  type: PlantType.Threepeater;
  shotTimer: number;
} & BasePlant;

type CreateThreepeaterOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 100;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const SPRITE_WIDTH = 96;
const SPRITE_HEIGHT = 96;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

SPRITE_IMAGE.src = "./plants/pea/threepeater/Threepeater.png";

function createThreepeater(options: CreateThreepeaterOptions): Threepeater {
  const { x, y } = options;
  return {
    type: PlantType.Threepeater,
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

function drawThreepeater(threepeater: Threepeater, options: PlantDrawOptions) {
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

  hitboxActions.draw(threepeater.hitbox, board);
}

function updateThreepeater(
  threepeater: Threepeater,
  options: PlantUpdateOptions
) {
  const { deltaTime, game } = options;

  threepeater.shotTimer += deltaTime;

  if (threepeater.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return zombie.x <= threepeater.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShots(
        game.shots,
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y + 2,
        }),
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y + 2,
          direction: ShotDirection.UpRight,
        }),
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y + 2,
          direction: ShotDirection.DownRight,
        })
      );
    }

    threepeater.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(threepeater);
}

function threepeaterTakeDamage(
  threepeater: Threepeater,
  options: PlantTakeDamageOptions
) {
  const { damage } = options;

  threepeater.toughness -= damage;
}

export {
  createThreepeater,
  drawThreepeater,
  updateThreepeater,
  threepeaterTakeDamage,
};
export type { Threepeater };
