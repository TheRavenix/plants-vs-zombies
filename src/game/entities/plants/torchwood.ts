import { plantHelpers } from "./plant-helpers";
import { hitboxActions } from "@/game/helpers/hitbox";
import { createFirepeaShot, shotActions, ShotType } from "../shots";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantType } from "./constants";

import type {
  BasePlant,
  PlantDrawOptions,
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

function createTorchwood(options: CreateTorchwoodOptions): Torchwood {
  const { x, y } = options;
  return {
    type: PlantType.Torchwood,
    id: plantHelpers.createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    toughness: TOUGHNESS,
    sunCost: SUNCOST,
    hitbox: {
      x,
      y,
      width: PLANT_WIDTH,
      height: PLANT_HEIGHT,
    },
  };
}

function drawTorchwood(torchwood: Torchwood, options: PlantDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  plantHelpers.drawPlantRect(torchwood, {
    ...options,
    fillStyle: "#CE2029",
  });
  plantHelpers.drawPlantType(torchwood, options);

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
export type { Torchwood };
