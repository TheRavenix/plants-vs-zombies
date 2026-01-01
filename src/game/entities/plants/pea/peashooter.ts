import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { createPeashot, shotActions } from "../../shots";

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

type Peashooter = {
  type: PlantType.Peashooter;
  shotTimer: number;
} & BasePlant;

type CreatePeashooterOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 100;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

const PeashooterInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/pea/peashooter/Peashooter.png";

function createPeashooter(options: CreatePeashooterOptions): Peashooter {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Peashooter,
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

function drawPeashooter(peashooter: Peashooter, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(peashooter.x),
    Math.round(peashooter.y),
    peashooter.width,
    peashooter.height
  );

  hitboxActions.draw(peashooter.hitbox, board);
}

function updatePeashooter(peashooter: Peashooter, options: PlantUpdateOptions) {
  const { deltaTime, game } = options;

  peashooter.shotTimer += deltaTime;

  if (peashooter.shotTimer >= SHOT_INTERVAL) {
    const ableToShoot = game.zombies.some((zombie) => {
      return (
        peashooter.y >= zombie.y &&
        peashooter.y <= zombie.y + TILE_HEIGHT &&
        zombie.x <= peashooter.x + RANGE
      );
    });

    if (ableToShoot) {
      game.shots = shotActions.addShot(
        game.shots,
        createPeashot({
          x: peashooter.x + peashooter.width,
          y: peashooter.y,
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
export { PeashooterInfo };
export type { Peashooter };
