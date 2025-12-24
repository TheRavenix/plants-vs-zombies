import { TILE_WIDTH } from "@/game/board";
import { createFirepeaShot, shotActions } from "../../shots";

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

type Firepea = {
  type: PlantType.Firepea;
  shotTimer: number;
} & BasePlant;

type CreateFirepeaOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 175;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const SPRITE_WIDTH = 96;
const SPRITE_HEIGHT = 96;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

SPRITE_IMAGE.src = "./plants/pea/firepea/Firepea.png";

function createFirepea(options: CreateFirepeaOptions): Firepea {
  const { x, y } = options;
  return {
    type: PlantType.Firepea,
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

function drawFirepea(firepea: Firepea, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(firepea.x),
    Math.round(firepea.y),
    firepea.width,
    firepea.height
  );

  hitboxActions.draw(firepea.hitbox, board);
}

function updateFirepea(firepea: Firepea, options: PlantUpdateOptions) {
  const { deltaTime, game } = options;

  firepea.shotTimer += deltaTime;

  if (firepea.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return firepea.y === zombie.y && zombie.x <= firepea.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShot(
        game.shots,
        createFirepeaShot({
          x: firepea.x + firepea.width,
          y: firepea.y + 2,
        })
      );
    }

    firepea.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(firepea);
}

function firepeaTakeDamage(firepea: Firepea, options: PlantTakeDamageOptions) {
  const { damage } = options;

  firepea.toughness -= damage;
}

export { createFirepea, drawFirepea, updateFirepea, firepeaTakeDamage };
export type { Firepea };
