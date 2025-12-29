import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { createSnowpeaShot, shotActions } from "../../shots";

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

type Snowpea = {
  type: PlantType.Snowpea;
  shotTimer: number;
} & BasePlant;

type CreateSnowpeaOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 175;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SNOWPEA_SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

SNOWPEA_SPRITE_IMAGE.src = "./plants/pea/snowpea/Snowpea.png";

function createSnowpea(options: CreateSnowpeaOptions): Snowpea {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Snowpea,
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

function drawSnowpea(snowpea: Snowpea, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SNOWPEA_SPRITE_IMAGE,
    Math.round(snowpea.x),
    Math.round(snowpea.y),
    snowpea.width,
    snowpea.height
  );

  hitboxActions.draw(snowpea.hitbox, board);
}

function updateSnowpea(snowpea: Snowpea, options: PlantUpdateOptions) {
  const { deltaTime, game } = options;

  snowpea.shotTimer += deltaTime;

  if (snowpea.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return (
        snowpea.y >= zombie.y &&
        snowpea.y <= zombie.y + TILE_HEIGHT &&
        zombie.x <= snowpea.x + RANGE
      );
    });

    if (ableToShoot) {
      game.shots = shotActions.addShot(
        game.shots,
        createSnowpeaShot({
          x: snowpea.x + snowpea.width,
          y: snowpea.y,
        })
      );
    }

    snowpea.shotTimer = 0;
  }

  plantHelpers.syncPlantHitbox(snowpea);
}

function snowpeaTakeDamage(snowpea: Snowpea, options: PlantTakeDamageOptions) {
  const { damage } = options;

  snowpea.toughness -= damage;
}

export { createSnowpea, drawSnowpea, updateSnowpea, snowpeaTakeDamage };
export { SNOWPEA_SPRITE_IMAGE };
export type { Snowpea };
