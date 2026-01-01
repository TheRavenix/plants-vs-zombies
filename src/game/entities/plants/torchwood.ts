import { plantHelpers } from "./plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";
import { createFirepeaShot, shotActions, ShotType } from "../shots";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";

import { PlantType } from "./constants";

import type {
  BasePlant,
  PlantDrawOptions,
  PlantInfoType,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/types/vector";

type Torchwood = {
  type: PlantType.Torchwood;
} & BasePlant;

type CreateTorchwoodOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 175;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);

const TorchwoodInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpriteImage: SPRITE_IMAGE,
  Cooldown: COOLDOWN,
};

SPRITE_IMAGE.src = "./plants/torchwood/Torchwood.png";

function createTorchwood(options: CreateTorchwoodOptions): Torchwood {
  const x = options.x + OFFSET_X;
  const y = options.y + OFFSET_Y;

  return {
    type: PlantType.Torchwood,
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
  };
}

function drawTorchwood(torchwood: Torchwood, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    SPRITE_IMAGE,
    Math.round(torchwood.x),
    Math.round(torchwood.y),
    torchwood.width,
    torchwood.height
  );

  hitboxActions.draw(torchwood.hitbox, board);
}

function updateTorchwood(torchwood: Torchwood, options: PlantUpdateOptions) {
  const { game } = options;

  const shot = game.shots.find((shot) => {
    return hitboxActions.isColliding(torchwood.hitbox, shot.hitbox);
  });

  if (shot !== undefined) {
    if (shot.type === ShotType.Peashot) {
      game.shots = shotActions.removeShotById(game.shots, shot.id);
      game.shots = shotActions.addShot(
        game.shots,
        createFirepeaShot({
          x: shot.x,
          y: shot.y,
          direction: shot.direction,
        })
      );
    }
  }

  plantHelpers.syncPlantHitbox(torchwood);
}

function torchwoodTakeDamage(
  torchwood: Torchwood,
  options: PlantTakeDamageOptions
) {
  const { damage } = options;

  torchwood.toughness -= damage;
}

export { createTorchwood, drawTorchwood, updateTorchwood, torchwoodTakeDamage };
export { TorchwoodInfo };
export type { Torchwood };
