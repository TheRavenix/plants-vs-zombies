import { TILE_WIDTH } from "@/game/board";
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
const SUNCOST = 100;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const SPRITE_WIDTH = 96;
const SPRITE_HEIGHT = 96;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

SPRITE_IMAGE.src = "./plants/pea/snowpea/Snowpea.png";

function createSnowpea(options: CreateSnowpeaOptions): Snowpea {
  const { x, y } = options;
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
    SPRITE_IMAGE,
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
      return snowpea.y === zombie.y && zombie.x <= snowpea.x + RANGE;
    });

    if (ableToShoot) {
      game.shots = shotActions.addShot(
        game.shots,
        createSnowpeaShot({
          x: snowpea.x + snowpea.width,
          y: snowpea.y + 2,
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
export type { Snowpea };
