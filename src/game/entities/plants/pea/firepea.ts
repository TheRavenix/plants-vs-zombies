import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { createFirepeaShot, shotActions } from "../../shots";

import { plantHelpers } from "../plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";

import { PlantType } from "../constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
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
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

const FirepeaInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/pea/firepea/Firepea.png";

function createFirepea(options: CreateFirepeaOptions): Firepea {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

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
      return (
        firepea.y >= zombie.y &&
        firepea.y <= zombie.y + TILE_HEIGHT &&
        zombie.x <= firepea.x + RANGE
      );
    });

    if (ableToShoot) {
      game.shots = shotActions.addShot(
        game.shots,
        createFirepeaShot({
          x: firepea.x + firepea.width,
          y: firepea.y,
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
export { FirepeaInfo };
export type { Firepea };
