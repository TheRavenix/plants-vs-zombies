import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
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
const SUNCOST = 325;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const THREEPEATER_SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

THREEPEATER_SPRITE_IMAGE.src = "./plants/pea/threepeater/Threepeater.png";

function createThreepeater(options: CreateThreepeaterOptions): Threepeater {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

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
    THREEPEATER_SPRITE_IMAGE,
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
          y: threepeater.y,
        }),
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y,
          direction: ShotDirection.UpRight,
        }),
        createPeashot({
          x: threepeater.x + threepeater.width,
          y: threepeater.y,
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
export { THREEPEATER_SPRITE_IMAGE };
export type { Threepeater };
